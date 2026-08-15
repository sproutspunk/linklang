import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiFetch } from "../lib/api";
import { Loader2 } from "lucide-react";

declare global {
  interface Window {
    hcaptcha: any;
  }
}

export default function Register() {
  const navigate = useNavigate();
  const captchaRef = useRef<any>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      setError("Hasło musi mieć: min. 8 znaków, dużą literę, małą literę, cyfrę i znak specjalny (!@#$%^&*)");
      setLoading(false);
      return;
    }
    
    const captchaToken = captchaRef.current?.getResponse?.();
    if (!captchaToken) {
      setError("Proszę potwierdzić, że jesteś człowiekiem");
      setLoading(false);
      return;
    }

    try {
      await apiFetch("/api/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password, captchaToken }),
      });
      navigate("/login");
    } catch (err: any) {
      setError(err.message || "Rejestracja nie powiodła się");
      setLoading(false);
      captchaRef.current?.reset?.();
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-xl font-bold text-slate-900">Załóż konto</h1>
        <p className="mt-1 text-sm text-slate-500">Zacznij korzystać z LinkLang</p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Imię i nazwisko</label>
            <input required value={name} onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Hasło</label>
            <input type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 8 znaków, duża, mała, cyfra, @!#$%"
              className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
            <p className="mt-1 text-xs text-slate-500">Min. 8 znaków, duża litera, mała litera, cyfra, znak specjalny</p>
          </div>
          <div className="h-captcha" data-sitekey="f5561ba5-8d1e-40ca-8cc0-ccc7ee434e78" ref={captchaRef} />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-50">
            {loading && <Loader2 className="h-4 w-4 animate-spin" />} Zarejestruj
          </button>
        </form>
        <p className="mt-6 text-center text-xs text-slate-400">
          Masz już konto? <Link to="/login" className="text-brand-600 hover:underline">Zaloguj się</Link>
        </p>
      </div>
    </div>
  );
}
