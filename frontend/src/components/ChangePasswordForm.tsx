import { useState } from "react";
import { Loader2 } from "lucide-react";
import { apiFetch } from "../lib/api";
import PasswordInput from "./PasswordInput";

const content = {
  PL: {
    title: "Zmiana hasła",
    currentPassword: "Stare hasło",
    newPassword: "Nowe hasło",
    confirmPassword: "Powtórz nowe hasło",
    showPassword: "Pokaż hasło",
    hidePassword: "Ukryj hasło",
    passwordHint: "Hasło musi mieć min. 8 znaków, dużą literę, małą literę, cyfrę i znak specjalny.",
    passwordsDoNotMatch: "Nowe hasła nie są takie same",
    passwordError: "Nowe hasło musi mieć min. 8 znaków, dużą literę, małą literę, cyfrę i znak specjalny (!@#$%^&*)",
    success: "Hasło zostało zmienione",
    error: "Nie udało się zmienić hasła",
    submit: "Zmień hasło",
  },
  EN: {
    title: "Change password",
    currentPassword: "Current password",
    newPassword: "New password",
    confirmPassword: "Repeat new password",
    showPassword: "Show password",
    hidePassword: "Hide password",
    passwordHint: "Password must have at least 8 characters, uppercase, lowercase, number and special character.",
    passwordsDoNotMatch: "New passwords do not match",
    passwordError: "New password must have at least 8 characters, uppercase, lowercase, number and special character (!@#$%^&*)",
    success: "Password has been changed",
    error: "Unable to change password",
    submit: "Change password",
  },
};

export default function ChangePasswordForm({ lang = "PL" }: { lang?: "PL" | "EN" }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const t = content[lang];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError(t.passwordsDoNotMatch);
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      setError(t.passwordError);
      return;
    }

    setSubmitting(true);
    try {
      await apiFetch("/api/change-password", {
        method: "POST",
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setSuccess(t.success);
    } catch (err: any) {
      setError(err.message || t.error);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">{t.title}</h2>
      <form onSubmit={handleSubmit} className="mt-4 grid gap-4 sm:grid-cols-3">
        <PasswordInput
          id="current-password"
          label={t.currentPassword}
          value={currentPassword}
          onChange={setCurrentPassword}
          showLabel={t.showPassword}
          hideLabel={t.hidePassword}
          required
        />
        <PasswordInput
          id="account-new-password"
          label={t.newPassword}
          value={newPassword}
          onChange={setNewPassword}
          showLabel={t.showPassword}
          hideLabel={t.hidePassword}
          required
          minLength={8}
        />
        <PasswordInput
          id="account-confirm-password"
          label={t.confirmPassword}
          value={confirmPassword}
          onChange={setConfirmPassword}
          showLabel={t.showPassword}
          hideLabel={t.hidePassword}
          required
          minLength={8}
        />
        <div className="sm:col-span-3">
          <p className="text-xs text-slate-500">
            {t.passwordHint}
          </p>
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          {success && <p className="mt-2 text-sm text-green-600">{success}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-50"
          >
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />} {t.submit}
          </button>
        </div>
      </form>
    </section>
  );
}
