import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { cloneDefaults } from '../shared/content-defaults.js';
import { getDb, isDbConfigured, initDb } from './db.js';

/**
 * Persistence for content, admin account, and uploads.
 * If DATABASE_URL is set, stores in Neon Postgres.
 * Otherwise, falls back to JSON file storage in server/data/content.json.
 */

const here = path.dirname(fileURLToPath(import.meta.url));
export const DATA_DIR = path.join(here, 'data');
export const UPLOADS_DIR = path.join(DATA_DIR, 'uploads');
const DATA_FILE = path.join(DATA_DIR, 'content.json');
const SEED_FILE = path.join(DATA_DIR, 'seed.json');

function emptyDb() {
  return { admin: null, content: cloneDefaults(), uploads: [], events: [] };
}

function loadSeed() {
  if (!fs.existsSync(SEED_FILE)) return emptyDb();
  try {
    const seed = JSON.parse(fs.readFileSync(SEED_FILE, 'utf8'));
    return {
      ...emptyDb(),
      content: seed.content || cloneDefaults(),
      uploads: Array.isArray(seed.uploads) ? seed.uploads : [],
    };
  } catch (err) {
    console.error(`seed.json is unreadable (${err.message}); using built-in defaults`);
    return emptyDb();
  }
}

export async function addEventEntry(entry) {
  if (isDbConfigured()) {
    await initDb();
    const sql = getDb();
    const rows = await sql`
      INSERT INTO beanery_event_entries (id, name, phone, email, event_type, preferred_date, preferred_time, message, submitted_at)
      VALUES (${entry.id}, ${entry.name}, ${entry.phone}, ${entry.email}, ${entry.eventType}, ${entry.preferredDate}, ${entry.preferredTime}, ${entry.message}, ${entry.submittedAt})
      RETURNING id, name, phone, email, event_type, preferred_date, preferred_time, message, submitted_at
    `;
    return eventFromRow(rows[0]);
  }
  const db = loadFromFile();
  db.events.unshift(entry);
  saveToFile();
  return entry;
}

function eventFromRow(row) {
  return {
    id: row.id, name: row.name, phone: row.phone, email: row.email,
    eventType: row.event_type, preferredDate: row.preferred_date,
    preferredTime: row.preferred_time, message: row.message,
    submittedAt: row.submitted_at instanceof Date ? row.submitted_at.toISOString() : row.submitted_at,
  };
}

export async function listEventEntries() {
  if (isDbConfigured()) {
    await initDb();
    const sql = getDb();
    const rows = await sql`SELECT id, name, phone, email, event_type, preferred_date, preferred_time, message, submitted_at FROM beanery_event_entries ORDER BY submitted_at DESC`;
    return rows.map(eventFromRow);
  }
  return loadFromFile().events || [];
}

function ensureDirs() {
  try {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  } catch {}
}

let fileDb = null;
let loadedMtimeMs = 0;

function changedOnDisk() {
  try {
    return fs.statSync(DATA_FILE).mtimeMs !== loadedMtimeMs;
  } catch {
    return true;
  }
}

function loadFromFile() {
  if (fileDb && !changedOnDisk()) return fileDb;
  ensureDirs();
  if (fs.existsSync(DATA_FILE)) {
    try {
      const parsed = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
      fileDb = { ...emptyDb(), ...parsed };
      loadedMtimeMs = fs.statSync(DATA_FILE).mtimeMs;
    } catch (err) {
      const backup = `${DATA_FILE}.corrupt-${Date.now()}`;
      try {
        fs.renameSync(DATA_FILE, backup);
      } catch {}
      console.error(`content.json was unreadable (${err.message}); moved to ${backup}`);
      fileDb = loadSeed();
      saveToFile();
    }
  } else {
    fileDb = loadSeed();
    saveToFile();
  }
  return fileDb;
}

function saveToFile() {
  ensureDirs();
  const tmp = `${DATA_FILE}.${process.pid}.tmp`;
  try {
    fs.writeFileSync(tmp, JSON.stringify(fileDb, null, 2));
    fs.renameSync(tmp, DATA_FILE);
    loadedMtimeMs = fs.statSync(DATA_FILE).mtimeMs;
  } catch (err) {
    console.error('Error saving to local content.json:', err.message);
  }
}

export async function getContent() {
  if (isDbConfigured()) {
    await initDb();
    const sql = getDb();
    const rows = await sql`SELECT value FROM beanery_content WHERE key = 'main'`;
    if (rows.length > 0) {
      return typeof rows[0].value === 'string' ? JSON.parse(rows[0].value) : rows[0].value;
    }
    return cloneDefaults();
  }
  return loadFromFile().content;
}

export async function setContent(content) {
  if (isDbConfigured()) {
    await initDb();
    const sql = getDb();
    await sql`
      INSERT INTO beanery_content (key, value, updated_at)
      VALUES ('main', ${JSON.stringify(content)}, NOW())
      ON CONFLICT (key) DO UPDATE
      SET value = EXCLUDED.value, updated_at = NOW()
    `;
    return content;
  }
  loadFromFile().content = content;
  saveToFile();
  return content;
}

export async function getAdmin() {
  if (isDbConfigured()) {
    await initDb();
    const sql = getDb();
    const rows = await sql`SELECT username, salt, key FROM beanery_admin LIMIT 1`;
    if (rows.length > 0) {
      return {
        username: rows[0].username,
        salt: rows[0].salt,
        key: rows[0].key,
      };
    }
    return null;
  }
  return loadFromFile().admin;
}

export async function setAdmin(admin) {
  if (isDbConfigured()) {
    await initDb();
    const sql = getDb();
    if (!admin) {
      await sql`DELETE FROM beanery_admin`;
      return null;
    }
    await sql`
      INSERT INTO beanery_admin (username, salt, key)
      VALUES (${admin.username}, ${admin.salt}, ${admin.key})
      ON CONFLICT (username) DO UPDATE
      SET salt = EXCLUDED.salt, key = EXCLUDED.key
    `;
    return admin;
  }
  loadFromFile().admin = admin;
  saveToFile();
  return admin;
}

export async function listUploads() {
  if (isDbConfigured()) {
    await initDb();
    const sql = getDb();
    const rows = await sql`
      SELECT id, url, name, size, uploaded_at as "uploadedAt"
      FROM beanery_uploads
      ORDER BY uploaded_at DESC
    `;
    return rows.map((r) => ({
      ...r,
      size: Number(r.size),
      uploadedAt: new Date(r.uploadedAt).toISOString(),
    }));
  }
  return loadFromFile().uploads;
}

export async function addUpload(entry) {
  if (isDbConfigured()) {
    await initDb();
    const sql = getDb();
    await sql`
      INSERT INTO beanery_uploads (id, url, name, size, uploaded_at)
      VALUES (${entry.id}, ${entry.url}, ${entry.name}, ${entry.size}, ${entry.uploadedAt})
      ON CONFLICT (id) DO UPDATE
      SET url = EXCLUDED.url, name = EXCLUDED.name, size = EXCLUDED.size, uploaded_at = EXCLUDED.uploaded_at
    `;
    return entry;
  }
  loadFromFile().uploads.unshift(entry);
  saveToFile();
  return entry;
}

export async function removeUpload(id) {
  if (isDbConfigured()) {
    await initDb();
    const sql = getDb();
    const rows = await sql`
      DELETE FROM beanery_uploads
      WHERE id = ${id}
      RETURNING id, url, name, size, uploaded_at as "uploadedAt"
    `;
    return rows[0] || null;
  }
  const data = loadFromFile();
  const index = data.uploads.findIndex((u) => u.id === id);
  if (index === -1) return null;
  const [entry] = data.uploads.splice(index, 1);
  saveToFile();
  return entry;
}
