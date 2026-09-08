import { useState, useEffect } from "react";

const content = {
  PL: {
    title: "Polityka prywatności",
    sections: [
      {
        heading: "1. Administrator danych",
        content:
          "Administratorem danych osobowych jest Miroslaw Potaczek, prowadzący jednoosobową działalność w Wielkiej Brytanii jako sole trader pod marką LinkLang.\n\nAdres przedsiębiorcy: Aberdeenshire, Szkocja, Wielka Brytania.\n\nE-mail: hello@linklang.co.uk\nTelefon: 07770 110735\n\nPolityka dotyczy strony linklang.co.uk, panelu klienta, kontaktu z LinkLang oraz usług tłumaczeniowych. Działam mobilnie z Banff w Szkocji.",
      },
      {
        heading: "2. Jakie dane przetwarzam i skąd je otrzymuję",
        content:
          "Zakres danych zależy od tego, jak korzystasz z usług.\n\nDane otrzymuję od Ciebie, od osoby składającej zlecenie w Twoim imieniu, z przekazanych dokumentów oraz od dostawców obsługujących płatności i działanie serwisu. Podczas tłumaczenia ustnego informacje mogą pochodzić również od uczestników rozmowy.\n\nPrzekazuj wyłącznie informacje potrzebne do zlecenia. Jeżeli materiał zawiera dane innych osób, musisz mieć prawo do udostępnienia go w tym celu. Dokumenty mogą zawierać również dane dzieci, na przykład w aktach urodzenia.",
        list: [
          "Kontakt i konto: imię i nazwisko, adres e-mail, dane potrzebne do logowania oraz numer telefonu i dane firmy, jeśli je podasz.",
          "Zapytania i zamówienia: rodzaj usługi, kierunek tłumaczenia, termin, lokalizacja spotkania, instrukcje, wyceny, uzgodnienia i informacje o realizacji.",
          "Dokumenty i rozmowy: treść przesłanych materiałów, tłumaczeń i informacji przekazywanych podczas tłumaczenia ustnego. Mogą zawierać dane klienta oraz innych osób.",
          "Korespondencja: wiadomości przesłane przez formularz, e-mail lub panel klienta oraz informacje związane z reklamacjami.",
          "Płatności: kwota, waluta, data, status i identyfikator transakcji oraz informacje rozliczeniowe potrzebne do obsługi płatności.",
          "Dane techniczne: informacje o połączeniu i korzystaniu ze strony, takie jak adres IP, rodzaj przeglądarki, zdarzenia techniczne i preferencje cookies.",
        ],
      },
      {
        heading: "3. Cele i podstawy przetwarzania",
        content:
          "Dane przetwarzam zgodnie z UK GDPR i Data Protection Act 2018, z uwzględnieniem zmian wprowadzonych przez Data (Use and Access) Act 2025.\n\nPodanie danych niezbędnych do kontaktu, realizacji i rozliczenia zamówienia jest potrzebne do wykonania usługi. Bez nich mogę nie być w stanie przygotować wyceny, przyjąć zlecenia lub dostarczyć tłumaczenia. Zgoda na opcjonalną analitykę nie jest warunkiem zakupu.\n\nWycenę i możliwość przyjęcia zlecenia oceniam osobiście.",
        list: [
          "Przygotowanie wyceny na Twoje żądanie, obsługa konta, wykonanie zlecenia, dostarczenie tłumaczenia i kontakt dotyczący umowy - podjęcie działań przed zawarciem umowy lub jej wykonanie, art. 6 ust. 1 lit. b UK GDPR.",
          "Kontakt z przedstawicielami klientów biznesowych oraz obsługa danych innych osób zawartych w materiałach, gdy nie są stroną umowy - prawnie uzasadniony interes polegający na obsłudze zleconej usługi i komunikacji biznesowej, art. 6 ust. 1 lit. f UK GDPR, z uwzględnieniem praw tych osób.",
          "Prowadzenie wymaganej dokumentacji podatkowej i rozliczeniowej oraz realizacja obowiązków dotyczących ochrony danych - obowiązek prawny, art. 6 ust. 1 lit. c UK GDPR.",
          "Ochrona kont i serwisu, zapobieganie nadużyciom oraz ustalenie, dochodzenie lub obrona roszczeń - prawnie uzasadniony interes, art. 6 ust. 1 lit. f UK GDPR.",
          "Opcjonalna analityka strony - zgoda, art. 6 ust. 1 lit. a UK GDPR.",
        ],
      },
      {
        heading: "4. Dane wymagające szczególnej ochrony",
        content:
          "Materiały i rozmowy mogą zawierać informacje o zdrowiu lub inne dane szczególnej kategorii. Ich przetwarzanie wymaga odpowiedniej podstawy z art. 6 UK GDPR oraz dodatkowego warunku z art. 9 UK GDPR. Samo zaakceptowanie regulaminu lub przesłanie dokumentu nie stanowi wyraźnej zgody na przetwarzanie takich danych.\n\nPrzed otrzymaniem dokumentacji medycznej lub rozpoczęciem tłumaczenia rozmowy obejmującej Twoje dane o zdrowiu poproszę Cię o odrębną, wyraźną zgodę dotyczącą konkretnego zlecenia. Na potrzeby jego wyceny, wykonania i dostarczenia podstawą przetwarzania jest art. 6 ust. 1 lit. b UK GDPR, a dodatkowym warunkiem dotyczącym danych o zdrowiu jest Twoja wyraźna zgoda zgodnie z art. 9 ust. 2 lit. a UK GDPR.\n\nZgoda jest dobrowolna. Możesz ją wycofać w dowolnym momencie, pisząc na hello@linklang.co.uk lub dzwoniąc pod numer 07770 110735. Wycofanie nie wpływa na zgodność z prawem wcześniejszego przetwarzania. Po wycofaniu zaprzestanę przetwarzania opartego na tej zgodzie. Może to uniemożliwić wykonanie lub dokończenie usługi, która wymaga korzystania z danych o zdrowiu.\n\nZgoda dotycząca Twoich danych nie obejmuje automatycznie danych innych osób. Przy materiałach zawierających cudze dane o zdrowiu lub inne dane szczególnej kategorii możliwość ich przetwarzania wymaga odrębnego ustalenia przed przekazaniem materiałów.\n\nPrzed przesłaniem dokumentacji medycznej lub materiałów zawierających dane o wyrokach, przestępstwach albo zarzutach skontaktuj się ze mną, aby ustalić możliwość przyjęcia zlecenia i właściwy sposób przekazania materiałów. Dane dotyczące przestępstw podlegają odrębnym wymaganiom art. 10 UK GDPR i Data Protection Act 2018.",
      },
      {
        heading: "5. Odbiorcy danych",
        content:
          "Korzystam z usług dostawców potrzebnych do obsługi strony i zamówień.",
        list: [
          "Cloudflare - hosting i infrastruktura serwisu oraz przechowywanie danych obsługiwanych przez serwis.",
          "Stripe - obsługa płatności, potwierdzeń transakcji i związanych z nimi procesów bezpieczeństwa.",
          "Resend - wysyłka wiadomości e-mail związanych z kontem i zleceniami.",
          "Dostawcy skrzynek e-mail nadawcy i odbiorcy - przekazywanie i przechowywanie korespondencji oraz załączników.",
          "Google, w ramach Google Analytics 4 - analiza korzystania ze strony.",
          "Operatorzy telefonii i wybranego połączenia wideo - umożliwienie uzgodnionej rozmowy i tłumaczenia ustnego.",
          "Szczegółowe informacje dostawców: Cloudflare, Stripe, Resend.",
        ],
      },
      {
        heading: "6. Przekazywanie danych poza Wielką Brytanię",
        content:
          "Korzystanie z międzynarodowych dostawców może wiązać się z przetwarzaniem danych poza Wielką Brytanią, w tym w Stanach Zjednoczonych. Lokalizacja przechowywania dokumentu nie określa lokalizacji wszystkich operacji związanych z pocztą, płatnościami i analityką.\n\nWarunki Cloudflare przewidują stosowanie Data Privacy Framework z rozszerzeniem brytyjskim w odpowiednim zakresie oraz standardowych klauzul umownych uzupełnionych UK Addendum dla transferów wymagających takich zabezpieczeń. Umowa powierzenia Resend przewiduje standardowe klauzule umowne uzupełnione UK Addendum. Stripe wskazuje w swojej polityce prywatności, że w zależności od transferu korzysta z decyzji o adekwatności, standardowych klauzul umownych uzupełnionych UK International Data Transfer Addendum lub UK Extension to the EU-U.S. Data Privacy Framework.\n\nW przypadku usług analitycznych Google korzysta, w odpowiednim zakresie, z Data Privacy Framework z UK Extension przy transferach do Stanów Zjednoczonych. Dla transferów, których nie obejmuje odpowiedni uznany mechanizm, jego warunki przewidują stosowanie standardowych klauzul umownych właściwych dla danego transferu. Szczegóły opisuje Google w informacji o międzynarodowych transferach danych: https://business.safety.google/adsdatatransfers/.\n\nW sprawie kopii lub informacji o zabezpieczeniach stosowanych do Twoich danych napisz na hello@linklang.co.uk.",
      },
      {
        heading: "7. Przechowywanie danych",
        content:
          "Poszczególne kategorie danych mają odrębne okresy lub kryteria przechowywania.\n\nUsunięcie pliku z serwisu nie usuwa kopii dostarczonej do Twojej skrzynki e-mail ani zapisanej na Twoim urządzeniu. Dokumentacja rozliczeniowa jest odrębna od treści dokumentów przekazanych do tłumaczenia. Zasady przechowywania dokumentacji podatkowej określa HMRC: https://www.gov.uk/self-employed-records/how-long-to-keep-your-records.",
        list: [
          "Dokumenty źródłowe, gotowe tłumaczenia i dostępność plików w panelu: przez okres niezbędny do przygotowania wyceny, wykonania zlecenia i przekazania tłumaczenia. Dalsze przechowywanie obejmuje wyłącznie materiały niezbędne do rozliczenia usługi, rozpatrzenia zgłoszonej reklamacji lub spełnienia konkretnego obowiązku prawnego.",
          "Kopie dokumentów w skrzynce LinkLang i na urządzeniach roboczych: przez okres obsługi zlecenia. Po jego zakończeniu wyłącznie w zakresie potrzebnym do rozliczenia usługi, rozpatrzenia zgłoszonej reklamacji lub spełnienia konkretnego obowiązku prawnego.",
          "Dane konta: przez okres utrzymywania konta; po jego zamknięciu zachowywane są tylko dane potrzebne do rozliczenia aktywnych spraw lub spełnienia obowiązku prawnego.",
          "Korespondencja i uzgodnienia: przez okres obsługi zapytania lub zamówienia oraz niezbędny do zakończenia konkretnej reklamacji lub sporu.",
          "Dokumentacja podatkowa i rozliczeniowa: co najmniej 5 lat od terminu 31 stycznia właściwego dla złożenia zeznania Self Assessment za dany rok podatkowy. Dłużej, jeżeli wymagają tego przepisy lub trwające postępowanie.",
          "Dane techniczne służące bezpieczeństwu: przez okres niezbędny do wykrywania nadużyć i wyjaśnienia konkretnych incydentów, z uwzględnieniem rodzaju zdarzenia i trwania postępowania.",
        ],
      },
      {
        heading: "8. Cookies i analityka",
        content:
          "Cookies i podobne technologie mogą służyć do utrzymania sesji logowania, zapamiętania ustawień oraz analizy korzystania ze strony. Opcje dotyczące cookies znajdziesz w ustawieniach cookies.\n\nKorzystam z Google Analytics 4 do analizowania odsłon stron, wyborów dotyczących cookies oraz przesłanych zapytań o ofertę. Analityka obejmuje strony aplikacji serwisu.\n\nZgoda na opcjonalną analitykę jest dobrowolna i możesz ją wycofać. Wycofanie zgody nie wpływa na zgodność z prawem przetwarzania dokonanego wcześniej.\n\nGoogle Analytics 4 uruchamia się po wyrażeniu zgody w banerze cookies. Preferencje są zapisywane w pamięci przeglądarki, dzięki czemu serwis może je uwzględnić podczas kolejnych wizyt.\n\nBaner cookies zawiera kategorie: niezbędne, analityczne i marketingowe. Kategoria marketingowa jest domyślnie wyłączona. Jej wybór nie uruchamia dodatkowych narzędzi reklamowych w serwisie.\n\nTechnologia: pamięć przeglądarki (localStorage) przechowująca preferencje cookies. Podmiot: LinkLang. Cel: zapamiętanie wyboru ustawień cookies. Okres działania: bez ustalonej daty wygaśnięcia. Poprzedni wybór jest zastępowany po zmianie ustawień. Zapis może zostać usunięty przez Ciebie lub przeglądarkę.\n\nUsunięcie danych strony w przeglądarce usuwa również zapisane w niej preferencje cookies.",
      },
      {
        heading: "9. Bezpieczeństwo",
        content:
          "Połączenie ze stroną korzysta z HTTPS. Dostęp do panelu wymaga zalogowania. Dbaj o poufność hasła i bezpieczeństwo skrzynki e-mail, na którą otrzymujesz wiadomości i tłumaczenia.\n\nNie przesyłaj hasła ani kodów logowania w wiadomościach do LinkLang. Podejrzenie nieuprawnionego dostępu lub ujawnienia danych zgłoś na hello@linklang.co.uk albo telefonicznie.",
      },
      {
        heading: "10. Twoje prawa",
        content:
          "W zależności od podstawy przetwarzania i okoliczności przysługuje Ci prawo do uzyskania dostępu do danych i ich kopii, sprostowania danych, ich usunięcia, ograniczenia przetwarzania oraz przenoszenia danych.\n\nPrawo do sprzeciwu: możesz sprzeciwić się przetwarzaniu opartemu na prawnie uzasadnionym interesie z przyczyn związanych z Twoją sytuacją. W przypadku marketingu bezpośredniego możesz wnieść sprzeciw w każdej chwili.\n\nJeżeli przetwarzanie opiera się na zgodzie, możesz ją wycofać. Możesz również poprosić o zamknięcie konta. Usunięcie danych podlega warunkom ustawowym, w tym obowiązkom przechowywania dokumentacji i potrzebie ochrony praw w konkretnej sprawie.\n\nŻądanie możesz zgłosić e-mailem lub telefonicznie. Odpowiem bez zbędnej zwłoki, co do zasady w ciągu jednego miesiąca. Jeżeli żądanie jest złożone lub wpłynęło ich wiele, termin może zostać przedłużony maksymalnie o kolejne dwa miesiące. Poinformuję Cię o przedłużeniu i jego przyczynie. W uzasadnionym przypadku poproszę o informacje niezbędne do potwierdzenia tożsamości.",
      },
      {
        heading: "11. Skargi dotyczące ochrony danych",
        content:
          "Skargę możesz złożyć na hello@linklang.co.uk lub pod numerem 07770 110735. Opisz problem i podaj dane umożliwiające odpowiedź.\n\nPotwierdzę otrzymanie skargi w ciągu 30 dni. Podejmę odpowiednie kroki w celu jej rozpatrzenia bez zbędnej zwłoki, będę informował Cię o postępach i przekażę wynik wraz z wyjaśnieniem. Jeżeli nie podejmę dalszych działań, wyjaśnię przyczynę i poinformuję Cię o prawie złożenia skargi do Information Commissioner's Office.\n\nMożesz również złożyć skargę do brytyjskiego organu nadzorczego, Information Commissioner's Office: https://ico.org.uk/make-a-complaint/. Złożenie skargi do LinkLang nie ogranicza przysługujących Ci środków ochrony prawnej.",
      },
      {
        heading: "12. Zmiany polityki",
        content:
          "Aktualna wersja polityki jest publikowana na tej stronie wraz z datą aktualizacji. Jeśli zmieni się cel przetwarzania wymagający przekazania dodatkowych informacji lub uzyskania zgody, otrzymasz odpowiednią informację przed rozpoczęciem takiego przetwarzania.\n\nOstatnia aktualizacja: 8 września 2026 r.",
      },
    ],
  },
  EN: {
    title: "Privacy policy",
    sections: [
      {
        heading: "1. Data controller",
        content:
          "The data controller is Miroslaw Potaczek, a sole trader operating in the United Kingdom under the name LinkLang.\n\nBusiness address: Aberdeenshire, Scotland, United Kingdom.\n\nEmail: hello@linklang.co.uk\nPhone: 07770 110735\n\nThis policy covers linklang.co.uk, the client account area, contact with LinkLang and translation and interpreting services. I provide a mobile service from Banff in Scotland.",
      },
      {
        heading: "2. Information I process and its sources",
        content:
          "The information involved depends on how you use the services.\n\nI receive information from you, from a person placing an order on your behalf, from submitted documents, and from providers handling payments and website operations. During interpreting, information may also come from other participants.\n\nOnly provide information needed for the work. If material contains someone else's information, you must be entitled to share it for that purpose. Documents may also contain information about children, for example in birth certificates.",
        list: [
          "Contact and account information: your name, email address, information needed to sign in, and your phone number and business details if you provide them.",
          "Enquiries and orders: service type, translation direction, deadline, appointment location, instructions, quotes, agreements and progress information.",
          "Documents and conversations: the contents of submitted material, translations and information communicated during interpreting. This may include information about the client and other people.",
          "Correspondence: messages sent through the contact form, email or client account, and information relating to complaints.",
          "Payments: amount, currency, date, status and transaction reference, together with billing information needed to handle the payment.",
          "Technical information: connection and website usage information, such as IP address, browser type, technical events and cookie preferences.",
        ],
      },
      {
        heading: "3. Purposes and lawful bases",
        content:
          "I process personal information under the UK GDPR and the Data Protection Act 2018, as amended by the Data (Use and Access) Act 2025.\n\nInformation necessary to communicate about, perform and account for an order is required to provide the service. Without it, I may be unable to prepare a quote, accept an order or deliver the translation. Consent to optional analytics is not a condition of purchase.\n\nI personally assess quotes and whether I can accept an order.",
        list: [
          "Preparing a quote at your request, managing your account, completing the order, delivering your translation and communicating about the contract - taking steps before entering into a contract or performing it, Article 6(1)(b) UK GDPR.",
          "Communicating with business clients' representatives and handling information about other people in the material where they are not parties to the contract - legitimate interests in providing the commissioned service and managing business communications, Article 6(1)(f) UK GDPR, taking those people's rights into account.",
          "Keeping required tax and accounting records and meeting data protection obligations - legal obligation, Article 6(1)(c) UK GDPR.",
          "Protecting accounts and the website, preventing abuse, and establishing, exercising or defending legal claims - legitimate interests, Article 6(1)(f) UK GDPR.",
          "Optional website analytics - consent, Article 6(1)(a) UK GDPR.",
        ],
      },
      {
        heading: "4. Information requiring additional protection",
        content:
          "Material and conversations may contain health information or other special category data. Processing requires an appropriate Article 6 lawful basis and an additional condition under Article 9 UK GDPR. Accepting the terms or uploading a document does not by itself amount to explicit consent to process such information.\n\nBefore receiving medical records or starting interpreting that involves your health information, I will ask for separate, explicit consent relating to the specific order. For quoting for, performing and delivering that order, the lawful basis is Article 6(1)(b) UK GDPR, and the additional condition for health information is your explicit consent under Article 9(2)(a) UK GDPR.\n\nConsent is voluntary. You can withdraw it at any time by emailing hello@linklang.co.uk or calling 07770 110735. Withdrawal does not affect the lawfulness of earlier processing. After withdrawal, I will stop processing based on that consent. This may prevent me from carrying out or completing a service that requires your health information.\n\nConsent relating to your information does not automatically cover anyone else's information. Before you provide material containing another person's health information or other special category data, we must separately establish whether it can be processed.\n\nBefore sending medical records or material containing information about convictions, offences or allegations, contact me to establish whether I can accept the order and how to provide the material. Criminal offence data is subject to separate requirements under Article 10 UK GDPR and the Data Protection Act 2018.",
      },
      {
        heading: "5. Recipients",
        content:
          "I use providers needed to operate the website and handle orders.",
        list: [
          "Cloudflare - website hosting and infrastructure, and storage of information handled by the service.",
          "Stripe - payments, transaction confirmations and related payment security processes.",
          "Resend - sending emails relating to accounts and orders.",
          "The sender's and recipient's email account providers - transmitting and storing correspondence and attachments.",
          "Google, through Google Analytics 4 - analysing use of the website.",
          "Telephone operators and the provider of the selected video service - enabling the agreed conversation and interpreting.",
          "Provider information: Cloudflare, Stripe, Resend.",
        ],
      },
      {
        heading: "6. Transfers outside the United Kingdom",
        content:
          "Using international providers may involve processing outside the UK, including in the United States. The storage location of a document does not determine the location of every operation involving email, payments and analytics.\n\nCloudflare's terms provide for the Data Privacy Framework with its UK Extension where applicable, and Standard Contractual Clauses supplemented by the UK Addendum for transfers requiring those safeguards. Resend's Data Processing Addendum provides for Standard Contractual Clauses supplemented by the UK Addendum. Stripe states in its privacy policy that, depending on the transfer, it relies on adequacy decisions, Standard Contractual Clauses supplemented by the UK International Data Transfer Addendum, or the UK Extension to the EU-U.S. Data Privacy Framework.\n\nFor its analytics services, Google relies, where applicable, on the Data Privacy Framework with its UK Extension for transfers to the United States. Where a transfer is not covered by an appropriate recognised mechanism, its terms provide for Standard Contractual Clauses applicable to that transfer. Details are available in Google's information about international data transfers: https://business.safety.google/adsdatatransfers/.\n\nEmail hello@linklang.co.uk to request a copy of, or information about, the safeguards applicable to your information.",
      },
      {
        heading: "7. Retention",
        content:
          "Different categories of information have separate retention periods or criteria.\n\nDeleting a file from the service does not delete a copy delivered to your email account or saved on your device. Accounting records are separate from the contents of documents submitted for translation. HMRC explains the retention rules for tax records: https://www.gov.uk/self-employed-records/how-long-to-keep-your-records.",
        list: [
          "Source documents, completed translations and file availability in the client account: for as long as needed to prepare the quote, complete the order and deliver the translation. Further retention is limited to material needed to account for the service, deal with a complaint that has been raised or meet a specific legal obligation.",
          "Copies in LinkLang's email account and on working devices: while handling the order. After completion, only to the extent needed to account for the service, deal with a complaint that has been raised or meet a specific legal obligation.",
          "Account information: while the account is maintained; after closure, only information needed to settle outstanding matters or meet a legal obligation is retained.",
          "Correspondence and agreements: while handling the enquiry or order, and as necessary to conclude a specific complaint or dispute.",
          "Tax and accounting records: at least 5 years after the 31 January Self Assessment submission deadline for the relevant tax year. Longer where required by law or an ongoing enquiry.",
          "Technical information used for security: as necessary to detect abuse and investigate specific incidents, taking account of the event and any ongoing proceedings.",
        ],
      },
      {
        heading: "8. Cookies and analytics",
        content:
          "Cookies and similar technologies may maintain sign-in sessions, remember preferences and analyse website use. Cookie choices are available in the cookie settings.\n\nI use Google Analytics 4 to analyse page views, cookie choices and submitted quote enquiries. Analytics covers the pages of the website application.\n\nConsent to optional analytics is voluntary and you can withdraw it. Withdrawal does not affect the lawfulness of earlier processing.\n\nGoogle Analytics 4 starts after consent is given through the cookie banner. Preferences are saved in your browser's storage so that the website can apply them on later visits.\n\nThe cookie banner includes necessary, analytics and marketing categories. The marketing category is switched off by default. Selecting it does not activate additional advertising tools on the website.\n\nTechnology: browser storage (localStorage) holding cookie preferences. Provider: LinkLang. Purpose: remembering your cookie choices. Lifetime: no set expiry date. The previous choice is replaced when you change your settings. You or your browser may clear the stored preference.\n\nClearing the website's data in your browser also removes the cookie preferences stored there.",
      },
      {
        heading: "9. Security",
        content:
          "The website uses HTTPS. Access to the client account requires sign-in. Keep your password private and protect the email account where you receive messages and translations.\n\nDo not send your password or sign-in codes in messages to LinkLang. Report suspected unauthorised access or disclosure to hello@linklang.co.uk or by phone.",
      },
      {
        heading: "10. Your rights",
        content:
          "Depending on the lawful basis and circumstances, you have rights to access and obtain a copy of your information, have it corrected or erased, restrict its processing, and receive portable data.\n\nYour right to object: you may object to processing based on legitimate interests for reasons relating to your particular situation. You may object to direct marketing at any time.\n\nWhere processing relies on consent, you may withdraw it. You may also ask to close your account. Erasure is subject to legal conditions, including record-keeping duties and the need to protect legal rights in a specific matter.\n\nYou can make a request by email or phone. I will respond without undue delay, normally within one month. If a request is complex or I receive several requests, the deadline may be extended by up to a further two months. I will tell you about the extension and explain why. Where justified, I may ask for information necessary to verify your identity.",
      },
      {
        heading: "11. Data protection complaints",
        content:
          "You can complain at hello@linklang.co.uk or on 07770 110735. Explain your concern and provide contact details for a reply.\n\nI will acknowledge your complaint within 30 days. I will take appropriate steps to investigate it without undue delay, keep you informed of progress and provide the outcome with an explanation. If I take no further action, I will explain why and tell you about your right to complain to the Information Commissioner's Office.\n\nYou may also complain to the UK's supervisory authority, the Information Commissioner's Office: https://ico.org.uk/make-a-complaint/. Complaining to LinkLang does not restrict your legal remedies.",
      },
      {
        heading: "12. Changes to this policy",
        content:
          "The current policy is published on this page with its update date. If a change of processing purpose requires further information or consent, that will be provided or sought before the new processing begins.\n\nLast updated: 8 September 2026.",
      },
    ],
  },
};

export default function Privacy() {
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
    <main className="bg-transparent py-12 md:py-16">
      <div className="mx-auto max-w-5xl px-4">
        <div className="card-shell p-6 md:p-10">
          <div className="mb-8 flex flex-col gap-4 border-b border-slate-200 pb-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-600">LinkLang</p>
              <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">{t.title}</h1>
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => {
                  setLang("PL");
                  localStorage.setItem("linklang_lang", "PL");
                  window.dispatchEvent(new Event("languageChange"));
                }}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                  lang === "PL" ? "bg-brand-600 text-white shadow-sm" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
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
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                  lang === "EN" ? "bg-brand-600 text-white shadow-sm" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                EN
              </button>
            </div>
          </div>

          <div className="space-y-6 text-slate-700">
            {t.sections.map((section, idx) => (
              <section key={idx} className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5 md:p-6">
                <h2 className="mb-4 text-xl font-semibold text-slate-900 md:text-2xl">{section.heading}</h2>
                <div className="space-y-3 leading-7">
                  {section.content.split("\n\n").map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
                {section.list && (
                  <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-700">
                    {section.list.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
