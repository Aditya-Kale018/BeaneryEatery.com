import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { neon } from '@neondatabase/serverless';
import { cloneDefaults } from '../shared/content-defaults.js';

let sqlClient = null;
let initialized = false;

export function isDbConfigured() {
  return Boolean(process.env.DATABASE_URL);
}

export function getDb() {
  if (!process.env.DATABASE_URL) return null;
  if (!sqlClient) {
    sqlClient = neon(process.env.DATABASE_URL);
  }
  return sqlClient;
}

export async function initDb() {
  const sql = getDb();
  if (!sql || initialized) return;

  await sql`
    CREATE TABLE IF NOT EXISTS beanery_content (
      key TEXT PRIMARY KEY,
      value JSONB NOT NULL,
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS beanery_admin (
      username TEXT PRIMARY KEY,
      salt TEXT NOT NULL,
      key TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS beanery_uploads (
      id TEXT PRIMARY KEY,
      url TEXT NOT NULL,
      name TEXT,
      size INT,
      uploaded_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS beanery_sessions (
      token TEXT PRIMARY KEY,
      username TEXT NOT NULL,
      expires_at BIGINT NOT NULL
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS beanery_event_entries (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT NOT NULL DEFAULT '',
      event_type TEXT NOT NULL,
      preferred_date TEXT NOT NULL DEFAULT '',
      preferred_time TEXT NOT NULL DEFAULT '',
      message TEXT NOT NULL,
      submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS beanery_push_subscriptions (
      endpoint TEXT PRIMARY KEY,
      subscription JSONB NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;

  // Check if content is already seeded
  const contentRow = await sql`SELECT value FROM beanery_content WHERE key = 'main'`;
  if (contentRow.length === 0) {
    // Try to seed from local server/data/content.json if present
    const here = path.dirname(fileURLToPath(import.meta.url));
    const localFile = path.join(here, 'data', 'seed.json');
    let seedContent = cloneDefaults();
    let seedUploads = [];

    if (fs.existsSync(localFile)) {
      try {
        const localData = JSON.parse(fs.readFileSync(localFile, 'utf8'));
        if (localData.content) seedContent = localData.content;
        if (Array.isArray(localData.uploads)) seedUploads = localData.uploads;
      } catch (err) {
        console.warn('Could not read local content.json for seeding:', err.message);
      }
    }

    await sql`
      INSERT INTO beanery_content (key, value)
      VALUES ('main', ${JSON.stringify(seedContent)})
      ON CONFLICT (key) DO NOTHING
    `;

    for (const up of seedUploads) {
      if (up.id && up.url) {
        await sql`
          INSERT INTO beanery_uploads (id, url, name, size, uploaded_at)
          VALUES (${up.id}, ${up.url}, ${up.name || ''}, ${up.size || 0}, ${up.uploadedAt || new Date().toISOString()})
          ON CONFLICT (id) DO NOTHING
        `;
      }
    }
  }

  initialized = true;
}
