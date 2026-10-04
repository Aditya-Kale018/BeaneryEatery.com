/** Thin wrapper over the CMS API. Cookies carry the session, so every call
 *  sends credentials and treats a 401 as "signed out". */

const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');
let csrfToken = '';

async function request(path, options = {}) {
  const url = path.startsWith('http') ? path : `${API_BASE}${path}`;
  const method = (options.method || 'GET').toUpperCase();
  const headers = new Headers(options.headers || {});
  if (!['GET', 'HEAD', 'OPTIONS'].includes(method) && csrfToken) {
    headers.set('X-CSRF-Token', csrfToken);
  }

  const res = await fetch(url, { credentials: 'include', ...options, headers });
  const refreshedToken = res.headers.get('X-CSRF-Token');
  if (refreshedToken) csrfToken = refreshedToken;

  // A 401 from login means the submitted credentials were rejected; preserve
  // that server message. Treat 401s on authenticated requests as expired
  // sessions so the editor can return to the sign-in screen.
  const isSignIn = path === '/api/auth/login' || path === '/api/auth/google';
  if (res.status === 401 && !isSignIn) {
    csrfToken = '';
    const err = new Error('Your session has expired. Please sign in again.');
    err.unauthorised = true;
    throw err;
  }

  const isJson = res.headers.get('content-type')?.includes('application/json');
  const body = isJson ? await res.json() : null;

  if (!res.ok) throw new Error(body?.error || `Request failed (${res.status})`);
  return body;
}

const json = (method, url, data) =>
  request(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

export const api = {
  me: () => request('/api/auth/me'),
  login: (username, password) => json('POST', '/api/auth/login', { username, password }),
  google: (credential) => json('POST', '/api/auth/google', { credential }),
  logout: () => request('/api/auth/logout', { method: 'POST' }).finally(() => { csrfToken = ''; }),

  getContent: () => request('/api/content'),
  saveContent: (content) => json('PUT', '/api/content', content),

  listUploads: () => request('/api/uploads'),
  listEvents: () => request('/api/events'),
  deleteUpload: (id) => request(`/api/uploads/${id}`, { method: 'DELETE' }),
  uploadImage: (file) => {
    const form = new FormData();
    form.append('image', file);
    return request('/api/uploads', { method: 'POST', body: form });
  },
};
