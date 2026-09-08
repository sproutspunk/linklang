import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../lib/api";
import { useAuth } from "../lib/store";
import {
  FileText, Users, Phone, Building2, Landmark,
  ArrowRight, ShieldCheck, Clock, MapPin,
  Search, Bot, Leaf,
} from "lucide-react";

type Language = "PL" | "EN";

const content = {
  PL: {
    hero: {
      title: "Tłumaczenia polsko-angielskie w Banff i online",
      subtitle: "Tłumaczę dokumenty oraz rozmowy z polskiego na angielski i z angielskiego na polski. Usługi zdalne są dostępne w całej Wielkiej Brytanii. Na spotkania wyjeżdżam z Banff w Szkocji.\n\nWycenę przygotowuję osobiście po zapoznaniu się z materiałami i oczekiwanym terminem realizacji.",
      cta: "Zapytaj o wycenę",
      ctaPortal: "Przejdź do panelu",
      pricing: "Tłumaczenia od £35 · Tłumacz ustny od £60/h",
    },
    services: {
      title: "Czego potrzebujesz?",
      items: [
        {
          icon: "doc",
          title: "Tłumaczenia dokumentów",
          desc: "Prześlij dokument i podaj, do czego będzie wykorzystany. Na tej podstawie ocenię zakres pracy i przygotuję wycenę.\n\nTłumaczenie jednego tekstu ogólnego do 350 słów kosztuje £35. Cena obejmuje tłumaczenie w jednym kierunku, sprawdzenie tekstu i zachowanie prostego układu dokumentu. Dłuższe teksty ogólne rozliczam po £0.10 za słowo w materiale źródłowym. Stawka obejmuje cały tekst.\n\nDokumenty specjalistyczne, pismo odręczne i materiały wymagające odtworzenia złożonego układu wyceniam indywidualnie.",
        },
        {
          icon: "users",
          title: "Tłumaczenia ustne na miejscu",
          desc: "Pomagam w komunikacji podczas spotkań z pracodawcą, wizyt w instytucjach publicznych i rozmów związanych z działalnością firmy.\n\nCena wynosi £60 za pierwszą godzinę oraz £15 za każde kolejne rozpoczęte 15 minut. Minimalna opłata obejmuje jedną godzinę. Koszt dojazdu jest podawany osobno w wycenie przed rezerwacją.",
        },
        {
          icon: "phone",
          title: "Tłumaczenia przez telefon i wideo",
          desc: "Dołączam do wcześniej umówionej rozmowy i tłumaczę wypowiedzi uczestników w obu kierunkach.\n\nCena wynosi £30 za pierwsze 30 minut oraz £15 za każde kolejne rozpoczęte 15 minut.",
        },
        {
          icon: "landmark",
          title: "Pomoc językowa w instytucjach publicznych",
          desc: "Tłumaczę pytania, odpowiedzi oraz informacje potrzebne podczas kontaktu z Universal Credit, HMRC, Jobcentre Plus i NHS.\n\nPrzy zgłoszeniu podaj nazwę instytucji, temat sprawy i termin spotkania. Pozwoli to ustalić zakres potrzebnej pomocy językowej.",
        },
        {
          icon: "building",
          title: "Obsługa firm",
          desc: "Oferuję tłumaczenia dokumentów HR oraz wsparcie językowe podczas wdrażania polskojęzycznych pracowników, wizyt na budowie, audytów BHP i spotkań dyscyplinarnych.\n\nJeżeli potrzebujesz regularnej obsługi, podaj przewidywaną liczbę godzin i rodzaj zadań. Przygotuję wycenę odpowiadającą temu zakresowi.",
        },
      ],
    },
    why: {
      title: "Dlaczego LinkLang?",
      items: [
        {
          icon: "shield",
          title: "Poufność",
          desc: "Twoje dokumenty nie trafiają do żadnego systemu AI. Nie zapisuję ich w chmurze publicznej. Nie pokazuję ich podmiotom trzecim.",
        },
        {
          icon: "clock",
          title: "Termin",
          desc: "Jeśli nie dam rady zrobić tego na czas - powiem to wprost, zanim zapłacisz. Nie obiecuję czwartku, a potem przepraszam w poniedziałek.",
        },
        {
          icon: "map",
          title: "Zasięg",
          desc: "Baza w Banff. Dojazd osobisty do 25 mil. Online w całym UK. Znam różnicę między polskim systemem a brytyjskim - wiem, że GP to nie jest POZ, a council tax to nie jest czynsz.",
        },
      ],
    },
    coverage: {
      title: "Obszar działania",
      subtitle: "Tłumacz polsko-angielski dostępny w:",
    },
    disclaimer: "Nie jestem tłumaczem przysięgłym. Jeśli Twój dokument wymaga tłumaczenia poświadczonego do sądu, Home Office lub rejestru stanu cywilnego - skieruję Cię do certyfikowanego partnera. Nie biorę pieniędzy za coś, czego nie mogę wykonać zgodnie z prawem.",
    footer: "© 2026 LinkLang. linklang.co.uk",
    cities: ["Aberdeen", "Stonehaven", "Banchory", "Inverurie", "Ellon", "Peterhead", "Fraserburgh", "Turriff", "Glasgow", "Edinburgh", "Dundee", "Inverness", "Perth", "Stirling", "Aberdeenshire", "Highlands", "Scottish Borders", "Fife", "Moray", "Angus"],
  },
  EN: {
    hero: {
      title: "Polish-English translation and interpreting in Banff and online",
      subtitle: "I translate documents and interpret conversations from Polish into English and from English into Polish. Remote services are available throughout the UK. I travel from Banff in Scotland for appointments.\n\nI prepare each quote personally after reviewing the material and your requested deadline.",
      cta: "Request a quote",
      ctaPortal: "Go to dashboard",
      pricing: "Written translation from £35 · On-site interpreting from £60/h",
    },
    services: {
      title: "What do you need?",
      items: [
        {
          icon: "doc",
          title: "Document translation",
          desc: "Send your document and explain what you need it for. I will assess the work and prepare a quote.\n\nTranslation of one general text of up to 350 words costs £35. This includes translation in one direction, checking the text and retaining a simple document layout. Longer general texts are charged at £0.10 per word in the source document. This rate applies to the whole text.\n\nSpecialist documents, handwritten texts and materials requiring complex formatting are quoted individually.",
        },
        {
          icon: "users",
          title: "In-person interpreting",
          desc: "I help with communication at meetings with employers, appointments with public services and business discussions.\n\nThe fee is £60 for the first hour and £15 for each additional 15-minute period or part of one. The minimum charge is one hour. Travel is quoted separately before you book.",
        },
        {
          icon: "phone",
          title: "Phone and video interpreting",
          desc: "I join a pre-booked call and interpret what each participant says in both directions.\n\nThe fee is £30 for the first 30 minutes and £15 for each additional 15-minute period or part of one.",
        },
        {
          icon: "landmark",
          title: "Language support for public services",
          desc: "I interpret questions, answers and information needed when dealing with Universal Credit, HMRC, Jobcentre Plus and the NHS.\n\nWhen you get in touch, include the organisation’s name, the subject of your enquiry and the appointment date. This helps establish the language support you need.",
        },
        {
          icon: "building",
          title: "Business services",
          desc: "I offer HR document translation and language support for onboarding Polish-speaking employees, construction site visits, health and safety audits and disciplinary meetings.\n\nFor regular support, let me know the expected number of hours and the type of work. I will prepare a quote for that scope.",
        },
      ],
    },
    why: {
      title: "Why LinkLang?",
      items: [
        {
          icon: "shield",
          title: "Confidentiality",
          desc: "Your documents do not go into any AI system. I do not store them on a public cloud. I do not show them to third parties.",
        },
        {
          icon: "clock",
          title: "Deadlines",
          desc: "If I cannot meet your timescale, I will tell you straight before you pay. I do not promise Thursday and then apologise on Monday.",
        },
        {
          icon: "map",
          title: "Coverage",
          desc: "Based in Banff. In-person within 25 miles. Online UK-wide. I know the difference between the Polish system and the British one - I know that a GP is not a POZ, and that council tax is not rent.",
        },
      ],
    },
    coverage: {
      title: "Service area",
      subtitle: "Polish-English translator available in:",
    },
    disclaimer: "I am not a sworn translator. If your document requires a certified translation for court, the Home Office, or the General Register Office, I will refer you to a certified partner. I do not take money for work I cannot perform legally.",
    footer: "© 2026 LinkLang. linklang.co.uk",
    cities: ["Aberdeen", "Stonehaven", "Banchory", "Inverurie", "Ellon", "Peterhead", "Fraserburgh", "Turriff", "Glasgow", "Edinburgh", "Dundee", "Inverness", "Perth", "Stirling", "Aberdeenshire", "Highlands", "Scottish Borders", "Fife", "Moray", "Angus"],
  },
};

const iconMap: Record<string, any> = {
  doc: FileText,
  users: Users,
  phone: Phone,
  landmark: Landmark,
  building: Building2,
};

export default function Home() {
  const { user } = useAuth();
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem("linklang_lang") as Language | null;
    return saved || "PL";
  });
  const t = content[lang];

  // Słuchaj zmian języka z Navbar
  useEffect(() => {
    const handleLanguageChange = () => {
      const newLang = localStorage.getItem("linklang_lang") as Language | null;
      if (newLang) setLang(newLang);
    };
    window.addEventListener("languageChange", handleLanguageChange);
    return () => window.removeEventListener("languageChange", handleLanguageChange);
  }, []);

  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "", website: "" });
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [contactError, setContactError] = useState<string | null>(null);

  async function handleContactSubmit(e: React.FormEvent) {
    e.preventDefault();
    setContactError(null);
    setContactSubmitting(true);

    try {
      await apiFetch("/api/contact", {
        method: "POST",
        body: JSON.stringify(contactForm),
      });
      
      // GA4 tracking
      if (window.gtag) {
        window.gtag('event', 'generate_lead', {
          value: 1.0,
          currency: 'GBP',
          method: 'contact_form'
        });
      }
      
      setContactSubmitted(true);
      setContactForm({ name: "", email: "", message: "", website: "" });
      setTimeout(() => {
        setContactSubmitted(false);
      }, 3000);
    } catch (err) {
      console.error("Błąd wysyłania wiadomości:", err);
      setContactError(
        lang === "PL"
          ? "Nie udało się wysłać wiadomości. Spróbuj ponownie później."
          : "The message could not be sent. Please try again later."
      );
    } finally {
      setContactSubmitting(false);
    }
  }

  return (
    <main className="bg-white">
      {/* Hero Section */}
      <section className="bg-brand-600 text-white">
        <div className="mx-auto max-w-6xl px-4 py-20 md:py-28">
          <h1 className="text-4xl font-medium tracking-tight md:text-6xl whitespace-pre-line">
            {t.hero.title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-white opacity-90">
            {t.hero.subtitle}
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            {user ? (
              <Link to="/portal" className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 font-medium text-brand-600 hover:bg-opacity-90">
                {t.hero.ctaPortal} <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <Link to="/register" className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 font-medium text-brand-600 hover:bg-opacity-90">
                {t.hero.cta} <ArrowRight className="h-4 w-4" />
              </Link>
            )}
            <span className="self-center text-sm text-white opacity-80">{t.hero.pricing}</span>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-white">
              <Search className="h-3.5 w-3.5" /> SEO 100/100
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-white">
              <Bot className="h-3.5 w-3.5" /> Agentic Browsing Ready
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-white">
              <Leaf className="h-3.5 w-3.5" /> 0.09 g CO₂ / visit
            </span>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-2xl font-medium text-slate-900">{t.services.title}</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {t.services.items.map((s) => {
            const Icon = iconMap[s.icon];
            return (
              <div key={s.title} className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md hover:border-brand-500">
                <Icon className="h-8 w-8 text-brand-600 opacity-80" />
                <h3 className="mt-4 text-lg font-medium text-slate-900">{s.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{s.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Why LinkLang Section */}
      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-2xl font-medium text-slate-900">{t.why.title}</h2>
          <div className="mt-8 grid gap-8 sm:grid-cols-3">
            {t.why.items.map((item) => (
              <div key={item.title}>
                {item.icon === "shield" && <ShieldCheck className="h-8 w-8 text-brand-600 opacity-80" />}
                {item.icon === "clock" && <Clock className="h-8 w-8 text-brand-600 opacity-80" />}
                {item.icon === "map" && <MapPin className="h-8 w-8 text-brand-600 opacity-80" />}
                <h3 className="mt-4 font-medium text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
          <p className="mt-10 text-sm text-slate-500">{t.disclaimer}</p>
        </div>
      </section>

      {/* Service Area Section */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-lg font-medium text-slate-900">{t.coverage.title}</h2>
        <p className="mt-2 text-sm text-slate-500">{t.coverage.subtitle}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {t.cities.map((c) => (
            <span key={c} className="rounded-full bg-brand-50 px-3 py-1 text-sm text-brand-600">
              {c}
            </span>
          ))}
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact-section" className="border-t border-slate-200 bg-brand-50">
        <div className="mx-auto max-w-2xl px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-medium text-slate-900">{lang === "PL" ? "Wyślij wiadomość" : "Send message"}</h2>
            <p className="mt-2 text-sm text-slate-600">{lang === "PL" ? "Napisz, czego dotyczy zlecenie i na kiedy potrzebujesz tłumaczenia." : "Tell me what you need translated and when you need it."}</p>
          </div>
          <form onSubmit={handleContactSubmit} className="space-y-4">
            <div>
              <label htmlFor="contact-name" className="block text-sm font-medium text-slate-900">{lang === "PL" ? "Imię i nazwisko" : "Full name"}</label>
              <input 
                id="contact-name"
                type="text" 
                required 
                value={contactForm.name}
                onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-brand-600 focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="contact-email" className="block text-sm font-medium text-slate-900">{lang === "PL" ? "Adres e-mail" : "Email address"}</label>
              <input 
                id="contact-email"
                type="email" 
                required 
                value={contactForm.email}
                onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-brand-600 focus:outline-none"
              />
            </div>
            <div className="hidden" aria-hidden="true">
              <label htmlFor="contact-website">Website</label>
              <input
                id="contact-website"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                value={contactForm.website}
                onChange={(e) => setContactForm({...contactForm, website: e.target.value})}
              />
            </div>
            <div>
              <label htmlFor="contact-message" className="block text-sm font-medium text-slate-900">{lang === "PL" ? "Wiadomość" : "Message"}</label>
              <textarea 
                id="contact-message"
                required 
                rows={5}
                value={contactForm.message}
                onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-brand-600 focus:outline-none"
              />
            </div>
            <button 
              type="submit"
              disabled={contactSubmitting}
              className="w-full rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-brand-400"
            >
              {contactSubmitting
                ? lang === "PL"
                  ? "Wysyłanie..."
                  : "Sending..."
                : lang === "PL"
                  ? "Wyślij"
                  : "Send"}
            </button>
            {contactError && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {contactError}
              </div>
            )}
            {contactSubmitted && (
              <div className="text-sm text-green-600">
                <p>✓ {lang === "PL" ? "Wiadomość wysłana!" : "Message sent!"}</p>
                <p className="mt-1">
                  {lang === "PL"
                    ? "Dziękuję za wiadomość. Skontaktuję się z Tobą tak szybko, jak to możliwe."
                    : "Thank you for your message. I’ll get back to you as soon as possible."}
                </p>
              </div>
            )}
          </form>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="text-center">
          <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="inline-block mb-6">
            <img src="/linklang_logo.svg" alt="LinkLang" className="h-16 w-16 mx-auto" />
          </Link>
          <h2 className="text-2xl font-medium text-slate-900 mb-8">{lang === "PL" ? "Skontaktuj się z LinkLang" : "Contact LinkLang"}</h2>
          <div className="flex flex-col md:flex-row justify-center gap-12">
            <div>
              <p className="text-sm text-slate-500 mb-2">Email</p>
              <a href="mailto:hello@linklang.co.uk" className="text-lg font-medium text-brand-600 hover:text-brand-700">
                hello@linklang.co.uk
              </a>
            </div>
            <div>
              <p className="text-sm text-slate-500 mb-2">{lang === "PL" ? "Telefon" : "Phone"}</p>
              <a href="tel:07770110735" className="text-lg font-medium text-brand-600 hover:text-brand-700">
                07770 110735
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-brand-50">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
            <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="flex items-center gap-2 hover:opacity-70 transition">
              <img src="/linklang_logo.svg" alt="LinkLang" className="h-6 w-6" />
              <span className="text-sm font-medium text-slate-900">{t.footer}</span>
            </Link>
            <div className="flex gap-6 text-sm">
              <Link to="/privacy" className="text-slate-700 hover:text-brand-600 font-medium">
                {lang === "PL" ? "Polityka prywatności" : "Privacy policy"}
              </Link>
              <Link to="/terms" className="text-slate-700 hover:text-brand-600 font-medium">
                {lang === "PL" ? "Regulamin" : "Terms and conditions"}
              </Link>
            </div>
          </div>
          <div className="border-t border-slate-200 pt-8 text-xs text-slate-700 text-center">
            <p>{lang === "PL" ? "Designed & built with precision for professional translation services." : "Designed & built with precision for professional translation services."}</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
