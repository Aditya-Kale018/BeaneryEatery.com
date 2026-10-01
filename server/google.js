import { OAuth2Client } from 'google-auth-library';

/**
 * "Sign in with Google" for the admin.
 *
 * Uses the ID-token flow: the browser gets a signed JWT from Google, posts it
 * here, and this module verifies the signature, issuer, audience and expiry
 * against Google's public keys. There is no client *secret* anywhere in this
 * flow - the client ID is public by design - so nothing sensitive is stored.
 *
 * Configure via environment (see .env.example):
 *   GOOGLE_CLIENT_ID   the OAuth Web client ID from Google Cloud Console
 *   ADMIN_EMAILS       comma-separated list of Google accounts allowed in
 */

/** Read lazily: module evaluation order must not decide what we see. */
export function googleClientId() {
  return (process.env.GOOGLE_CLIENT_ID || '').trim();
}

function allowedEmails() {
  return (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function googleConfigured() {
  return Boolean(googleClientId());
}

/** Configured but with nobody allowed in - refuse rather than admit everyone. */
export function googleAllowlistEmpty() {
  return allowedEmails().length === 0;
}

let cachedClient = null;
let cachedFor = '';

function oauthClient() {
  const id = googleClientId();
  if (!id) return null;
  if (cachedFor !== id) {
    cachedClient = new OAuth2Client(id);
    cachedFor = id;
  }
  return cachedClient;
}

/**
 * Verifies a Google credential and returns the signed-in identity.
 * Throws with a user-safe message when the token or the account is not accepted.
 */
export async function verifyGoogleCredential(credential) {
  const client = oauthClient();
  if (!client) throw new Error('Google sign-in is not configured on this server');
  if (typeof credential !== 'string' || !credential) throw new Error('No Google credential received');

  let payload;
  try {
    const ticket = await client.verifyIdToken({ idToken: credential, audience: googleClientId() });
    payload = ticket.getPayload();
  } catch {
    // Never surface the library's internal reason - it says nothing useful to
    // the person signing in and can leak configuration detail.
    throw new Error('That Google sign-in could not be verified. Please try again.');
  }

  const email = (payload?.email || '').toLowerCase();

  // An unverified address must not be trusted: anyone can claim it.
  if (!email || payload.email_verified !== true) {
    throw new Error('That Google account has no verified email address.');
  }

  const allowed = allowedEmails();
  if (allowed.length === 0) {
    throw new Error('No admin emails are configured. Set ADMIN_EMAILS on the server.');
  }
  if (!allowed.includes(email)) {
    throw new Error(`${email} is not on the admin list for this site.`);
  }

  return { username: email, name: payload.name || email, picture: payload.picture || '' };
}
