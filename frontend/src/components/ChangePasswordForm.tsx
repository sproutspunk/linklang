import { useState } from "react";
import { Loader2 } from "lucide-react";
import { apiFetch } from "../lib/api";
import PasswordInput from "./PasswordInput";

export default function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError("Nowe hasła nie są takie same");
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      setError("Nowe hasło musi mieć min. 8 znaków, dużą literę, małą literę, cyfrę i znak specjalny (!@#$%^&*)");
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
      setSuccess("Hasło zostało zmienione");
    } catch (err: any) {
      setError(err.message || "Nie udało się zmienić hasła");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Zmiana hasła</h2>
      <form onSubmit={handleSubmit} className="mt-4 grid gap-4 sm:grid-cols-3">
        <PasswordInput
          id="current-password"
          label="Stare hasło"
          value={currentPassword}
          onChange={setCurrentPassword}
          showLabel="Pokaż hasło"
          hideLabel="Ukryj hasło"
          required
        />
        <PasswordInput
          id="account-new-password"
          label="Nowe hasło"
          value={newPassword}
          onChange={setNewPassword}
          showLabel="Pokaż hasło"
          hideLabel="Ukryj hasło"
          required
          minLength={8}
        />
        <PasswordInput
          id="account-confirm-password"
          label="Powtórz nowe hasło"
          value={confirmPassword}
          onChange={setConfirmPassword}
          showLabel="Pokaż hasło"
          hideLabel="Ukryj hasło"
          required
          minLength={8}
        />
        <div className="sm:col-span-3">
          <p className="text-xs text-slate-500">
            Hasło musi mieć min. 8 znaków, dużą literę, małą literę, cyfrę i znak specjalny.
          </p>
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          {success && <p className="mt-2 text-sm text-green-600">{success}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-50"
          >
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />} Zmień hasło
          </button>
        </div>
      </form>
    </section>
  );
}
