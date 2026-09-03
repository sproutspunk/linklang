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

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character] || character);
}

async function send(apiKey: string, subject: string, to: string, html: string, replyTo?: string): Promise<boolean> {
  try {
    const resend = new Resend(apiKey);
    console.log("[email.send] calling resend", { to, subject, hasApiKey: !!apiKey });
    const { error } = await resend.emails.send({ from: FROM, to, subject, html, ...(replyTo ? { replyTo } : {}) });
    console.log("[email.send] result", {
      success: !error,
      errorName: error?.name,
      errorMessage: error?.message,
      statusCode: (error as { statusCode?: number } | null)?.statusCode,
    });
    if (error) return false;
    return true;
  } catch (err) {
    console.log("[email.send] result", {
      success: false,
      errorName: err instanceof Error ? err.name : undefined,
      errorMessage: err instanceof Error ? err.message : String(err),
      statusCode: (err as { statusCode?: number } | null)?.statusCode,
    });
    return false;
  }
}

export function sendWelcomeEmail(apiKey: string, to: string, name: string) {
  const safeName = escapeHtml(name);
  return send(
    apiKey,
    "Witaj w LinkLang",
    to,
    `<p>Cześć ${safeName},</p><p>Twoje konto w LinkLang zostało utworzone. Możesz teraz złożyć zlecenie tłumaczenia w swoim panelu klienta.</p>`
  );
}

export function sendNewUserNotificationEmail(apiKey: string, to: string, name: string, email: string) {
  return send(
    apiKey,
    "Nowy użytkownik LinkLang",
    to,
    `<p>Utworzono nowe konto w LinkLang.</p><p><strong>Imię i nazwisko:</strong> ${escapeHtml(name)}</p><p><strong>Email:</strong> ${escapeHtml(email)}</p>`
  );
}

export function sendOrderConfirmationEmail(apiKey: string, to: string, name: string, orderId: number) {
  const safeName = escapeHtml(name);
  return send(
    apiKey,
    `Otrzymaliśmy Twoje zlecenie #${String(orderId).padStart(4, "0")}`,
    to,
    `<p>Cześć ${safeName},</p><p>Otrzymaliśmy Twoje zlecenie #${String(orderId).padStart(4, "0")}. Skontaktujemy się z wyceną najszybciej, jak to możliwe.</p>`
  );
}

export function sendQuoteSentEmail(apiKey: string, to: string, name: string, orderId: number, amount: number, currency: string) {
  const safeName = escapeHtml(name);
  const safeCurrency = escapeHtml(currency);
  return send(
    apiKey,
    `Wycena dla zlecenia #${String(orderId).padStart(4, "0")}`,
    to,
    `<p>Cześć ${safeName},</p><p>Przygotowaliśmy wycenę dla Twojego zlecenia #${String(orderId).padStart(4, "0")}: <strong>${amount.toFixed(2)} ${safeCurrency}</strong>.</p><p>Zaloguj się do panelu klienta, aby ją zaakceptować.</p>`
  );
}

export function sendStatusChangeEmail(apiKey: string, to: string, name: string, orderId: number, status: string) {
  const label = STATUS_LABELS[status] || status;
  const safeName = escapeHtml(name);
  const safeLabel = escapeHtml(label);
  return send(
    apiKey,
    `Status zlecenia #${String(orderId).padStart(4, "0")}: ${label}`,
    to,
    `<p>Cześć ${safeName},</p><p>Status Twojego zlecenia #${String(orderId).padStart(4, "0")} zmienił się na: <strong>${safeLabel}</strong>.</p>`
  );
}

export function sendPasswordResetEmail(apiKey: string, to: string, name: string, resetLink: string) {
  const safeName = escapeHtml(name);
  const safeResetLink = escapeHtml(resetLink);
  return send(
    apiKey,
    "LinkLang - Reset hasła",
    to,
    `<p>Cześć ${safeName},</p><p>Otrzymaliśmy prośbę o reset hasła do Twojego konta LinkLang.</p><p><a href="${safeResetLink}" style="background-color: #0f3d2e; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; display: inline-block;">Zmień hasło</a></p><p>Link wygasa za 24 godziny.</p><p>Jeśli nie prosiłeś o reset hasła, zignoruj tę wiadomość.</p>`
  );
}

export function sendContactEmail(apiKey: string, to: string, name: string, email: string, message: string) {
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message).replace(/\n/g, "<br>");
  return send(
    apiKey,
    `Nowa wiadomość kontaktowa od ${name}`,
    to,
    `<p><strong>Imię i nazwisko:</strong> ${safeName}</p><p><strong>Email:</strong> ${safeEmail}</p><p><strong>Wiadomość:</strong></p><p>${safeMessage}</p>`,
    email
  );
}

export function sendContactConfirmationEmail(apiKey: string, to: string, name: string) {
  return send(
    apiKey,
    "LinkLang - potwierdzenie wiadomości",
    to,
    `<p>Cześć ${escapeHtml(name)},</p><p>Dziękujemy za wiadomość. Odpowiemy na nią tak szybko, jak to możliwe.</p><p>If you want, you can also write to meereck@gmail.com.</p><p>Jeśli chcesz, możesz też od razu napisać na meereck@gmail.com.</p>`
  );
}
