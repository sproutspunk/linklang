import { useState, useEffect } from "react";

const content = {
  PL: {
    title: "Warunki Korzystania",
    sections: [
      {
        heading: "1. Akceptacja Warunków",
        content: "Korzystając z linklang.co.uk, akceptujesz niniejsze warunki. Jeśli się z nimi nie zgadzasz, nie używaj naszej strony.",
      },
      {
        heading: "2. Usługi",
        content: "LinkLang oferuje usługi tłumaczenia i interpretacji w oparciu o umowę zawartą między klientem a dostawcą usług.",
      },
      {
        heading: "3. Ceny i Płatności",
        list: ["Wszystkie ceny podawane są w funtach szterlingach (GBP)", "Płatności akceptujemy wyłącznie online", "Płatność jest wymagana przed rozpoczęciem usługi", "Nie oferujemy zwrotów pieniędzy"],
      },
      {
        heading: "4. Poufność i Bezpieczeństwo",
        content: "Wszystkie dokumenty dostarczone LinkLang są traktowane jako poufne i nie będą udostępniane osobom trzecim bez Twojej wyrażonej zgody.\n\nLinkLang stosuje odpowiednie środki bezpieczeństwa do ochrony Twoich danych osobowych i dokumentów.",
      },
      {
        heading: "5. Ograniczenie Odpowiedzialności",
        content: "LinkLang nie ponosi odpowiedzialności za:",
        list: ["Straty pośrednie lub uboczne", "Błędy spowodowane niedokładnym materiałem źródłowym dostarczonego przez klienta", "Opóźnienia spowodowane niewywiązaniem się klienta z obowiązków"],
      },
      {
        heading: "6. Prawa Autorskie",
        content: "Wszelkie materiały na stronie linklang.co.uk, w tym tekst, grafika, logo i kod, są własnością intelektualną LinkLang i chronione prawami autorskimi.",
      },
      {
        heading: "7. Zmiany Warunków",
        content: "LinkLang zastrzega sobie prawo do modyfikacji niniejszych warunków w dowolnym momencie. Kontynuacja korzystania ze strony oznacza akceptację zmian.",
      },
      {
        heading: "8. Jurysdykcja",
        content: "Niniejsze warunki podlegają prawu Szkocji. Wszelkie spory będą rozstrzygane przez sądy szkockie.",
      },
    ],
    lastUpdated: "Ostatnia aktualizacja: 15 sierpnia 2026",
  },
  EN: {
    title: "Terms and Conditions",
    sections: [
      {
        heading: "1. Acceptance of Terms",
        content: "By using linklang.co.uk, you accept these terms and conditions. If you do not agree with them, do not use our website.",
      },
      {
        heading: "2. Services",
        content: "LinkLang offers translation and interpreting services based on a contract between the client and the service provider.",
      },
      {
        heading: "3. Pricing and Payment",
        list: ["All prices are quoted in British pounds (GBP)", "We accept payment online only", "Payment is required before the service begins", "We do not offer refunds"],
      },
      {
        heading: "4. Confidentiality and Security",
        content: "All documents provided to LinkLang are treated as confidential and will not be shared with third parties without your express consent.\n\nLinkLang applies appropriate security measures to protect your personal information and documents.",
      },
      {
        heading: "5. Limitation of Liability",
        content: "LinkLang is not liable for:",
        list: ["Indirect or consequential losses", "Errors caused by inaccurate source material provided by the client", "Delays caused by the client's failure to meet obligations"],
      },
      {
        heading: "6. Copyright",
        content: "All materials on linklang.co.uk, including text, graphics, logos and code, are the intellectual property of LinkLang and protected by copyright laws.",
      },
      {
        heading: "7. Changes to Terms",
        content: "LinkLang reserves the right to modify these terms and conditions at any time. Continued use of the website means you accept any changes.",
      },
      {
        heading: "8. Jurisdiction",
        content: "These terms and conditions are governed by Scottish law. Any disputes will be resolved by the Scottish courts.",
      },
    ],
    lastUpdated: "Last updated: 15 August 2026",
  },
};

export default function Terms() {
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
                {section.content && section.content.split("\n\n").map((para, i) => (
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
            </section>
          ))}
          <p className="text-sm text-slate-500 mt-8">{t.lastUpdated}</p>
        </div>
      </div>
    </main>
  );
}
