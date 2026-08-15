import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { apiFetch } from "../lib/api";
import { Loader2 } from "lucide-react";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const step = token ? "reset" : "email";
  
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleRequestReset(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await apiFetch("/api/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      setSuccess("Email z linkiem do resetowania hasła wysłany!");
      setEmail("");
    } catch (err: any) {
      setError(err.message || "Błąd przy wysyłaniu emaila");
    } finally {
      setLoading(false);
    }
  }

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Hasła nie zgadzają się");
      return;
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      setError("Hasło musi mieć: min. 8 znaków, dużą literę, małą literę, cyfrę i znak specjalny (!@#$%^&*)");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await apiFetch("/api/reset-password", {
        method: "POST",
        body: JSON.stringify({ token, newPassword }),
      });
      setSuccess("Hasło zostało zmienione! Proszę się zalogować.");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err: any) {
      setError(err.message || "Błąd przy resetowaniu hasła");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        {step === "email" ? (
          <>
            <h1 className="text-xl font-bold text-slate-900">Zresetuj hasło</h1>
            <p className="mt-1 text-sm text-slate-500">Wpisz swój email, a wyślemy Ci link do resetowania</p>
            <form onSubmit={handleRequestReset} className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              {success && <p className="text-sm text-green-600">{success}</p>}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-50"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />} Wyślij link
              </button>
            </form>
          </>
        ) : (
          <>
            <h1 className="text-xl font-bold text-slate-900">Nowe hasło</h1>
            <p className="mt-1 text-sm text-slate-500">Wpisz nowe hasło</p>
            <form onSubmit={handleResetPassword} className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">Nowe hasło</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Potwierdź hasło</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              {success && <p className="text-sm text-green-600">{success}</p>}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-50"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />} Zmień hasło
              </button>
            </form>
          </>
        )}
        <p className="mt-6 text-center text-xs text-slate-400">
          Wróć do <Link to="/login" className="text-brand-600 hover:underline">logowania</Link>
        </p>
      </div>
    </div>
  );
}
