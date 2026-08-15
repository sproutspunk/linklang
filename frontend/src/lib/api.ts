import { useAuth } from "./store";

const API_URL = import.meta.env.VITE_API_URL || 
  (typeof window !== 'undefined' && window.location.hostname === 'linklang.co.uk' 
    ? 'https://linklang-api-production.sproutspunk.workers.dev'
    : 'http://localhost:8787');

export async function apiFetch(path: string, options: RequestInit = {}) {
  const token = useAuth.getState().token;
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  if (res.status === 401) {
    useAuth.getState().logout();
    window.location.href = "/login";
    throw new Error("Unauthorized");
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}
