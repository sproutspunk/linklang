import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../lib/store";
import { apiFetch } from "../lib/api";

export default function DevLogin() {
  const navigate = useNavigate();
  const { setAuth, user } = useAuth();

  useEffect(() => {
    if (user) navigate(user.role === "ADMIN" ? "/admin" : "/portal");
  }, [user, navigate]);

  async function loginAsAdmin() {
    try {
      const data = await apiFetch("/api/test-login?role=ADMIN");
      setAuth(data.user, data.token);
      navigate("/admin");
    } catch (err) {
      alert("Błąd: " + (err as any).message);
    }
  }

  async function loginAsClient() {
    try {
      const data = await apiFetch("/api/test-login?role=CLIENT");
      setAuth(data.user, data.token);
      navigate("/portal");
    } catch (err) {
      alert("Błąd: " + (err as any).message);
    }
  }

  async function getResetToken() {
    try {
      const data = await apiFetch("/api/test-reset-token");
      window.location.href = data.link;
    } catch (err) {
      alert("Błąd: " + (err as any).message);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">🛠️ Dev Tools</h1>
        <p className="mt-2 text-sm text-slate-500">Szybkie logowanie do testowania</p>

        <div className="mt-6 space-y-3">
          <button
            onClick={loginAsAdmin}
            className="w-full rounded-lg bg-brand-600 py-3 font-semibold text-white hover:bg-brand-700"
          >
            ✅ Admin
          </button>

          <button
            onClick={loginAsClient}
            className="w-full rounded-lg bg-brand-600 py-3 font-semibold text-white hover:bg-brand-700"
          >
            ✅ Client
          </button>

          <button
            onClick={getResetToken}
            className="w-full rounded-lg bg-brand-600 py-3 font-semibold text-white hover:bg-brand-700"
          >
            🔑 Reset hasła
          </button>
        </div>

        <p className="mt-6 text-xs text-slate-500 text-center">
          Ta strona dostępna jest tylko w dev mode
        </p>
      </div>
    </div>
  );
}
