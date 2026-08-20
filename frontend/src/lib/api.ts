import { useAuth } from "./store";

const DEFAULT_LOCAL_API = "http://localhost:8787";
const DEFAULT_PROD_API = "https://linklang-api-production.sproutspunk.workers.dev";

export async function apiFetch(path: string, options: RequestInit = {}) {
  const token = useAuth.getState().token;
  const hostname = typeof window !== "undefined" ? window.location.hostname : "";

  const isProductionHost =
    hostname === "linklang.co.uk" ||
    hostname === "www.linklang.co.uk" ||
    hostname.endsWith(".linklang.pages.dev") ||
    hostname === "cbd5d8f6.linklang.pages.dev";

  const apiBase =
    import.meta.env.VITE_API_URL ||
    (isProductionHost ? DEFAULT_PROD_API : DEFAULT_LOCAL_API);

  const res = await fetch(`${apiBase}${path}`, {
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
