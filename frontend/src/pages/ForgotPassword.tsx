import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { apiFetch } from "../lib/api";
import { Loader2 } from "lucide-react";
import PasswordInput from "../components/PasswordInput";

const content = {
  PL: {
    requestTitle: "Zresetuj hasło",
    requestSubtitle: "Wpisz swój email, a wyślemy Ci link do resetowania",
    email: "Email",
    sendLink: "Wyślij link",
    resetTitle: "Nowe hasło",
    resetSubtitle: "Wpisz nowe hasło",
    newPassword: "Nowe hasło",
    confirmPassword: "Potwierdź hasło",
    showPassword: "Pokaż hasło",
    hidePassword: "Ukryj hasło",
    changePassword: "Zmień hasło",
    backTo: "Wróć do",
    signIn: "logowania",
    requestSuccess: "Jeśli konto z tym adresem istnieje, wyślemy link do resetowania hasła.",
    requestError: "Błąd przy wysyłaniu emaila",
    passwordsDoNotMatch: "Hasła nie zgadzają się",
    passwordError: "Hasło musi mieć: min. 8 znaków, dużą literę, małą literę, cyfrę i znak specjalny (!@#$%^&*)",
    resetSuccess: "Hasło zostało zmienione! Proszę się zalogować.",
    resetError: "Błąd przy resetowaniu hasła",
  },
  EN: {
    requestTitle: "Reset your password",
    requestSubtitle: "Enter your email and we will send you a password reset link",
    email: "Email",
    sendLink: "Send link",
    resetTitle: "New password",
    resetSubtitle: "Enter your new password",
    newPassword: "New password",
    confirmPassword: "Confirm password",
    showPassword: "Show password",
    hidePassword: "Hide password",
    changePassword: "Change password",
    backTo: "Back to",
    signIn: "sign in",
    requestSuccess: "If an account with this email exists, we will send a password reset link.",
    requestError: "Error sending email",
    passwordsDoNotMatch: "Passwords do not match",
    passwordError: "Password must have: min. 8 characters, uppercase, lowercase, number and special character (!@#$%^&*)",
    resetSuccess: "Your password has been changed. Please sign in.",
    resetError: "Error resetting password",
  },
};

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const step = token ? "reset" : "email";
  const [lang, setLang] = useState<"PL" | "EN">("PL");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const updateLanguage = () => {
      const savedLang = localStorage.getItem("linklang_lang") as "PL" | "EN" | null;
      if (savedLang) setLang(savedLang);
    };
    updateLanguage();
    window.addEventListener("languageChange", updateLanguage);
    window.scrollTo(0, 0);
    return () => window.removeEventListener("languageChange", updateLanguage);
  }, []);

  const t = content[lang];

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
      setSuccess(t.requestSuccess);
      setEmail("");
    } catch (err: any) {
      setError(err.message || t.requestError);
    } finally {
      setLoading(false);
    }
  }

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError(t.passwordsDoNotMatch);
      return;
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      setError(t.passwordError);
      return;
    }

    setLoading(true);
    setError("");
    try {
      await apiFetch("/api/reset-password", {
        method: "POST",
        body: JSON.stringify({ token, newPassword }),
      });
      setSuccess(t.resetSuccess);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err: any) {
      setError(err.message || t.resetError);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        {step === "email" ? (
          <>
            <h1 className="text-xl font-bold text-slate-900">{t.requestTitle}</h1>
            <p className="mt-1 text-sm text-slate-500">{t.requestSubtitle}</p>
            <form onSubmit={handleRequestReset} className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">{t.email}</label>
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
                {loading && <Loader2 className="h-4 w-4 animate-spin" />} {t.sendLink}
              </button>
            </form>
          </>
        ) : (
          <>
            <h1 className="text-xl font-bold text-slate-900">{t.resetTitle}</h1>
            <p className="mt-1 text-sm text-slate-500">{t.resetSubtitle}</p>
            <form onSubmit={handleResetPassword} className="mt-6 space-y-4">
              <PasswordInput
                id="new-password"
                label={t.newPassword}
                value={newPassword}
                onChange={setNewPassword}
                showLabel={t.showPassword}
                hideLabel={t.hidePassword}
                required
                minLength={8}
              />
              <PasswordInput
                id="confirm-password"
                label={t.confirmPassword}
                value={confirmPassword}
                onChange={setConfirmPassword}
                showLabel={t.showPassword}
                hideLabel={t.hidePassword}
                required
                minLength={8}
              />
              {error && <p className="text-sm text-red-600">{error}</p>}
              {success && <p className="text-sm text-green-600">{success}</p>}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-50"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />} {t.changePassword}
              </button>
            </form>
          </>
        )}
        <p className="mt-6 text-center text-xs text-slate-400">
          {t.backTo} <Link to="/login" className="text-brand-600 hover:underline">{t.signIn}</Link>
        </p>
      </div>
    </div>
  );
}
