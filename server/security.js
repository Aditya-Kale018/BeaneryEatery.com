import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';

const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

function normaliseOrigin(value) {
  if (typeof value !== 'string' || !value.trim() || value.trim() === '*') return '';
  try {
    return new URL(value.trim()).origin;
  } catch {
    return '';
  }
}

function configuredOrigins() {
  const configured = [process.env.FRONTEND_URL, process.env.ALLOWED_ORIGINS]
    .filter(Boolean)
    .flatMap((value) => value.split(','))
    .map(normaliseOrigin)
    .filter((origin) => origin && (!IS_PRODUCTION || origin.startsWith('https://')));

  if (!IS_PRODUCTION) {
    configured.push('http://localhost:5173', 'http://localhost:3000', 'http://localhost:3001');
  }

  return new Set(configured);
}

const ALLOWED_ORIGINS = configuredOrigins();

function targetOrigin(req) {
  const forwardedProto = req.get('x-forwarded-proto')?.split(',')[0]?.trim();
  const forwardedHost = req.get('x-forwarded-host')?.split(',')[0]?.trim();
  const protocol = forwardedProto || req.protocol;
  const host = forwardedHost || req.get('host');
  return host ? normaliseOrigin(`${protocol}://${host}`) : '';
}

export function isTrustedRequestOrigin(req) {
  const rawOrigin = req.get('origin');
  if (!rawOrigin) return true;
  const origin = normaliseOrigin(rawOrigin);
  if (!origin) return false;
  return origin === targetOrigin(req) || ALLOWED_ORIGINS.has(origin);
}

/**
 * Reject browser-initiated cross-site writes before body parsing. CORS alone
 * only prevents JavaScript from reading a response; it does not stop a forged
 * form submission from reaching the server.
 */
export function rejectUntrustedWrites(req, res, next) {
  const origin = req.get('origin');
  const fetchSite = req.get('sec-fetch-site');
  const trusted = isTrustedRequestOrigin(req);

  if (req.method === 'OPTIONS' && origin && !trusted) {
    res.status(403).json({ error: 'Origin not allowed' });
    return;
  }

  if (!SAFE_METHODS.has(req.method) && ((origin && !trusted) || (fetchSite === 'cross-site' && !trusted))) {
    res.status(403).json({ error: 'Cross-site request blocked' });
    return;
  }

  next();
}

export function corsOptions(req, callback) {
  const origin = req.get('origin');
  const trusted = !origin || isTrustedRequestOrigin(req);
  callback(null, {
    origin: origin && trusted ? origin : false,
    credentials: true,
    methods: ['GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'X-CSRF-Token'],
    exposedHeaders: ['X-CSRF-Token', 'RateLimit', 'Retry-After'],
    maxAge: 600,
  });
}

export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      baseUri: ["'self'"],
      connectSrc: ["'self'", 'https:'],
      fontSrc: ["'self'", 'data:', 'https://fonts.gstatic.com'],
      formAction: ["'self'"],
      frameAncestors: ["'none'"],
      frameSrc: ['https://accounts.google.com', 'https://www.openstreetmap.org'],
      imgSrc: ["'self'", 'data:', 'blob:', 'https:', ...(IS_PRODUCTION ? [] : ['http:'])],
      objectSrc: ["'none'"],
      scriptSrc: ["'self'", 'https://accounts.google.com'],
      scriptSrcAttr: ["'none'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      upgradeInsecureRequests: IS_PRODUCTION ? [] : null,
    },
  },
  crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' },
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  strictTransportSecurity: IS_PRODUCTION
    ? { maxAge: 31_536_000, includeSubDomains: true }
    : false,
  xFrameOptions: { action: 'deny' },
});

export function additionalSecurityHeaders(req, res, next) {
  res.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=(), usb=()');
  if (req.path === '/admin' || req.path === '/admin.html' || req.path.startsWith('/admin/')) {
    res.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
  }
  next();
}

const limiterDefaults = {
  standardHeaders: 'draft-8',
  legacyHeaders: false,
};

export const apiLimiter = rateLimit({
  ...limiterDefaults,
  windowMs: 15 * 60 * 1000,
  limit: 300,
  message: { error: 'Too many requests. Please try again shortly.' },
});

export const authLimiter = rateLimit({
  ...limiterDefaults,
  windowMs: 15 * 60 * 1000,
  limit: 10,
  skipSuccessfulRequests: true,
  message: { error: 'Too many sign-in attempts. Please wait 15 minutes and try again.' },
});

export const eventLimiter = rateLimit({
  ...limiterDefaults,
  windowMs: 15 * 60 * 1000,
  limit: 5,
  message: { error: 'Too many enquiries were submitted. Please try again later.' },
});

export const uploadLimiter = rateLimit({
  ...limiterDefaults,
  windowMs: 60 * 60 * 1000,
  limit: 30,
  message: { error: 'Too many upload attempts. Please try again later.' },
});
