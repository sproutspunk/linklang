import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/store";
import { apiFetch } from "../lib/api";
import { Loader2 } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await apiFetch("/api/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      setAuth(data.user, data.token);
      navigate(data.user.role === "ADMIN" ? "/admin" : "/portal");
    } catch (err: any) {
      setError(err.message || "Błąd logowania");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-xl font-bold text-slate-900">LinkLang</h1>
        <p className="mt-1 text-sm text-slate-500">Zaloguj się do konta</p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Hasło</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none" />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-50">
            {loading && <Loader2 className="h-4 w-4 animate-spin" />} Zaloguj się
          </button>
        </form>
        <p className="mt-4 text-center text-xs text-slate-400">
          <Link to="/forgot-password" className="text-brand-600 hover:underline">Zapomniałeś hasła?</Link>
        </p>
        <p className="mt-2 text-center text-xs text-slate-400">
          Nie masz konta? <Link to="/register" className="text-brand-600 hover:underline">Zarejestruj</Link>
        </p>
      </div>
    </div>
  );
}
