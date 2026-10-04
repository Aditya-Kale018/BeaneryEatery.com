import crypto from 'node:crypto';
import { getDb, isDbConfigured } from './db.js';

/**
 * Password hashing and session handling.
 *
 * scrypt comes with Node, so there is no native dependency to build. Passwords
 * are never stored or logged in the clear - only the salt and derived key are
 * written to disk, and comparison is timing-safe.
 */

const KEY_LEN = 64;
const SCRYPT_PARAMS = { N: 16384, r: 8, p: 1, maxmem: 64 * 1024 * 1024 };

export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const key = crypto.scryptSync(password, salt, KEY_LEN, SCRYPT_PARAMS).toString('hex');
  return { salt, key };
}

export function verifyPassword(password, record) {
  if (!record?.salt || !record?.key) return false;
  const attempt = crypto.scryptSync(password, record.salt, KEY_LEN, SCRYPT_PARAMS);
  const stored = Buffer.from(record.key, 'hex');
  if (stored.length !== attempt.length) return false;
  return crypto.timingSafeEqual(stored, attempt);
}

const SESSION_TTL_MS = 12 * 60 * 60 * 1000;
const memorySessions = new Map();

/** Never store a bearer token itself: a database read should not grant access. */
function sessionStorageKey(token) {
  return crypto.createHash('sha256').update(String(token || '')).digest('hex');
}

/** A second, JavaScript-readable proof used only for authenticated writes. */
export function csrfTokenForSession(token) {
  if (!token) return '';
  return crypto.createHash('sha256').update(`beanery-csrf:${token}`).digest('base64url');
}

export async function createSession(username) {
  const token = crypto.randomBytes(32).toString('hex');
  const storageKey = sessionStorageKey(token);
  const expiresAt = Date.now() + SESSION_TTL_MS;

  if (isDbConfigured()) {
    const sql = getDb();
    // This CMS has one administrator at a time. Re-authentication revokes any
    // older browser session instead of leaving stolen sessions alive.
    await sql`DELETE FROM beanery_sessions WHERE username = ${username} OR expires_at < ${Date.now()}`;
    await sql`
      INSERT INTO beanery_sessions (token, username, expires_at)
      VALUES (${storageKey}, ${username}, ${expiresAt})
    `;
  } else {
    for (const [key, session] of memorySessions) {
      if (session.username === username || session.expiresAt < Date.now()) memorySessions.delete(key);
    }
    memorySessions.set(storageKey, { username, expiresAt });
  }

  return token;
}

export async function readSession(token) {
  if (!token) return null;
  const storageKey = sessionStorageKey(token);

  if (isDbConfigured()) {
    const sql = getDb();
    const rows = await sql`
      SELECT username, expires_at FROM beanery_sessions
      WHERE token = ${storageKey}
    `;
    if (rows.length === 0) return null;

    const row = rows[0];
    if (Number(row.expires_at) < Date.now()) {
      await sql`DELETE FROM beanery_sessions WHERE token = ${storageKey}`;
      return null;
    }
    return { username: row.username, expiresAt: Number(row.expires_at) };
  }

  const session = memorySessions.get(storageKey);
  if (!session) return null;
  if (session.expiresAt < Date.now()) {
    memorySessions.delete(storageKey);
    return null;
  }
  return session;
}

export async function destroySession(token) {
  if (!token) return;
  const storageKey = sessionStorageKey(token);

  if (isDbConfigured()) {
    const sql = getDb();
    await sql`DELETE FROM beanery_sessions WHERE token = ${storageKey}`;
  } else {
    memorySessions.delete(storageKey);
  }
}

export const SESSION_COOKIE = process.env.NODE_ENV === 'production'
  ? '__Host-beanery_session'
  : 'beanery_session';

export async function requireAuth(req, res, next) {
  const session = await readSession(req.cookies?.[SESSION_COOKIE]);
  if (!session) {
    res.status(401).json({ error: 'Not signed in' });
    return;
  }
  req.user = { username: session.username };
  req.sessionToken = req.cookies?.[SESSION_COOKIE];
  next();
}

export function requireCsrf(req, res, next) {
  const expected = csrfTokenForSession(req.sessionToken);
  const supplied = req.get('x-csrf-token') || '';
  const expectedBuffer = Buffer.from(expected);
  const suppliedBuffer = Buffer.from(supplied);

  if (
    !expected ||
    expectedBuffer.length !== suppliedBuffer.length ||
    !crypto.timingSafeEqual(expectedBuffer, suppliedBuffer)
  ) {
    res.status(403).json({ error: 'Security token missing or expired. Refresh the admin and try again.' });
    return;
  }

  next();
}
