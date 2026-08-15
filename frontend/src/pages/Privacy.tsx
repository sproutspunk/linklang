import { useState, useEffect } from "react";

const content = {
  PL: {
    title: "Polityka Prywatności",
    sections: [
      {
        heading: "1. Wprowadzenie",
        content: "LinkLang ('my', 'nas', 'nasz') prowadzi stronę internetową linklang.co.uk. Ta strona jest usługą elektroniczną.\n\nTa polityka prywatności wyjaśnia, jak zbieramy, wykorzystujemy, ujawniamy i w inny sposób obsługujemy Twoje dane osobowe.",
      },
      {
        heading: "2. Informacje, które zbieramy",
        content: "Informacje, które nas dostarczasz, zawierają:",
        list: ["Imię i nazwisko", "Adres e-mail", "Numer telefonu (opcjonalnie)", "Zawartość formularza kontaktowego", "Szczegóły zlecenia tłumaczenia"],
      },
      {
        heading: "3. Jak wykorzystujemy Twoje dane",
        content: "Wykorzystujemy Twoje dane do:",
        list: ["Dostarczania i utrzymania naszych usług", "Wysyłania powiadomień e-mail", "Odpowiadania na Twoje zapytania", "Zgodności z obowiązkami prawnymi", "Zapobiegania oszustwom"],
      },
      {
        heading: "4. Bezpieczeństwo danych",
        content: "Twoje dane osobowe przechowywane są na bezpiecznych serwerach Cloudflare. Stosujemy standardowe środki bezpieczeństwa IT, aby chronić Twoje dane przed nieautoryzowanym dostępem.\n\nNigdy nie udostępniamy Twoich danych osobowych osobom trzecim bez Twojej zgody, z wyjątkiem przypadków wymaganych przez prawo.",
      },
      {
        heading: "5. Cookies",
        content: "Nasza strona używa cookies do:",
        list: ["Zapamiętywania ustawień użytkownika", "Autentykacji użytkownika", "Analizy ruchu strony", "Poprawy doświadczenia użytkownika"],
        note: "Możesz odrzucić cookies, ale to może wpłynąć na funkcjonalność strony.",
      },
      {
        heading: "6. Twoje prawa",
        content: "Masz prawo do:",
        list: ["Dostępu do swoich danych osobowych", "Poprawy swoich danych", "Usunięcia swoich danych", "Wycofania zgody na przetwarzanie danych"],
        note: "Aby skorzystać z tych praw, skontaktuj się z nami: hello@linklang.co.uk",
      },
      {
        heading: "7. Kontakt",
        content: "Jeśli masz pytania dotyczące tej polityki prywatności, skontaktuj się z nami:\n\nEmail: hello@linklang.co.uk\nTelefon: 07770 110735",
      },
      {
        heading: "8. Zmiany w polityce",
        content: "Możemy aktualizować tę politykę prywatności od czasu do czasu. Publikujemy datę ostatniej aktualizacji na tej stronie.\n\nOstatnia aktualizacja: 15 sierpnia 2026",
      },
    ],
  },
  EN: {
    title: "Privacy Policy",
    sections: [
      {
        heading: "1. Introduction",
        content: "LinkLang ('we', 'us', 'our') operates the linklang.co.uk website. This site is an electronic service.\n\nThis privacy policy explains how we collect, use, disclose and otherwise handle your personal information.",
      },
      {
        heading: "2. Information We Collect",
        content: "Information you provide to us includes:",
        list: ["Full name", "Email address", "Phone number (optional)", "Contact form content", "Translation request details"],
      },
      {
        heading: "3. How We Use Your Information",
        content: "We use your information to:",
        list: ["Provide and maintain our services", "Send email notifications", "Respond to your inquiries", "Comply with legal obligations", "Prevent fraud"],
      },
      {
        heading: "4. Data Security",
        content: "Your personal information is stored on secure Cloudflare servers. We use standard IT security measures to protect your data from unauthorized access.\n\nWe never share your personal information with third parties without your consent, except where required by law.",
      },
      {
        heading: "5. Cookies",
        content: "Our site uses cookies to:",
        list: ["Remember user settings", "Authenticate users", "Analyze site traffic", "Improve user experience"],
        note: "You can reject cookies, but this may affect site functionality.",
      },
      {
        heading: "6. Your Rights",
        content: "You have the right to:",
        list: ["Access your personal information", "Correct your information", "Delete your information", "Withdraw consent to data processing"],
        note: "To exercise these rights, contact us: hello@linklang.co.uk",
      },
      {
        heading: "7. Contact",
        content: "If you have questions about this privacy policy, contact us:\n\nEmail: hello@linklang.co.uk\nPhone: 07770 110735",
      },
      {
        heading: "8. Policy Changes",
        content: "We may update this privacy policy from time to time. We publish the date of the last update on this page.\n\nLast updated: 15 August 2026",
      },
    ],
  },
};

export default function Privacy() {
  const [lang, setLang] = useState<"PL" | "EN">("PL");

  useEffect(() => {
    const savedLang = localStorage.getItem("linklang_lang") as "PL" | "EN" | null;
    if (savedLang) setLang(savedLang);
  }, []);

  const t = content[lang];

  return (
    <main className="bg-white">
      <div className="mx-auto max-w-3xl px-4 py-16">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <h1 className="text-4xl font-bold text-slate-900">{t.title}</h1>
          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => setLang("PL")}
              className={`px-3 py-1 rounded text-sm font-medium transition ${
                lang === "PL" ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-700"
              }`}
            >
              PL
            </button>
            <button
              onClick={() => setLang("EN")}
              className={`px-3 py-1 rounded text-sm font-medium transition ${
                lang === "EN" ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-700"
              }`}
            >
              EN
            </button>
          </div>
        </div>
        
        <div className="prose prose-sm max-w-none text-slate-700 space-y-6">
          {t.sections.map((section, idx) => (
            <section key={idx}>
              <h2 className="text-2xl font-medium text-slate-900 mt-8 mb-4">{section.heading}</h2>
              <div className="space-y-2">
                {section.content.split("\n\n").map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
              {section.list && (
                <ul className="list-disc pl-5 space-y-2 mt-4">
                  {section.list.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              )}
              {section.note && (
                <p className="mt-4 text-sm text-slate-600">{section.note}</p>
              )}
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
