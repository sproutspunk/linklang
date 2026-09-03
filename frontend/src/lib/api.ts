import { useAuth } from "./store";

const DEFAULT_LOCAL_API = "http://localhost:8787";
const DEFAULT_PROD_API = "https://api.linklang.co.uk";

function getApiBase() {
  const hostname = typeof window !== "undefined" ? window.location.hostname : "";

  const isProductionHost =
    hostname === "linklang.co.uk" ||
    hostname === "www.linklang.co.uk" ||
    hostname.endsWith(".linklang.pages.dev") ||
    hostname === "cbd5d8f6.linklang.pages.dev";

  return (
    import.meta.env.VITE_API_URL ||
    (isProductionHost ? DEFAULT_PROD_API : DEFAULT_LOCAL_API)
  );
}

function getAuthHeaders(): Record<string, string> {
  const token = useAuth.getState().token;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function apiFetch(path: string, options: RequestInit = {}) {
  const apiBase = getApiBase();
  const isFormData = options.body instanceof FormData;

  const res = await fetch(`${apiBase}${path}`, {
    ...options,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...getAuthHeaders(),
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

export async function apiDownload(path: string, filename: string) {
  const apiBase = getApiBase();

  const res = await fetch(`${apiBase}${path}`, {
    headers: getAuthHeaders(),
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

  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}
