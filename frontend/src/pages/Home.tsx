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
      title: "Tłumaczenia polsko - angielskie\ni obsługa językowa",
      subtitle: "W całej Szkocji i Anglii online. W promieniu 50 mil od Banff także osobiście. Wyślij dokument, otrzymaj wycenę w kilka minut, zapłać online, pobierz gotowe tłumaczenie. Bez dzwonienia. Bez czekania na e-mail.",
      cta: "Zacznij teraz",
      ctaPortal: "Przejdź do panelu",
      pricing: "Tłumaczenia od £35 · Tłumacz ustny od £60 za pierwszą godzinę",
    },
    services: {
      title: "Czego potrzebujesz?",
      items: [
        {
          icon: "doc",
          title: "Tłumaczenie dokumentów",
          desc: "Umowy, akta stanu cywilnego, dokumentacja medyczna, zaświadczenia. Polski na angielski i z powrotem. Cena od £35 - zależy od objętości i terminu. Każdy tekst czytam sam.",
        },
        {
          icon: "users",
          title: "Tłumacz ustny na miejscu",
          desc: "Przyjdę z Tobą do urzędu, szpitala, na spotkanie z pracodawcą lub do kancelarii. Dojeżdżam osobiście w promieniu 50 mil od Banff: Stonehaven, Banchory, Inverurie, Ellon, Peterhead, Fraserburgh, Turriff. Dalej tylko online lub telefon. Od £60 za pierwszą godzinę, kolejne 15 minut po £15.",
        },
        {
          icon: "phone",
          title: "Telefon i wideorozmowa",
          desc: "Zoom, Teams, WhatsApp. Dostępne w całym UK. Jeśli potrzebujesz tłumaczenia od ręki lub masz krótkie pytanie do lekarza lub urzędnika - dzwonię razem z Tobą. Od £30 za pierwsze 30 minut, kolejne 15 minut po £15.",
        },
        {
          icon: "landmark",
          title: "Pomoc w instytucjach publicznych",
          desc: "Universal Credit, HMRC, Jobcentre Plus, NHS. Znam formularze, wiem jakie pytania zadają i jakich dokumentów wymagają. Nie wypełnię formularza za Ciebie, ale przetłumaczę pytania i Twoje odpowiedzi dokładnie tak, jak je podasz. Dostępne osobiście (50 mil od Banff) lub online (całe UK).",
        },
        {
          icon: "building",
          title: "Oferta dla firm",
          desc: "Onboarding polskojęzycznych pracowników, tłumaczenie dokumentów HR, wizyty na budowie, audyty BHP, rozmowy dyscyplinarne. Pakiety abonamentowe - jeśli potrzebujesz tłumacza regularnie, negocjujemy stałą stawkę niższą niż cena jednostkowa. Dostępne osobiście w promieniu 50 mil od Banff lub online w całym UK.",
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
          desc: "Baza w Banff. Dojazd osobisty do 50 mil. Online w całym UK. Znam różnicę między polskim systemem a brytyjskim - wiem, że GP to nie jest POZ, a council tax to nie jest czynsz.",
        },
      ],
    },
    coverage: {
      title: "Obszar działania",
      subtitle: "Tłumacz polsko-angielski dostępny w:",
    },
    disclaimer: "Nie jestem tłumaczem przysięgłym. Jeśli Twój dokument wymaga tłumaczenia poświadczonego do sądu, Home Office lub rejestru stanu cywilnego - skieruję Cię do certyfikowanego partnera. Nie biorę pieniędzy za coś, czego nie mogę wykonać zgodnie z prawem.",
    footer: "© 2026 LinkLang. linklang.co.uk",
    cities: ["Macduff", "Portsoy", "Turriff", "Cullen", "Buckie", "Keith", "Fraserburgh", "Huntly", "Peterhead", "Inverurie", "Elgin", "Ellon", "Lossiemouth", "Forres", "Nairn", "Stonehaven"],
  },
  EN: {
    hero: {
      title: "Polish - English translation\nand interpreting",
      subtitle: "Online anywhere in the UK. In person within a 50-mile radius from Banff. Upload your document, get a quote in minutes, pay online, download when ready. No phone calls. No waiting for e-mails.",
      cta: "Get started",
      ctaPortal: "Go to dashboard",
      pricing: "Written translation from £35 · On-site interpreting from £60 for the first hour",
    },
    services: {
      title: "What do you need?",
      items: [
        {
          icon: "doc",
          title: "Document translation",
          desc: "Contracts, birth and marriage certificates, medical records, employer references. Polish to English and back. From £35, depending on length and deadline. I read every word myself.",
        },
        {
          icon: "users",
          title: "On-site interpreting",
          desc: "I attend with you at the GP surgery, the Jobcentre, the solicitor's office, or the HR meeting. I travel in person within a 50-mile radius from Banff: Stonehaven, Banchory, Inverurie, Ellon, Peterhead, Fraserburgh, Turriff. Beyond that, phone or video only. From £60 for the first hour, then £15 for each additional 15-minute period.",
        },
        {
          icon: "phone",
          title: "Phone and video interpreting",
          desc: "Zoom, Teams, WhatsApp. Available UK-wide. If you need a quick call with your GP, your letting agent, or your child's school - I dial in with you. From £30 for the first 30 minutes, then £15 for each additional 15-minute period.",
        },
        {
          icon: "landmark",
          title: "Public services support",
          desc: "Universal Credit, HMRC, Jobcentre Plus, NHS. I know the forms, the questions they ask, and the documents they want. I will not fill the form in for you, but I will translate every question and your answer exactly as you give it. In person within 50 miles from Banff, or online UK-wide.",
        },
        {
          icon: "building",
          title: "Business packages",
          desc: "Onboarding Polish-speaking staff, translating HR documents, site visits, health-and-safety audits, disciplinary hearings. Retainer packages available - if you need regular support, we agree a fixed monthly rate lower than the standard hourly price. In person within 50 miles from Banff, or online UK-wide.",
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
          desc: "Based in Banff. In-person within 50 miles. Online UK-wide. I know the difference between the Polish system and the British one - I know that a GP is not a POZ, and that council tax is not rent.",
        },
      ],
    },
    coverage: {
      title: "Service area",
      subtitle: "Polish - English translator available in:",
    },
    disclaimer: "I am not a sworn translator. If your document requires a certified translation for court, the Home Office, or the General Register Office, I will refer you to a certified partner. I do not take money for work I cannot perform legally.",
    footer: "© 2026 LinkLang. linklang.co.uk",
    cities: ["Macduff", "Portsoy", "Turriff", "Cullen", "Buckie", "Keith", "Fraserburgh", "Huntly", "Peterhead", "Inverurie", "Elgin", "Ellon", "Lossiemouth", "Forres", "Nairn", "Stonehaven"],
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
    <main className="bg-slate-50">
      {/* Hero Section */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-20 md:py-28">
          <div className="rounded-[2rem] border border-slate-200 bg-gradient-to-br from-slate-50 via-white to-brand-50 p-8 shadow-sm md:p-12">
            <div className="mb-6 inline-flex items-center rounded-full border border-brand-100 bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">
              LinkLang
            </div>
            <h1 className="text-4xl font-medium tracking-tight text-slate-900 md:text-6xl whitespace-pre-line">
              {t.hero.title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-slate-600">
              {t.hero.subtitle}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              {user ? (
                <Link to="/portal" className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-6 py-3 font-medium text-white shadow-sm hover:bg-brand-700">
                  {t.hero.ctaPortal} <ArrowRight className="h-4 w-4" />
                </Link>
              ) : (
                <Link to="/register" className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-6 py-3 font-medium text-white shadow-sm hover:bg-brand-700">
                  {t.hero.cta} <ArrowRight className="h-4 w-4" />
                </Link>
              )}
              <span className="self-center rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700">{t.hero.pricing}</span>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm">
                <Search className="h-3.5 w-3.5 text-brand-600" /> SEO 100/100
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm">
                <Bot className="h-3.5 w-3.5 text-brand-600" /> Agentic Browsing Ready
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm">
                <Leaf className="h-3.5 w-3.5 text-brand-600" /> 0.09 g CO₂ / visit
              </span>
            </div>
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
              <div key={s.title} className="group rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-md">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600 ring-1 ring-brand-100">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-medium text-slate-900">{s.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{s.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Why LinkLang Section */}
      <section className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-2xl font-medium text-slate-900">{t.why.title}</h2>
          <div className="mt-8 grid gap-8 sm:grid-cols-3">
            {t.why.items.map((item) => (
              <div key={item.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600 ring-1 ring-brand-100">
                  {item.icon === "shield" && <ShieldCheck className="h-6 w-6" />}
                  {item.icon === "clock" && <Clock className="h-6 w-6" />}
                  {item.icon === "map" && <MapPin className="h-6 w-6" />}
                </div>
                <h3 className="font-medium text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
          <p className="mt-10 rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600">{t.disclaimer}</p>
        </div>
      </section>

      {/* Service Area Section */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-medium text-slate-900">{t.coverage.title}</h2>
          <p className="mt-2 text-sm text-slate-500">{t.coverage.subtitle}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {t.cities.map((c) => (
              <span key={c} className="rounded-full border border-brand-100 bg-brand-50 px-3 py-1 text-sm font-medium text-brand-700">
                {c}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact-section" className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-2xl px-4 py-16">
          <div className="mb-12 text-center">
            <h2 className="text-2xl font-medium text-slate-900">{lang === "PL" ? "Wyślij wiadomość" : "Send a message"}</h2>
            <p className="mt-2 text-sm text-slate-600">{lang === "PL" ? "Skontaktuj się bezpośrednio" : "Get in touch directly"}</p>
          </div>
          <form onSubmit={handleContactSubmit} className="space-y-4 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <div>
              <label htmlFor="contact-name" className="block text-sm font-medium text-slate-900">{lang === "PL" ? "Imię i nazwisko" : "Name"}</label>
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
              <label htmlFor="contact-email" className="block text-sm font-medium text-slate-900">Email</label>
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
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-sm">
          <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="inline-block mb-6 rounded-full bg-slate-50 p-3 ring-1 ring-slate-200">
            <img src="/linklang_logo.svg" alt="LinkLang" className="mx-auto h-16 w-16" />
          </Link>
          <h2 className="mb-8 text-2xl font-medium text-slate-900">{lang === "PL" ? "Skontaktuj się z LinkLang" : "Contact LinkLang"}</h2>
          <div className="flex flex-col justify-center gap-12 md:flex-row">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="mb-2 text-sm text-slate-500">Email</p>
              <a href="mailto:hello@linklang.co.uk" className="text-lg font-medium text-brand-600 hover:text-brand-700">
                hello@linklang.co.uk
              </a>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="mb-2 text-sm text-slate-500">{lang === "PL" ? "Telefon" : "Phone"}</p>
              <a href="tel:07770110735" className="text-lg font-medium text-brand-600 hover:text-brand-700">
                07770 110735
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
            <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="flex items-center gap-2 hover:opacity-70 transition">
              <img src="/linklang_logo.svg" alt="LinkLang" className="h-6 w-6" />
              <span className="text-sm font-medium text-slate-900">{t.footer}</span>
            </Link>
            <div className="flex gap-6 text-sm">
              <Link to="/privacy" className="text-slate-700 hover:text-brand-600 font-medium">
                {lang === "PL" ? "Polityka prywatności" : "Privacy"}
              </Link>
              <Link to="/terms" className="text-slate-700 hover:text-brand-600 font-medium">
                {lang === "PL" ? "Warunki" : "Terms"}
              </Link>
              <Link to="/support" className="text-slate-700 hover:text-brand-600 font-medium">
                {lang === "PL" ? "Pomoc" : "Support"}
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
