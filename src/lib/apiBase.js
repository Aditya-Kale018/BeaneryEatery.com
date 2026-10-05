// Production serves the website and API from separate Vercel deployments.
// Keep public form and admin requests on the same configured backend origin.
export const API_BASE = (
  import.meta.env.DEV
    ? ''
    : import.meta.env.VITE_API_URL || 'https://beanery-eatery-com-backend.vercel.app'
).replace(/\/+$/, '');
