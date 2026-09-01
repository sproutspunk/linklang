import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/store";
import { apiFetch } from "../lib/api";
import { Loader2 } from "lucide-react";
import PasswordInput from "../components/PasswordInput";

const content = {
  PL: {
    title: "Zaloguj się do konta",
    email: "Email",
    password: "Hasło",
    showPassword: "Pokaż hasło",
    hidePassword: "Ukryj hasło",
    signIn: "Zaloguj się",
    forgotPassword: "Zapomniałeś hasła?",
    noAccount: "Nie masz konta?",
    register: "Zarejestruj",
    error: "Błąd logowania",
  },
  EN: {
    title: "Sign in to your account",
    email: "Email",
    password: "Password",
    showPassword: "Show password",
    hidePassword: "Hide password",
    signIn: "Sign in",
    forgotPassword: "Forgot password?",
    noAccount: "Don't have an account?",
    register: "Sign up",
    error: "Sign in error",
  },
};

export default function Login() {
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const [lang, setLang] = useState<"PL" | "EN">("PL");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const savedLang = localStorage.getItem("linklang_lang") as "PL" | "EN" | null;
    if (savedLang) setLang(savedLang);
    window.scrollTo(0, 0);
  }, []);

  const t = content[lang];

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
      setError(err.message || t.error);
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-xl font-bold text-slate-900">LinkLang</h1>
        <p className="mt-1 text-sm text-slate-500">{t.title}</p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">{t.email}</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none" />
          </div>
          <PasswordInput
            id="login-password"
            label={t.password}
            value={password}
            onChange={setPassword}
            showLabel={t.showPassword}
            hideLabel={t.hidePassword}
            required
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-50">
            {loading && <Loader2 className="h-4 w-4 animate-spin" />} {t.signIn}
          </button>
        </form>
        <p className="mt-4 text-center text-xs text-slate-400">
          <Link to="/forgot-password" className="text-brand-600 hover:underline">{t.forgotPassword}</Link>
        </p>
        <p className="mt-2 text-center text-xs text-slate-400">
          {t.noAccount} <Link to="/register" className="text-brand-600 hover:underline">{t.register}</Link>
        </p>
      </div>
    </div>
  );
}
