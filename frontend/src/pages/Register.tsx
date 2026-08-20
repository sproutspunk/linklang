import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiFetch } from "../lib/api";
import { Loader2 } from "lucide-react";

const content = {
  PL: {
    title: "Załóż konto",
    subtitle: "Zacznij korzystać z LinkLang",
    name: "Imię i nazwisko",
    email: "Email",
    password: "Hasło",
    passwordHint: "Min. 8 znaków, duża litera, mała litera, cyfra, znak specjalny",
    passwordPlaceholder: "Min. 8 znaków, duża, mała, cyfra, @!#$%",
    passwordError: "Hasło musi mieć: min. 8 znaków, dużą literę, małą literę, cyfrę i znak specjalny (!@#$%^&*)",
    register: "Zarejestruj",
    error: "Rejestracja nie powiodła się",
    hasAccount: "Masz już konto?",
    signIn: "Zaloguj się",
  },
  EN: {
    title: "Create an account",
    subtitle: "Start using LinkLang",
    name: "Full name",
    email: "Email",
    password: "Password",
    passwordHint: "Min. 8 characters, uppercase, lowercase, number, special character",
    passwordPlaceholder: "Min. 8 chars, uppercase, lowercase, number, @!#$%",
    passwordError: "Password must have: min. 8 characters, uppercase, lowercase, number and special character (!@#$%^&*)",
    register: "Sign up",
    error: "Registration failed",
    hasAccount: "Already have an account?",
    signIn: "Sign in",
  },
};

export default function Register() {
  const navigate = useNavigate();
  const [lang, setLang] = useState<"PL" | "EN">("PL");
  const [name, setName] = useState("");
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
    
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      setError(t.passwordError);
      setLoading(false);
      return;
    }

    try {
      await apiFetch("/api/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
      });
      navigate("/login");
    } catch (err: any) {
      setError(err.message || t.error);
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-xl font-bold text-slate-900">{t.title}</h1>
        <p className="mt-1 text-sm text-slate-500">{t.subtitle}</p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">{t.name}</label>
            <input required value={name} onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">{t.email}</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">{t.password}</label>
            <input type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder={t.passwordPlaceholder}
              className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
            <p className="mt-1 text-xs text-slate-500">{t.passwordHint}</p>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-50">
            {loading && <Loader2 className="h-4 w-4 animate-spin" />} {t.register}
          </button>
        </form>
        <p className="mt-6 text-center text-xs text-slate-400">
          {t.hasAccount} <Link to="/login" className="text-brand-600 hover:underline">{t.signIn}</Link>
        </p>
      </div>
    </div>
  );
}
