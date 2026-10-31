const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
const USER_KEY = 'patient';

export function saveUser(user) {
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch {
    return null;
  }
}

export function loadUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY));
  } catch {
    return null;
  }
}

export function clearUser() {
  try {
    localStorage.removeItem(USER_KEY);
  } catch {
    return null;
  }
}

async function request(path, { method = 'GET', body } = {}) {
  const headers = {};
  if (body) headers['Content-Type'] = 'application/json';

  let res;
  try {
    res = await fetch(`${BASE}${path}`, {
      method,
      headers,
      credentials: 'include',
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error('Cannot reach the server. Please check your connection.');
  }

  if (res.status === 204) return null;
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    
    throw new Error(data.error || data.message ||'Something went wrong.');
  }
  return data;
}

export const api = {
  signup: (body) => request('/auth/signup', { method: 'POST', body }),
  login: (body) => request('/auth/login', { method: 'POST', body }),
  logout: () => request('/auth/logout', { method: 'POST' }),
  addReading: (body) => request('/reading/upload-reading', { method: 'POST', body }),
  updateReading: (id, body) => request(`/reading/${id}`, { method: 'PUT', body }),
  deleteReading: (id) => request(`/reading/${id}`, { method: 'DELETE' }),
  report: (type, date) => request(`/reports/${type}?date=${date}`),
};