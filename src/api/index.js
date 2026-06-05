import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT to every request if one is stored
api.interceptors.request.use(config => {
  const token = localStorage.getItem('medtour_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// On 401 clear stale credentials and bounce to login
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('medtour_token');
      localStorage.removeItem('medtour_user');
      window.location.href = '/admin/login';
    }
    return Promise.reject(err);
  }
);

// Helper: resolves a server-relative image path to its full URL.
// Absolute URLs (Unsplash etc.) are passed through unchanged.
export const mediaUrl = (src) => {
  if (!src) return '';
  if (src.startsWith('http')) return src;
  // In dev, Vite proxies /uploads → Express.
  // In production set VITE_API_URL=https://your-api-domain.com
  const base = import.meta.env.VITE_API_URL || '';
  return `${base}${src}`;
};

export default api;
