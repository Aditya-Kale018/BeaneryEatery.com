// Must come first: it populates process.env for every module below.
import './env.js';

import path from 'node:path';
import fs from 'node:fs';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import multer from 'multer';

import {
  SESSION_COOKIE,
  csrfTokenForSession,
  createSession,
  destroySession,
  readSession,
  requireAuth,
  requireCsrf,
  verifyPassword,
} from './auth.js';
import {
  UPLOADS_DIR,
  addUpload,
  addEventEntry,
  getAdmin,
  getContent,
  listUploads,
  listEventEntries,
  removeUpload,
  setContent,
} from './store.js';
import { normaliseContent } from './validate.js';
import {
  googleAllowlistEmpty,
  googleClientId,
  googleConfigured,
  verifyGoogleCredential,
} from './google.js';
import { isR2Configured, uploadToR2, deleteFromR2 } from './r2.js';
import {
  additionalSecurityHeaders,
  apiLimiter,
  authLimiter,
  corsOptions,
  eventLimiter,
  rejectUntrustedWrites,
  securityHeaders,
  uploadLimiter,
} from './security.js';
import { removeLocalUpload, uploadedFileMatchesMime } from './upload-security.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(here, '..', 'dist');
const PORT = Number(process.env.PORT) || 3001;
const COOKIE_SAME_SITE = process.env.NODE_ENV === 'production' &&
  process.env.CROSS_SITE_COOKIES === 'true' ? 'none' : 'lax';

const app = express();

app.disable('x-powered-by');
if (process.env.NODE_ENV === 'production') app.set('trust proxy', 1);

app.use(securityHeaders);
app.use(additionalSecurityHeaders);
app.use(rejectUntrustedWrites);
app.use(cors(corsOptions));
app.use('/api', apiLimiter);
app.use('/api', (req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});

app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

/* ------------------------------------------------------------ event enquiries -- */

const EVENT_TYPES = new Set(['Private Lounge', 'Rooftop Table', 'Business Gathering', 'Celebration', 'Other']);
const fieldText = (value, limit) => typeof value === 'string' ? value.trim().slice(0, limit) : '';

app.post('/api/events', eventLimiter, async (req, res) => {
  const name = fieldText(req.body?.name, 100);
  const phone = fieldText(req.body?.phone, 40);
  const email = fieldText(req.body?.email, 160);
  const eventType = fieldText(req.body?.eventType, 50);
  const preferredDate = fieldText(req.body?.preferredDate, 10);
  const preferredTime = fieldText(req.body?.preferredTime, 60);
  const message = fieldText(req.body?.message, 2000);
  if (!name || !phone || !EVENT_TYPES.has(eventType) || !message) {
    res.status(400).json({ error: 'Please include your name, phone, event setting and a short note.' });
    return;
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    res.status(400).json({ error: 'Please enter a valid email address.' });
    return;
  }
  try {
    const entry = await addEventEntry({
      id: crypto.randomUUID(), name, phone, email, eventType, preferredDate,
      preferredTime, message, submittedAt: new Date().toISOString(),
    });
    res.status(201).json({ ok: true, id: entry.id });
  } catch (err) {
    console.error('Could not store event enquiry:', err);
    res.status(500).json({ error: 'We could not send your enquiry just now. Please try again.' });
  }
});

app.get('/api/events', requireAuth, async (req, res) => {
  try {
    res.json(await listEventEntries());
  } catch (err) {
    res.status(500).json({ error: 'Could not load event enquiries.' });
  }
});

/* ---------------------------------------------------------------- uploads -- */

const ALLOWED_TYPES = new Map([
  ['image/webp', '.webp'],
  ['image/jpeg', '.jpg'],
  ['image/png', '.png'],
  ['image/avif', '.avif'],
]);

const upload = multer({
  storage: isR2Configured()
    ? multer.memoryStorage()
    : multer.diskStorage({
        destination: (req, file, cb) => cb(null, UPLOADS_DIR),
        filename: (req, file, cb) =>
          cb(null, `${crypto.randomBytes(16).toString('hex')}${ALLOWED_TYPES.get(file.mimetype)}`),
      }),
  limits: { fileSize: 8 * 1024 * 1024, files: 1 },
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_TYPES.has(file.mimetype)) {
      cb(new Error('Only WebP, JPEG, PNG or AVIF images are allowed'));
      return;
    }
    cb(null, true);
  },
});

if (fs.existsSync(UPLOADS_DIR)) {
  app.use('/uploads', express.static(UPLOADS_DIR, {
    dotfiles: 'deny',
    fallthrough: false,
    immutable: true,
    maxAge: '1y',
    setHeaders: (res) => {
      res.set('Content-Security-Policy', "default-src 'none'; sandbox");
      res.set('X-Content-Type-Options', 'nosniff');
    },
  }));
}

/* ------------------------------------------------------------------- auth -- */

async function issueSession(res, username) {
  const token = await createSession(username);
  res.cookie(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: COOKIE_SAME_SITE,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    priority: 'high',
    maxAge: 12 * 60 * 60 * 1000,
  });
  res.set('X-CSRF-Token', csrfTokenForSession(token));
  return token;
}

app.post('/api/auth/google', authLimiter, async (req, res) => {
  if (!googleConfigured()) {
    res.status(503).json({ error: 'Google sign-in is not configured on this server' });
    return;
  }
  try {
    const user = await verifyGoogleCredential(req.body?.credential);
    await issueSession(res, user.username);
    res.json(user);
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
});

app.post('/api/auth/login', authLimiter, async (req, res) => {
  if (googleConfigured()) {
    res.status(403).json({ error: 'This site uses Google sign-in.' });
    return;
  }

  const { username, password } = req.body ?? {};
  const admin = await getAdmin();

  if (!admin) {
    res.status(503).json({ error: 'No admin account yet. Run: npm run admin:password' });
    return;
  }
  if (typeof username !== 'string' || typeof password !== 'string') {
    res.status(400).json({ error: 'Username and password are required' });
    return;
  }
  // Always perform the expensive password check so response timing does not
  // reveal whether a submitted username exists.
  const passwordMatches = verifyPassword(password, admin);
  if (username !== admin.username || !passwordMatches) {
    res.status(401).json({ error: 'Incorrect username or password' });
    return;
  }

  await issueSession(res, admin.username);
  res.json({ username: admin.username });
});

app.post('/api/auth/logout', requireAuth, requireCsrf, async (req, res) => {
  await destroySession(req.cookies?.[SESSION_COOKIE]);
  res.clearCookie(SESSION_COOKIE, {
    sameSite: COOKIE_SAME_SITE,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  });
  res.json({ ok: true });
});

app.get('/api/auth/me', async (req, res) => {
  const sessionToken = req.cookies?.[SESSION_COOKIE];
  const session = await readSession(sessionToken);
  const google = googleConfigured();
  const admin = await getAdmin();
  if (session) res.set('X-CSRF-Token', csrfTokenForSession(sessionToken));
  res.json({
    user: session ? { username: session.username } : null,
    authMode: google ? 'google' : 'password',
    googleClientId: google ? googleClientId() : '',
    googleAllowlistEmpty: google ? googleAllowlistEmpty() : false,
    hasAdmin: Boolean(admin),
  });
});

/* ---------------------------------------------------------------- content -- */

app.get('/api/content', async (req, res) => {
  try {
    const content = await getContent();
    res.json(content);
  } catch (err) {
    console.error('Could not load content:', err);
    res.status(500).json({ error: 'Could not load site content.' });
  }
});

app.put('/api/content', requireAuth, requireCsrf, async (req, res) => {
  try {
    const uploads = await listUploads();
    const uploadUrls = new Set(uploads.map((u) => u.url));
    const current = await getContent();
    const normalised = normaliseContent(req.body, current, uploadUrls);
    const updated = await setContent(normalised);
    res.json(updated);
  } catch (err) {
    console.error('Could not save content:', err);
    res.status(500).json({ error: 'Could not save site content.' });
  }
});

/* ------------------------------------------------------------ upload CRUD -- */

app.get('/api/uploads', requireAuth, async (req, res) => {
  try {
    const uploads = await listUploads();
    res.json(uploads);
  } catch (err) {
    console.error('Could not list uploads:', err);
    res.status(500).json({ error: 'Could not load uploaded images.' });
  }
});

app.post(
  '/api/uploads',
  requireAuth,
  requireCsrf,
  uploadLimiter,
  upload.single('image'),
  async (req, res) => {
    if (!req.file) {
      res.status(400).json({ error: 'No image received' });
      return;
    }

    let fileUrl = '';
    try {
      if (!(await uploadedFileMatchesMime(req.file))) {
        await removeLocalUpload(req.file);
        res.status(400).json({ error: 'The uploaded file contents do not match a supported image type.' });
        return;
      }

      const ext = ALLOWED_TYPES.get(req.file.mimetype);
      const id = crypto.randomBytes(16).toString('hex');

      if (isR2Configured()) {
        const filename = `${id}${ext}`;
        fileUrl = await uploadToR2(filename, req.file.buffer, req.file.mimetype);
      } else {
        fileUrl = `/uploads/${req.file.filename}`;
      }

      const entry = await addUpload({
        id,
        url: fileUrl,
        name: String(req.file.originalname || '').slice(0, 120),
        size: req.file.size,
        uploadedAt: new Date().toISOString(),
      });

      res.status(201).json(entry);
    } catch (err) {
      await removeLocalUpload(req.file);
      if (isR2Configured() && fileUrl) await deleteFromR2(path.basename(fileUrl));
      console.error('Could not store upload:', err);
      res.status(500).json({ error: 'Could not store that image.' });
    }
  },
);

app.delete('/api/uploads/:id', requireAuth, requireCsrf, async (req, res) => {
  try {
    const entry = await removeUpload(req.params.id);
    if (!entry) {
      res.status(404).json({ error: 'No such upload' });
      return;
    }

    const content = await getContent();
    const images = Object.fromEntries(
      Object.entries(content.images || {}).filter(([, url]) => url !== entry.url),
    );
    await setContent({ ...content, images });

    if (isR2Configured()) {
      const filename = path.basename(entry.url);
      await deleteFromR2(filename);
    } else {
      fs.rm(path.join(UPLOADS_DIR, path.basename(entry.url)), { force: true }, () => {});
    }

    res.json({ ok: true });
  } catch (err) {
    console.error('Could not delete upload:', err);
    res.status(500).json({ error: 'Could not delete that image.' });
  }
});

/* -------------------------------------------------------- built site (prod) */

if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
  app.get(/^\/admin\/?$/, (req, res) => res.sendFile(path.join(distDir, 'admin.html')));
  app.use((req, res, next) => {
    const passThrough =
      req.method !== 'GET' || req.path.startsWith('/api/') || req.path.startsWith('/uploads/');
    if (passThrough) {
      next();
      return;
    }
    res.sendFile(path.join(distDir, 'index.html'));
  });
}

// Error handling
app.use((err, req, res, next) => {
  if (res.headersSent) {
    next(err);
    return;
  }
  if (err?.code === 'LIMIT_FILE_SIZE') {
    res.status(413).json({ error: 'Images must be 8 MB or smaller.' });
    return;
  }
  if (err?.message === 'Only WebP, JPEG, PNG or AVIF images are allowed') {
    res.status(400).json({ error: err.message });
    return;
  }
  if (err instanceof SyntaxError && 'body' in err) {
    res.status(400).json({ error: 'Invalid JSON request body.' });
    return;
  }
  console.error('Unhandled request error:', err);
  res.status(500).json({ error: 'Request failed.' });
});

// Standalone server start (when not running as a Vercel serverless function)
if (!process.env.VERCEL && !process.env.NOW_REGION) {
  app.listen(PORT, async () => {
    console.log(`Beanery API on http://localhost:${PORT}`);
    if (googleConfigured()) {
      console.log('Sign-in: Google');
      if (googleAllowlistEmpty()) {
        console.log('  WARNING: ADMIN_EMAILS is empty, so nobody can sign in yet.');
      }
    } else {
      console.log('Sign-in: username and password (set GOOGLE_CLIENT_ID for Google)');
      const admin = await getAdmin();
      if (!admin) {
        console.log('  No admin account yet - create one with: npm run admin:password');
      }
    }
  });
}

export default app;
