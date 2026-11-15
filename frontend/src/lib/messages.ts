import type { Language } from "./language";
const messages: Record<string, Record<Language, string>> = {
  "Invalid input": {
    "PL": "Sprawdź poprawność wprowadzonych danych.",
    "EN": "Invalid input"
  },
  "Unauthorized": {
    "PL": "Zaloguj się, aby kontynuować.",
    "EN": "Unauthorized"
  },
  "Invalid token": {
    "PL": "Sesja wygasła. Zaloguj się ponownie.",
    "EN": "Invalid token"
  },
  "Forbidden": {
    "PL": "Nie masz uprawnień do tej czynności.",
    "EN": "Forbidden"
  },
  "Too many requests": {
    "PL": "Zbyt wiele prób. Spróbuj ponownie później.",
    "EN": "Too many requests"
  },
  "Email already exists": {
    "PL": "Konto z tym adresem e-mail już istnieje.",
    "EN": "Email already exists"
  },
  "Invalid credentials": {
    "PL": "Nieprawidłowy adres e-mail lub hasło.",
    "EN": "Invalid credentials"
  },
  "User not found": {
    "PL": "Nie znaleziono użytkownika.",
    "EN": "User not found"
  },
  "Not found": {
    "PL": "Nie znaleziono danych.",
    "EN": "Not found"
  },
  "Order not found": {
    "PL": "Nie znaleziono zlecenia.",
    "EN": "Order not found"
  },
  "Nieprawidłowe stare hasło": {
    "PL": "Nieprawidłowe stare hasło",
    "EN": "Incorrect current password"
  },
  "Invalid consent request": {
    "PL": "Nieprawidłowe dane zgody.",
    "EN": "Invalid consent request"
  },
  "Consent is not applicable": {
    "PL": "Zgoda nie dotyczy tego zlecenia.",
    "EN": "Consent is not applicable"
  },
  "Request id already used": {
    "PL": "To żądanie zostało już wykorzystane.",
    "EN": "Request id already used"
  },
  "Invalid withdrawal request": {
    "PL": "Nieprawidłowe dane wycofania zgody.",
    "EN": "Invalid withdrawal request"
  },
  "No active consent": {
    "PL": "Brak aktywnej zgody.",
    "EN": "No active consent"
  },
  "Invalid status": {
    "PL": "Nieprawidłowy status.",
    "EN": "Invalid status"
  },
  "Active health consent is required": {
    "PL": "Wymagana jest aktywna zgoda na przetwarzanie danych o zdrowiu.",
    "EN": "Active health consent is required"
  },
  "Quote is already paid": {
    "PL": "Wycena została już opłacona.",
    "EN": "Quote is already paid"
  },
  "Stripe is not configured": {
    "PL": "Płatności są obecnie niedostępne.",
    "EN": "Stripe is not configured"
  },
  "Invalid quote amount": {
    "PL": "Nieprawidłowa kwota wyceny.",
    "EN": "Invalid quote amount"
  },
  "Could not create payment session": {
    "PL": "Nie udało się rozpocząć płatności.",
    "EN": "Could not create payment session"
  },
  "Content required": {
    "PL": "Wpisz treść wiadomości.",
    "EN": "Content required"
  },
  "Document storage not configured": {
    "PL": "Przechowywanie dokumentów jest obecnie niedostępne.",
    "EN": "Document storage not configured"
  },
  "No file provided": {
    "PL": "Wybierz plik.",
    "EN": "No file provided"
  },
  "File too large (max 10MB)": {
    "PL": "Plik jest za duży (maks. 10 MB).",
    "EN": "File too large (max 10MB)"
  },
  "Upload failed": {
    "PL": "Nie udało się wysłać pliku.",
    "EN": "Upload failed"
  },
  "Document not found": {
    "PL": "Nie znaleziono dokumentu.",
    "EN": "Document not found"
  },
  "File not found in storage": {
    "PL": "Nie znaleziono pliku.",
    "EN": "File not found in storage"
  },
  "Failed to fetch": {
    "PL": "Błąd połączenia. Spróbuj ponownie.",
    "EN": "Failed to fetch"
  },
  "Failed to send email": {
    "PL": "Nie udało się wysłać wiadomości.",
    "EN": "Failed to send email"
  },
  "Invalid or expired token": {
    "PL": "Link jest nieprawidłowy lub wygasł.",
    "EN": "Invalid or expired token"
  }
};

// Resolve stored feedback at render time so visible messages switch with the page.
export function localizeMessage(message: string, lang: Language, copy?: Record<Language, Record<string, unknown>>): string {
  if (copy) {
    for (const key of Object.keys(copy.PL)) {
      if (copy.PL[key] === message || copy.EN[key] === message) {
        const translated = copy[lang][key];
        if (typeof translated === "string") return translated;
      }
    }
  }
  const match = messages[message] || Object.values(messages).find((entry) => entry.PL === message || entry.EN === message);
  return match?.[lang] || (lang === "PL" ? "Nie udało się wykonać operacji. Sprawdź dane i spróbuj ponownie." : "Unable to complete the request. Check your details and try again.");
}
