import { Resend } from "resend";

const FROM = "LinkLang <hello@linklang.co.uk>";

const STATUS_LABELS: Record<string, string> = {
  NEW: "Przesłane",
  UNDER_REVIEW: "Weryfikacja",
  QUOTE_SENT: "Wycena wysłana",
  APPROVED: "Zaakceptowane",
  PAID: "Opłacone",
  IN_PROGRESS: "W realizacji",
  READY: "Gotowe",
  DOWNLOADED: "Pobrane",
  CANCELLED: "Anulowane",
};

// Email failures must never break the request that triggered them
async function send(apiKey: string, subject: string, to: string, html: string) {
  try {
    const resend = new Resend(apiKey);
    await resend.emails.send({ from: FROM, to, subject, html });
  } catch (err) {
    console.error("Failed to send email:", err);
  }
}

export function sendWelcomeEmail(apiKey: string, to: string, name: string) {
  return send(
    apiKey,
    "Witaj w LinkLang",
    to,
    `<p>Cześć ${name},</p><p>Twoje konto w LinkLang zostało utworzone. Możesz teraz złożyć zlecenie tłumaczenia w swoim panelu klienta.</p>`
  );
}

export function sendOrderConfirmationEmail(apiKey: string, to: string, name: string, orderId: number) {
  return send(
    apiKey,
    `Otrzymaliśmy Twoje zlecenie #${String(orderId).padStart(4, "0")}`,
    to,
    `<p>Cześć ${name},</p><p>Otrzymaliśmy Twoje zlecenie #${String(orderId).padStart(4, "0")}. Skontaktujemy się z wyceną najszybciej, jak to możliwe.</p>`
  );
}

export function sendQuoteSentEmail(apiKey: string, to: string, name: string, orderId: number, amount: number, currency: string) {
  return send(
    apiKey,
    `Wycena dla zlecenia #${String(orderId).padStart(4, "0")}`,
    to,
    `<p>Cześć ${name},</p><p>Przygotowaliśmy wycenę dla Twojego zlecenia #${String(orderId).padStart(4, "0")}: <strong>${amount.toFixed(2)} ${currency}</strong>.</p><p>Zaloguj się do panelu klienta, aby ją zaakceptować.</p>`
  );
}

export function sendStatusChangeEmail(apiKey: string, to: string, name: string, orderId: number, status: string) {
  const label = STATUS_LABELS[status] || status;
  return send(
    apiKey,
    `Status zlecenia #${String(orderId).padStart(4, "0")}: ${label}`,
    to,
    `<p>Cześć ${name},</p><p>Status Twojego zlecenia #${String(orderId).padStart(4, "0")} zmienił się na: <strong>${label}</strong>.</p>`
  );
}

export function sendPasswordResetEmail(apiKey: string, to: string, name: string, resetLink: string) {
  return send(
    apiKey,
    "LinkLang - Reset hasła",
    to,
    `<p>Cześć ${name},</p><p>Otrzymaliśmy prośbę o reset hasła do Twojego konta LinkLang.</p><p><a href="${resetLink}" style="background-color: #0f3d2e; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; display: inline-block;">Zmień hasło</a></p><p>Link wygasa za 24 godziny.</p><p>Jeśli nie prosiłeś o reset hasła, zignoruj tę wiadomość.</p>`
  );
}
