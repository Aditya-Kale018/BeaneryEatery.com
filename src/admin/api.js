/** Thin wrapper over the CMS API. Cookies carry the session, so every call
 *  sends credentials and treats a 401 as "signed out". */

const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');

async function request(path, options = {}) {
  const url = path.startsWith('http') ? path : `${API_BASE}${path}`;
  const res = await fetch(url, { credentials: 'include', ...options });

  if (res.status === 401) {
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
  logout: () => request('/api/auth/logout', { method: 'POST' }),

  getContent: () => request('/api/content'),
  saveContent: (content) => json('PUT', '/api/content', content),

  listUploads: () => request('/api/uploads'),
  deleteUpload: (id) => request(`/api/uploads/${id}`, { method: 'DELETE' }),
  uploadImage: (file) => {
    const form = new FormData();
    form.append('image', file);
    return request('/api/uploads', { method: 'POST', body: form });
  },
};
