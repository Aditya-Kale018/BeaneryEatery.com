import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import test from 'node:test';

import {
  createSession,
  csrfTokenForSession,
  destroySession,
  readSession,
  requireCsrf,
} from '../server/auth.js';
import { isTrustedRequestOrigin, rejectUntrustedWrites } from '../server/security.js';
import { detectImageMime } from '../server/upload-security.js';
import { normaliseContent, normaliseGuestCount } from '../server/validate.js';
import { DEFAULT_CONTENT } from '../shared/content-defaults.js';

function mockRequest(headers = {}, extras = {}) {
  const normalised = Object.fromEntries(
    Object.entries(headers).map(([key, value]) => [key.toLowerCase(), value]),
  );
  return {
    method: 'GET',
    path: '/api/content',
    protocol: 'https',
    get: (name) => normalised[name.toLowerCase()],
    ...extras,
  };
}

function mockResponse() {
  return {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    },
  };
}

test('sessions work without retaining the bearer token as the lookup key', async () => {
  const token = await createSession('security-test@example.com');
  assert.match(token, /^[a-f0-9]{64}$/);
  assert.equal((await readSession(token))?.username, 'security-test@example.com');
  assert.equal(await readSession(crypto.randomBytes(32).toString('hex')), null);
  await destroySession(token);
  assert.equal(await readSession(token), null);
});

test('CSRF middleware accepts only the token derived from the active session', () => {
  const sessionToken = crypto.randomBytes(32).toString('hex');
  const valid = csrfTokenForSession(sessionToken);
  let nextCalled = false;

  requireCsrf(
    mockRequest({ 'x-csrf-token': valid }, { sessionToken }),
    mockResponse(),
    () => { nextCalled = true; },
  );
  assert.equal(nextCalled, true);

  const rejected = mockResponse();
  requireCsrf(mockRequest({ 'x-csrf-token': 'wrong' }, { sessionToken }), rejected, () => {});
  assert.equal(rejected.statusCode, 403);
});

test('origin policy allows same-origin and configured local requests, but blocks attackers', () => {
  assert.equal(isTrustedRequestOrigin(mockRequest({
    origin: 'https://beanery.example',
    host: 'beanery.example',
  })), true);
  assert.equal(isTrustedRequestOrigin(mockRequest({
    origin: 'http://localhost:5173',
    host: 'localhost:3001',
  }, { protocol: 'http' })), true);
  assert.equal(isTrustedRequestOrigin(mockRequest({
    origin: 'http://localhost:5183',
    host: 'localhost:3011',
  }, { protocol: 'http' })), true);
  assert.equal(isTrustedRequestOrigin(mockRequest({
    origin: 'http://localhost.attacker.example:5183',
    host: 'localhost:3011',
  }, { protocol: 'http' })), false);
  assert.equal(isTrustedRequestOrigin(mockRequest({
    origin: 'https://attacker.example',
    host: 'beanery.example',
  })), false);
  assert.equal(isTrustedRequestOrigin(mockRequest({
    origin: 'null',
    host: 'beanery.example',
  })), false);

  const response = mockResponse();
  let nextCalled = false;
  rejectUntrustedWrites(mockRequest({
    origin: 'https://attacker.example',
    host: 'beanery.example',
    'sec-fetch-site': 'cross-site',
  }, { method: 'POST' }), response, () => { nextCalled = true; });
  assert.equal(response.statusCode, 403);
  assert.equal(nextCalled, false);
});

test('only genuine supported image signatures are accepted', () => {
  assert.equal(detectImageMime(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 0])), 'image/png');
  assert.equal(detectImageMime(Buffer.from([0xff, 0xd8, 0xff, 0, 0, 0, 0, 0, 0, 0, 0, 0])), 'image/jpeg');
  assert.equal(detectImageMime(Buffer.from('RIFF0000WEBP', 'ascii')), 'image/webp');
  assert.equal(detectImageMime(Buffer.from('0000ftypavif0000', 'ascii')), 'image/avif');
  assert.equal(detectImageMime(Buffer.from('<script>alert(1)</script>')), '');
});

test('CMS keeps HTTPS images and rejects unsafe or credential-bearing URLs', () => {
  const content = normaliseContent({
    ...DEFAULT_CONTENT,
    images: {
      secure: 'https://images.example/photo.jpg',
      localDevelopment: 'http://localhost:5173/photo.jpg',
      insecure: 'http://images.example/photo.jpg',
      credentials: 'https://user:pass@images.example/photo.jpg',
      executable: 'javascript:alert(1)',
    },
  }, DEFAULT_CONTENT, new Set());

  assert.deepEqual(content.images, {
    secure: 'https://images.example/photo.jpg',
    localDevelopment: 'http://localhost:5173/photo.jpg',
  });
});

test('CMS stores bounded image alignment without accepting malformed values', () => {
  const content = normaliseContent({
    ...DEFAULT_CONTENT,
    imagePositions: {
      topLeft: { x: -50, y: -50 },
      centre: { x: 0, y: 0 },
      bounded: { x: 120, y: -83.7 },
      malformed: { x: '50', y: 0 },
    },
  }, DEFAULT_CONTENT, new Set());

  assert.deepEqual(content.imagePositions, {
    topLeft: { x: -50, y: -50 },
    centre: { x: 0, y: 0 },
    bounded: { x: 50, y: -50 },
  });
});

test('event guest counts accept whole parties within the supported range', () => {
  assert.equal(normaliseGuestCount('24'), 24);
  assert.equal(normaliseGuestCount(1), 1);
  assert.equal(normaliseGuestCount('0'), null);
  assert.equal(normaliseGuestCount('3.5'), null);
  assert.equal(normaliseGuestCount('501'), null);
});

test('tracked CMS seed contains no credentials or private enquiries', () => {
  const seed = JSON.parse(fs.readFileSync(new URL('../server/data/seed.json', import.meta.url), 'utf8'));
  assert.equal('admin' in seed, false);
  assert.equal('events' in seed, false);
  assert.ok(seed.content);
  assert.equal(seed.content.site.reserveUrl, DEFAULT_CONTENT.site.reserveUrl);
});

test('API sends security headers and rejects untrusted preflights', async (t) => {
  process.env.VERCEL = '1';
  const { default: app } = await import('../server/index.js');
  const server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  t.after(() => new Promise((resolve) => server.close(resolve)));

  const { port } = server.address();
  const base = `http://127.0.0.1:${port}`;
  const content = await fetch(`${base}/api/content`);
  assert.equal(content.status, 200);
  assert.equal(content.headers.get('x-powered-by'), null);
  assert.equal(content.headers.get('x-content-type-options'), 'nosniff');
  assert.equal(content.headers.get('x-frame-options'), 'DENY');
  assert.match(content.headers.get('content-security-policy'), /frame-ancestors 'none'/);

  const blocked = await fetch(`${base}/api/content`, {
    method: 'OPTIONS',
    headers: {
      Origin: 'https://attacker.example',
      'Access-Control-Request-Method': 'PUT',
    },
  });
  assert.equal(blocked.status, 403);
  assert.equal(blocked.headers.get('access-control-allow-origin'), null);
});
