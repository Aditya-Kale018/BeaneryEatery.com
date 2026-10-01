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

export async function createSession(username) {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = Date.now() + SESSION_TTL_MS;

  if (isDbConfigured()) {
    const sql = getDb();
    await sql`
      INSERT INTO beanery_sessions (token, username, expires_at)
      VALUES (${token}, ${username}, ${expiresAt})
    `;
  } else {
    memorySessions.set(token, { username, expiresAt });
  }

  return token;
}

export async function readSession(token) {
  if (!token) return null;

  if (isDbConfigured()) {
    const sql = getDb();
    const rows = await sql`
      SELECT username, expires_at FROM beanery_sessions
      WHERE token = ${token}
    `;
    if (rows.length === 0) return null;

    const row = rows[0];
    if (Number(row.expires_at) < Date.now()) {
      await sql`DELETE FROM beanery_sessions WHERE token = ${token}`;
      return null;
    }
    return { username: row.username, expiresAt: Number(row.expires_at) };
  }

  const session = memorySessions.get(token);
  if (!session) return null;
  if (session.expiresAt < Date.now()) {
    memorySessions.delete(token);
    return null;
  }
  return session;
}

export async function destroySession(token) {
  if (!token) return;

  if (isDbConfigured()) {
    const sql = getDb();
    await sql`DELETE FROM beanery_sessions WHERE token = ${token}`;
  } else {
    memorySessions.delete(token);
  }
}

export const SESSION_COOKIE = 'beanery_session';

export async function requireAuth(req, res, next) {
  const session = await readSession(req.cookies?.[SESSION_COOKIE]);
  if (!session) {
    res.status(401).json({ error: 'Not signed in' });
    return;
  }
  req.user = { username: session.username };
  next();
}
