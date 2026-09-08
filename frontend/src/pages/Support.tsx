import { useEffect, useState } from "react";
import { Mail, Phone, ShieldCheck, MessageCircleQuestion } from "lucide-react";

const content = {
  PL: {
    title: "Pomoc i wsparcie",
    intro:
      "Potrzebujesz pomocy z wyceną, płatnością, kontem lub gotowym tłumaczeniem? Skontaktuj się ze mną po polsku lub po angielsku.",
    contact: [
      { label: "E-mail", value: "hello@linklang.co.uk", href: "mailto:hello@linklang.co.uk", icon: Mail },
      { label: "Telefon", value: "07770 110735", href: "tel:+447770110735", icon: Phone },
    ],
    sections: [
      {
        heading: "Usługi i wycena",
        items: [
          {
            question: "Jakie usługi oferujesz?",
            answer:
              "Tłumaczę dokumenty i rozmowy z polskiego na angielski oraz z angielskiego na polski. Oferuję tłumaczenia ustne na miejscu, przez telefon i wideo, pomoc językową w instytucjach publicznych oraz obsługę firm.",
          },
          {
            question: "Czy obsługujesz klientów poza Banff?",
            answer:
              "Tak. Usługi zdalne są dostępne w całej Wielkiej Brytanii. Na spotkania wyjeżdżam z Banff w Szkocji. Dostępność i koszt dojazdu ustalam indywidualnie przed rezerwacją.",
          },
          {
            question: "Jak poprosić o wycenę?",
            answer:
              "Prześlij materiały, wskaż kierunek tłumaczenia, przeznaczenie dokumentu i oczekiwany termin. Jeżeli potrzebujesz tłumaczenia ustnego, podaj temat rozmowy, datę, przewidywany czas oraz miejsce spotkania lub sposób połączenia. Jeśli nie wiesz, od czego zacząć, opisz sprawę w e-mailu na hello@linklang.co.uk.",
          },
          {
            question: "Kiedy otrzymam wycenę?",
            answer:
              "Dla kompletnych i czytelnych materiałów o łącznej objętości do 5000 słów w jednym zapytaniu przygotowuję wycenę w ciągu 24 godzin. Przy większych lub trudniejszych do oceny zleceniach w tym czasie podam termin wyceny albo poproszę o dodatkowe informacje. Do tych 24 godzin nie wlicza się sobót, niedziel ani świąt.",
          },
          {
            question: "Ile kosztuje tłumaczenie?",
            answer:
              "Jeden tekst ogólny do 350 słów kosztuje £35. Cena obejmuje tłumaczenie w jednym kierunku, sprawdzenie tekstu i zachowanie prostego układu dokumentu. Dłuższe teksty ogólne kosztują £0.10 za słowo w całym materiale źródłowym. Tłumaczenie ustne na miejscu kosztuje £60 za pierwszą godzinę, a przez telefon lub wideo £30 za pierwsze 30 minut. Każde kolejne rozpoczęte 15 minut kosztuje £15.",
          },
        ],
      },
      {
        heading: "Zamówienia i płatności",
        items: [
          {
            question: "Jak złożyć zlecenie przez panel?",
            answer:
              "Zaloguj się do konta i utwórz nowe zlecenie. Wybierz rodzaj usługi, wskaż kierunek tłumaczenia i termin, dodaj dokumenty oraz instrukcje. Przed zamówieniem usługi sprawdź przygotowaną wycenę.",
          },
          {
            question: "Jak długo jest ważna wycena?",
            answer:
              "Przez 14 dni, chyba że podano w niej inny termin. Jeśli wycena wygasła, skontaktuj się ze mną. Termin spotkania wymaga potwierdzenia dostępności.",
          },
          {
            question: "Jak zapłacić?",
            answer:
              "Po zatwierdzeniu wyceny przejdź do płatności. Obsługuje ją Stripe. Dostępne metody są wyświetlane na stronie płatności.",
          },
          {
            question: "Płatność nie działa lub status zlecenia się nie zmienił. Co zrobić?",
            answer:
              "Sprawdź, czy otrzymałeś potwierdzenie płatności. Jeśli widzisz obciążenie lub płatność oczekującą, skontaktuj się ze mną przed ponowną próbą zapłaty. Podaj numer zlecenia, datę, kwotę i treść komunikatu błędu. Nie przesyłaj pełnego numeru karty ani kodu zabezpieczającego.",
          },
        ],
      },
      {
        heading: "Dokumenty i odbiór",
        items: [
          {
            question: "Jak przygotować dokument?",
            answer:
              "Prześlij wszystkie potrzebne strony w czytelnej postaci, z widocznym tekstem i bez uciętych fragmentów. Dodaj informację, do czego tłumaczenie będzie wykorzystane. Jeśli odbiorca wymaga określonego formatu lub poświadczenia, podaj te wymagania przed wyceną.",
          },
          {
            question: "Jak otrzymam gotowe tłumaczenie?",
            answer:
              "Po opłaceniu zlecenia gotowe tłumaczenie otrzymasz e-mailem. Pobierzesz je również po zalogowaniu do panelu klienta. Zachowaj własną kopię pliku.",
          },
          {
            question: "Nie dostałem e-maila z tłumaczeniem. Co zrobić?",
            answer:
              "Sprawdź folder spam i adres e-mail przypisany do konta. Zaloguj się do panelu, aby sprawdzić dostępność pliku. Jeśli tłumaczenie powinno być już gotowe, napisz na hello@linklang.co.uk.",
          },
          {
            question: "Kto ma dostęp do dokumentów?",
            answer:
              "Korzystam z dokumentów przy obsłudze i wykonaniu zlecenia. Gotowe tłumaczenie jest przeznaczone dla klienta, który je zamówił. Dostawcy infrastruktury i usług potrzebnych do dostarczenia plików mogą również przetwarzać dane. Informacje o odbiorcach i przechowywaniu znajdziesz w polityce prywatności.",
          },
        ],
      },
      {
        heading: "Zmiany, anulowanie i reklamacje",
        items: [
          {
            question: "Czy mogę anulować zlecenie?",
            answer:
              "Tak. Przed płatnością możesz anulować je bez kosztów. Po zapłacie, ale przed rozpoczęciem realizacji, otrzymasz pełny zwrot. Konsumentom zamawiającym na odległość przysługuje ustawowe prawo odstąpienia.",
          },
          {
            question: "Co zrobić, jeśli w tłumaczeniu jest błąd?",
            answer:
              "Skontaktuj się ze mną i wskaż fragment oraz przyczynę zastrzeżeń. Sprawdzę go w odniesieniu do materiału źródłowego i uzgodnionego zakresu. Możesz zgłosić reklamację także po siedmiu dniach od dostarczenia. Nie ogranicza to Twoich ustawowych praw.",
          },
          {
            question: "Jak złożyć reklamację?",
            answer:
              "Napisz na hello@linklang.co.uk, zadzwoń lub prześlij wiadomość dotyczącą zlecenia. Opisz, co się wydarzyło i jakiego rozwiązania oczekujesz. Sprawdzę zgłoszenie bez zbędnej zwłoki i poinformuję Cię o wyniku lub dalszych krokach.",
          },
        ],
      },
      {
        heading: "Konto i prywatność",
        items: [
          {
            question: "Nie pamiętam hasła. Jak odzyskać dostęp?",
            answer:
              "Na stronie logowania wybierz opcję odzyskania hasła i wpisz adres e-mail użyty podczas rejestracji. Postępuj zgodnie z instrukcjami w wiadomości. Jeśli nie otrzymasz e-maila, sprawdź spam lub skontaktuj się ze mną.",
          },
          {
            question: "Podejrzewam, że ktoś uzyskał dostęp do mojego konta. Co zrobić?",
            answer:
              "Zmień hasło do LinkLang i zabezpiecz skrzynkę e-mail. Zgłoś problem na hello@linklang.co.uk lub telefonicznie. Nie udostępniaj hasła ani kodów dostępu w wiadomości.",
          },
          {
            question: "Jak zamknąć konto lub poprosić o usunięcie danych?",
            answer:
              "Napisz na hello@linklang.co.uk. Wskaż, czy chcesz zamknąć konto, usunąć określone dane, czy skorzystać z innego prawa. Mogę poprosić o informacje potrzebne do potwierdzenia tożsamości.",
          },
        ],
      },
    ],
  },
  EN: {
    title: "Support and help",
    intro:
      "Need help with a quote, payment, your account or a completed translation? Contact me in Polish or English.",
    contact: [
      { label: "Email", value: "hello@linklang.co.uk", href: "mailto:hello@linklang.co.uk", icon: Mail },
      { label: "Phone", value: "07770 110735", href: "tel:+447770110735", icon: Phone },
    ],
    sections: [
      {
        heading: "Services and quotes",
        items: [
          {
            question: "What services do you offer?",
            answer:
              "I translate documents and interpret conversations from Polish into English and from English into Polish. Services include interpreting in person, by phone and by video, language support for public services, and support for businesses.",
          },
          {
            question: "Do you work outside Banff?",
            answer:
              "Yes. Remote services are available throughout the UK. I travel from Banff in Scotland for appointments. Travel availability and charges are agreed individually before booking.",
          },
          {
            question: "How do I request a quote?",
            answer:
              "Send the material, specify the translation direction and intended use, and give your requested deadline. For interpreting, include the subject, date, expected duration and appointment location or connection method. If you are unsure where to start, describe what you need in an email to hello@linklang.co.uk.",
          },
          {
            question: "When will I receive a quote?",
            answer:
              "For complete, legible material totalling up to 5,000 words in one enquiry, I prepare a quote within 24 hours. For larger or more complex requests, I will confirm when the quote will be ready or ask for further information within that time.",
          },
          {
            question: "How much does a translation cost?",
            answer:
              "One general text of up to 350 words costs £35. This includes translation in one direction, checking the text and retaining a simple document layout. Longer general texts cost £0.10 per word in the whole source text. Interpreting in person costs £60 for the first hour. Phone or video interpreting costs £30 for the first 30 minutes.",
          },
        ],
      },
      {
        heading: "Orders and payments",
        items: [
          {
            question: "How do I place an order through my account?",
            answer:
              "Sign in and create a new order. Select the service, specify the translation direction and deadline, and add your documents and instructions. Review the quote before ordering the service.",
          },
          {
            question: "How long is a quote valid?",
            answer:
              "For 14 days unless a different period is stated. Contact me if your quote has expired. Appointment availability must be confirmed.",
          },
          {
            question: "How do I pay?",
            answer:
              "After approving the quote, proceed to payment. Stripe handles the payment process. Available methods are displayed at checkout.",
          },
          {
            question: "My payment failed or the order status has not changed. What should I do?",
            answer:
              "Check whether you received a payment confirmation. If you see a charge or pending payment, contact me before trying to pay again. Include the order reference, date, amount and error message. Do not send your full card number or security code.",
          },
        ],
      },
      {
        heading: "Documents and delivery",
        items: [
          {
            question: "How should I prepare my document?",
            answer:
              "Send all the necessary pages in a legible form, with the full text visible and nothing cut off. Explain what the translation will be used for. If the recipient requires a particular format or certification, provide those requirements before the quote is prepared.",
          },
          {
            question: "How will I receive my translation?",
            answer:
              "Once your translation is complete and payment has been received, I will email it to you. You can also download it by signing in to your client account. Keep your own copy.",
          },
          {
            question: "I have not received the translation by email. What should I do?",
            answer:
              "Check your spam folder and the email address registered to your account. Sign in to check whether the file is available. If the translation should already be ready, email hello@linklang.co.uk.",
          },
          {
            question: "Who can access my documents?",
            answer:
              "I use the documents to handle and complete your order. The finished translation is intended for the client who ordered it. Infrastructure and delivery providers may also process information. Details of recipients and storage are set out in the privacy policy.",
          },
        ],
      },
      {
        heading: "Changes, cancellations and complaints",
        items: [
          {
            question: "Can I cancel an order?",
            answer:
              "Yes. You can cancel without charge before paying. If you have paid but performance has not started, you will receive a full refund. Consumers ordering at a distance have statutory cancellation rights.",
          },
          {
            question: "What if there is an error in my translation?",
            answer:
              "Contact me, identify the passage and explain your concern. I will check it against the source material and agreed scope. You can also complain more than seven days after delivery. Your statutory rights are not restricted.",
          },
          {
            question: "How do I make a complaint?",
            answer:
              "Email hello@linklang.co.uk, call me or send a message relating to the order. Explain what happened and the outcome you are seeking. I will investigate without undue delay and tell you the outcome or next steps.",
          },
        ],
      },
      {
        heading: "Your account and privacy",
        items: [
          {
            question: "I have forgotten my password. How do I regain access?",
            answer:
              "Select the password recovery option on the sign-in page and enter the email address used to register. Follow the instructions in the email. If it does not arrive, check your spam folder or contact me.",
          },
          {
            question: "I think someone has accessed my account. What should I do?",
            answer:
              "Change your LinkLang password and secure your email account. Report the problem to hello@linklang.co.uk or by phone. Do not include passwords or access codes in your message.",
          },
          {
            question: "How do I close my account or request deletion of my data?",
            answer:
              "Email hello@linklang.co.uk. Say whether you want to close your account, delete particular information or exercise another right. I may ask for information needed to verify your identity.",
          },
        ],
      },
    ],
  },
};

export default function Support() {
  const [lang, setLang] = useState<"PL" | "EN">("PL");

  useEffect(() => {
    const savedLang = localStorage.getItem("linklang_lang") as "PL" | "EN" | null;
    if (savedLang === "PL" || savedLang === "EN") setLang(savedLang);

    const handleLanguageChange = () => {
      const nextLang = localStorage.getItem("linklang_lang") as "PL" | "EN" | null;
      if (nextLang === "PL" || nextLang === "EN") setLang(nextLang);
    };

    window.addEventListener("languageChange", handleLanguageChange);
    window.scrollTo(0, 0);

    return () => {
      window.removeEventListener("languageChange", handleLanguageChange);
    };
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [lang]);

  const t = content[lang];

  return (
    <main className="bg-slate-50">
      <div className="mx-auto max-w-5xl px-4 py-12 md:py-16">
        <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 inline-flex items-center rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">
              <MessageCircleQuestion className="mr-2 h-3.5 w-3.5" /> support
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900">{t.title}</h1>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => {
                setLang("PL");
                localStorage.setItem("linklang_lang", "PL");
                window.dispatchEvent(new Event("languageChange"));
              }}
              className={`rounded px-3 py-1.5 text-sm font-medium transition ${
                lang === "PL" ? "bg-brand-600 text-white" : "bg-white text-slate-700 ring-1 ring-slate-200 hover:ring-brand-300"
              }`}
            >
              PL
            </button>
            <button
              onClick={() => {
                setLang("EN");
                localStorage.setItem("linklang_lang", "EN");
                window.dispatchEvent(new Event("languageChange"));
              }}
              className={`rounded px-3 py-1.5 text-sm font-medium transition ${
                lang === "EN" ? "bg-brand-600 text-white" : "bg-white text-slate-700 ring-1 ring-slate-200 hover:ring-brand-300"
              }`}
            >
              EN
            </button>
          </div>
        </div>

        <div className="mb-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="max-w-2xl text-lg text-slate-700">{t.intro}</p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {t.contact.map(({ label, value, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-slate-700 transition hover:border-brand-200 hover:bg-brand-50"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-brand-600 shadow-sm ring-1 ring-slate-200">
                  <Icon className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span>
                  <span className="text-base font-medium text-slate-900">{value}</span>
                </span>
              </a>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          {t.sections.map((section) => (
            <section key={section.heading} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-2xl font-semibold text-slate-900">{section.heading}</h2>
              <div className="space-y-4">
                {section.items.map((item) => (
                  <div key={item.question} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <h3 className="text-lg font-semibold text-slate-900">{item.question}</h3>
                    <p className="mt-2 text-slate-700">{item.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-brand-200 bg-brand-50 p-5 text-sm text-brand-900">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0" />
            <p>
              {lang === "PL"
                ? "W sprawie istniejącego zlecenia podaj jego numer, jeśli go masz, i opisz problem. Nie przesyłaj hasła, kodów logowania ani pełnych danych karty."
                : "For an existing order, include its reference if you have one and describe the problem. Do not send your password, sign-in codes or full card details."}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
