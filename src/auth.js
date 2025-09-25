const STORAGE_KEY = 'auth';

export function getAuth() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

export function setAuth(obj) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
}

export function clearAuth() {
  localStorage.removeItem(STORAGE_KEY);
}

export async function apiFetch(input, init = {}) {
  const auth = getAuth();
  const headers = new Headers(init.headers || {});
  if (auth?.access_token) {
    headers.set('Authorization', `Bearer ${auth.access_token}`);
  }
  return fetch(input, { ...init, headers });
}