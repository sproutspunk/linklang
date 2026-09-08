import { Fragment, useState, useEffect } from "react";

const priceRows = {
  PL: [
    ["Tekst ogólny do 350 słów tekstu źródłowego", "£35"],
    ["Tekst ogólny powyżej 350 słów tekstu źródłowego", "£0,10 za każde słowo, liczone dla całego tekstu"],
    ["Tłumaczenie ustne na miejscu", "£60 za pierwszą godzinę, następnie £15 za każde kolejne rozpoczęte 15 minut"],
    ["Tłumaczenie ustne przez telefon lub wideo", "£30 za pierwsze 30 minut, następnie £15 za każde kolejne rozpoczęte 15 minut"],
    ["Dokument specjalistyczny, tekst odręczny lub złożone formatowanie", "Wycena indywidualna"],
  ],
  EN: [
    ["General text of up to 350 source words", "£35"],
    ["General text of more than 350 source words", "£0.10 per source word, calculated for the entire text"],
    ["In-person interpreting", "£60 for the first hour, then £15 for each additional 15 minutes or part thereof"],
    ["Telephone or video interpreting", "£30 for the first 30 minutes, then £15 for each additional 15 minutes or part thereof"],
    ["Specialist documents, handwritten text or complex formatting", "Quoted individually"],
  ],
} as const;

const content = {
  PL: {
    title: "Regulamin",
    sections: [
      {
        heading: "1. Usługodawca",
        content:
          "Usługi LinkLang świadczy Miroslaw Potaczek, prowadzący jednoosobową działalność gospodarczą w Wielkiej Brytanii jako sole trader.\n\nAdres przedsiębiorcy: Aberdeenshire\n\nE-mail: hello@linklang.co.uk\nTelefon: 07770 110735\nStrona internetowa: linklang.co.uk\n\nDziałam mobilnie z Banff w Szkocji i świadczę usługi zdalne na terenie całej Wielkiej Brytanii. Nie jestem zarejestrowany jako podatnik VAT i nie doliczam VAT do cen.",
      },
      {
        heading: "2. Zakres usług",
        content:
          "Oferuję tłumaczenia pisemne z polskiego na angielski i z angielskiego na polski, tłumaczenia ustne na miejscu oraz przez telefon i wideo. Świadczę również pomoc językową w kontaktach z instytucjami publicznymi i podczas współpracy z firmami.\n\nZakres każdego zlecenia określa zaakceptowana wycena. Pomoc językowa obejmuje tłumaczenie wypowiedzi i tekstów. Nie zastępuje porady prawnej, podatkowej ani medycznej.\n\nJeżeli odbiorca dokumentu wymaga określonego rodzaju poświadczenia, podpisu lub formatu, przekaż te wymagania przed wyceną. Przyjęcie zwykłego tłumaczenia nie oznacza zobowiązania do wykonania tłumaczenia poświadczonego ani przysięgłego.",
      },
      {
        heading: "3. Konto klienta i kontakt",
        content:
          "Podczas rejestracji podaj aktualne dane i zabezpiecz dostęp do konta. Nie udostępniaj hasła innym osobom. Jeśli podejrzewasz nieuprawniony dostęp, skontaktuj się ze mną.\n\nPanel klienta służy do obsługi zleceń i pobierania gotowych tłumaczeń. W sprawie zamówienia możesz również napisać na hello@linklang.co.uk lub zadzwonić pod podany numer.\n\nKorzystanie ze strony ani samo przesłanie zapytania nie zobowiązuje Cię do zakupu usługi.",
      },
      {
        heading: "4. Materiały do wyceny",
        content:
          "Prześlij kompletny, czytelny materiał, wskaż kierunek tłumaczenia, przeznaczenie dokumentu i oczekiwany termin. Przy tłumaczeniu ustnym podaj temat, lokalizację lub sposób połączenia, datę i przewidywaną długość spotkania.\n\nDla materiałów o łącznej objętości do 5000 słów w jednym zapytaniu przygotowuję wycenę w ciągu 24 godzin. Przy większych lub trudniejszych do oceny zleceniach w tym czasie podam termin przygotowania wyceny albo poproszę o brakujące informacje.\n\nDo tych 24 godzin nie wlicza się sobót, niedziel ani świąt. Termin wykonania usługi ustalam oddzielnie.",
      },
      {
        heading: "5. Wycena i zawarcie umowy",
        content:
          "Wycena określa zakres usługi, cenę, termin realizacji, sposób dostarczenia oraz dodatkowe koszty, jeżeli występują. Jest ważna przez 14 dni, chyba że wskazano w niej inny termin. Dostępność spotkania musi zostać potwierdzona przed rezerwacją.\n\nZatwierdzając wycenę i zamawiając usługę z obowiązkiem zapłaty, akceptujesz uzgodniony zakres, cenę i termin. Potwierdzenie zamówienia oraz jego warunki otrzymasz w formie, którą możesz zachować.\n\nZmiana materiałów, zakresu lub terminu może wymagać nowej wyceny. Dodatkowe prace i opłaty wymagają Twojej zgody przed ich wykonaniem.",
      },
      {
        heading: "6. Ceny i płatności",
        content:
          "Wszystkie ceny podawane są w funtach szterlingach (GBP). LinkLang nie jest zarejestrowany jako podatnik VAT, dlatego VAT nie jest doliczany.\n\nCena tłumaczenia tekstu ogólnego obejmuje tłumaczenie z języka polskiego na angielski lub z języka angielskiego na polski, sprawdzenie tekstu i zachowanie podstawowego formatowania dokumentu. Minimalna opłata za tłumaczenie pisemne wynosi £35. Minimalna opłata za spotkanie na miejscu obejmuje jedną godzinę.\n\nW przypadku spotkań na miejscu czas dojazdu, przebieg i opłaty parkingowe są obliczane oddzielnie. Łączna cena jest przedstawiana klientowi do akceptacji przed potwierdzeniem rezerwacji.\n\nPłatności internetowe są obsługiwane przez Stripe. Dostępne metody płatności są wyświetlane podczas płatności. Pełna płatność jest wymagana przed rozpoczęciem realizacji usługi.\n\nSama płatność nie stanowi wyraźnego żądania rozpoczęcia świadczenia usługi przed upływem okresu odstąpienia od umowy. Wymagane jest również osobne żądanie opisane w punkcie 9.",
        table: {
          headers: ["Usługa", "Cena"],
          rows: [
            ["Tekst ogólny do 350 słów tekstu źródłowego", "£35"],
            ["Tekst ogólny powyżej 350 słów tekstu źródłowego", "£0,10 za każde słowo, liczone dla całego tekstu"],
            ["Tłumaczenie ustne na miejscu", "£60 za pierwszą godzinę, następnie £15 za każde kolejne rozpoczęte 15 minut"],
            ["Tłumaczenie ustne przez telefon lub wideo", "£30 za pierwsze 30 minut, następnie £15 za każde kolejne rozpoczęte 15 minut"],
            ["Dokument specjalistyczny, tekst odręczny lub złożone formatowanie", "Wycena indywidualna"],
          ],
        },
      },
      {
        heading: "7. Dojazd i spotkania",
        content:
          "Wyjeżdżam z Banff. Możliwość dojazdu ustalam indywidualnie na podstawie miejsca, terminu i długości spotkania.\n\nKoszt dojazdu obejmuje £0.50 za milę całej trasy w obie strony, £20 za godzinę łącznego czasu podróży oraz koszt płatnego parkingu, jeśli występuje. Łączną kwotę otrzymasz do zaakceptowania przed rezerwacją.\n\nZmianę godziny, miejsca lub długości spotkania uzgodnij ze mną przed jego rozpoczęciem. Przedłużenie jest możliwe po potwierdzeniu dostępności i kosztu.",
      },
      {
        heading: "8. Realizacja i dostarczenie tłumaczenia",
        content:
          "Realizuję usługę z należytą starannością i zgodnie z zaakceptowanym zakresem. Jeśli materiał jest nieczytelny lub zawiera niejasności, poproszę o wyjaśnienie.\n\nPo opłaceniu zlecenia gotowe tłumaczenie otrzymasz e-mailem. Będzie również dostępne do pobrania po zalogowaniu do panelu klienta. Pobierz i zachowaj własną kopię.\n\nJeżeli pojawi się przeszkoda zagrażająca uzgodnionemu terminowi, poinformuję Cię o niej i zaproponuję rozwiązanie. Zmiana terminu wymaga uzgodnienia i nie ogranicza Twoich praw w przypadku opóźnienia lub niewykonania umowy.",
      },
      {
        heading: "9. Odstąpienie od umowy przez konsumenta",
        content:
          "Jeżeli zamawiasz usługę jako konsument przez internet lub telefon, możesz odstąpić od umowy bez podania przyczyny w ciągu 14 dni, liczonych od dnia następującego po jej zawarciu. Gdy przepisy przewidują przedłużenie terminu, obowiązuje termin ustawowy.\n\nAby odstąpić od umowy, przekaż mi jednoznaczne oświadczenie. Możesz skorzystać z e-maila, telefonu lub formularza zamieszczonego na końcu regulaminu. Formularz nie jest obowiązkowy. Wystarczy wysłać oświadczenie przed upływem terminu.\n\nJeżeli chcesz, żebym rozpoczął usługę przed upływem tych 14 dni, musisz wyraźnie o to poprosić. W razie odstąpienia po takim rozpoczęciu możesz być zobowiązany do zapłaty proporcjonalnej do części usługi wykonanej do chwili zgłoszenia odstąpienia, pod warunkiem spełnienia ustawowych wymogów informacyjnych.\n\nPrawo odstąpienia wygasa po pełnym wykonaniu usługi w tym okresie tylko wtedy, gdy wcześniej wyraźnie zażądasz jej rozpoczęcia i potwierdzisz, że rozumiesz ten skutek. Samo opłacenie zamówienia nie powoduje utraty tego prawa.\n\nZasady te wynikają z Consumer Contracts Regulations 2013.",
      },
      {
        heading: "10. Anulowanie i zwroty",
        content:
          "Przed płatnością możesz anulować zlecenie bez kosztów. Jeśli zapłacisz i anulujesz je przed rozpoczęciem realizacji, otrzymasz pełny zwrot.\n\nPrzy ustawowym odstąpieniu od umowy zwracam należną kwotę bez zbędnej zwłoki, nie później niż w ciągu 14 dni od otrzymania oświadczenia. Zwrot następuje tą samą metodą płatności, chyba że wyraźnie uzgodnisz inną, bez dodatkowych kosztów. Nie potrącam opłaty Stripe za samo skorzystanie z ustawowego prawa odstąpienia.\n\nPo rozpoczęciu usługi zastosowanie mają zasady z punktu 9. W przypadku rezygnacji po upływie ustawowego terminu lub zleceń firmowych stosuje się zgodne z prawem warunki anulowania uzgodnione w wycenie.\n\nJeżeli anuluję zlecenie z powodu niemożności jego wykonania, zwrócę wpłaconą kwotę. Częściową realizację i jej rozliczenie możemy uzgodnić osobno. Nie ogranicza to innych praw przysługujących Ci z powodu niewykonania umowy.",
      },
      {
        heading: "11. Reklamacje i poprawki",
        content:
          "Reklamację możesz zgłosić na hello@linklang.co.uk, telefonicznie lub w wiadomości dotyczącej zlecenia. Podaj numer zamówienia, jeśli go masz, opisz problem i wskaż fragment wymagający sprawdzenia. Numer zamówienia ułatwia obsługę, ale nie jest warunkiem przyjęcia reklamacji.\n\nRozpatrzę zgłoszenie bez zbędnej zwłoki. Jeśli potrzebuję dodatkowych informacji lub czasu, poinformuję Cię o przyczynie i dalszym przebiegu sprawy.\n\nJeżeli usługa nie została wykonana z należytą starannością lub zgodnie z umową, konsument może żądać ponownego wykonania odpowiedniej części bez dodatkowych opłat, w rozsądnym terminie i bez istotnych niedogodności. Gdy spełnione są ustawowe przesłanki, przysługuje obniżenie ceny, nawet do pełnej jej wysokości. Pozostałe ustawowe środki ochrony zachowują zastosowanie.\n\nZgłoś problem po jego zauważeniu. Złożenie reklamacji po siedmiu dniach od dostarczenia nie powoduje utraty ustawowych praw. Zmiana tekstu źródłowego lub zamówienie dodatkowej pracy jest rozpatrywane oddzielnie od poprawienia błędu w wykonanej usłudze.\n\nPrawa konsumenta określa Consumer Rights Act 2015.",
      },
      {
        heading: "12. Dokumenty, poufność i prawa do materiałów",
        content:
          "Przekazuj materiały, do których masz prawo i które możesz zgodnie z prawem udostępnić do tłumaczenia. Przesłanie plików nie przenosi na mnie Twoich praw do materiałów źródłowych.\n\nKorzystam z nich w zakresie potrzebnym do obsługi zlecenia. Po pełnej zapłacie możesz używać dostarczonego tłumaczenia zgodnie z uzgodnionym przeznaczeniem i przekazywać je jego odbiorcom, z poszanowaniem praw do materiału źródłowego.\n\nDokumenty i informacje o zleceniu traktuję jako poufne. Dostawcy usług potrzebnych do działania serwisu, płatności i wysyłki e-maili mogą przetwarzać dane w opisanym zakresie. Szczegóły znajdują się w polityce prywatności.\n\nMateriały strony mogą należeć do LinkLang lub innych uprawnionych podmiotów. Korzystanie z serwisu nie przenosi praw do logo, tekstów, grafiki ani oprogramowania.",
      },
      {
        heading: "13. Odpowiedzialność",
        content:
          "Odpowiadam za wykonanie uzgodnionej usługi zgodnie z umową i obowiązującym prawem. Nie gwarantuję decyzji urzędu, pracodawcy ani innego odbiorcy tłumaczenia.\n\nPrzy ocenie problemu uwzględnia się jego przyczynę, w tym jakość materiału źródłowego i przekazane instrukcje. Nie wyłącza to mojego obowiązku zachowania należytej staranności.\n\nRegulamin nie wyłącza ani nie ogranicza odpowiedzialności, której nie można zgodnie z prawem wyłączyć lub ograniczyć, w szczególności za oszustwo oraz śmierć lub uszkodzenie ciała spowodowane niedbalstwem. Nie ogranicza ustawowych praw konsumenta.",
      },
      {
        heading: "14. Prawo właściwe i zmiany regulaminu",
        content:
          "Do umowy stosuje się prawo Szkocji. Wybór ten nie pozbawia konsumenta ochrony wynikającej z bezwzględnie obowiązujących przepisów ani prawa do skorzystania z sądu właściwego na podstawie obowiązującego prawa.\n\nDo zlecenia stosuje się regulamin obowiązujący przy zawarciu umowy. Późniejsza zmiana strony nie zmienia automatycznie uzgodnionej ceny, zakresu ani warunków istniejącego zamówienia.",
      },
      {
        heading: "Formularz odstąpienia od umowy",
        content:
          "Adresat: Miroslaw Potaczek, LinkLang\n\nAdres przedsiębiorcy: Aberdeenshire\n\nE-mail: hello@linklang.co.uk\n\nOświadczam, że odstępuję od umowy o wykonanie następującej usługi:\n\nUsługa i numer zlecenia, jeśli został nadany: ____________________\n\nData zawarcia umowy: ____________________\n\nImię i nazwisko konsumenta: ____________________\n\nAdres konsumenta: ____________________\n\nData: ____________________\n\nPodpis, jeśli formularz składany jest na papierze: ____________________",
      },
      {
        heading: "Żądanie rozpoczęcia usługi przed upływem 14 dni",
        content:
          "Wyraźnie proszę o rozpoczęcie usługi przed upływem 14-dniowego terminu odstąpienia od umowy. Rozumiem, że w razie odstąpienia po rozpoczęciu usługi mogę być zobowiązany do zapłaty za proporcjonalną część usługi już wykonaną. Przyjmuję do wiadomości, że po pełnym wykonaniu usługi utracę prawo odstąpienia.",
      },
    ],
    lastUpdated: "Ostatnia aktualizacja: 8 września 2026 r.",
  },
  EN: {
    title: "Terms and conditions",
    sections: [
      {
        heading: "1. Service provider",
        content:
          "LinkLang services are provided by Miroslaw Potaczek, a sole trader operating in the United Kingdom.\n\nBusiness address: Aberdeenshire\n\nEmail: hello@linklang.co.uk\nPhone: 07770 110735\nWebsite: linklang.co.uk\n\nI provide a mobile service from Banff in Scotland and remote services throughout the UK. I am not VAT registered and do not add VAT to my prices.",
      },
      {
        heading: "2. Services",
        content:
          "I offer document translation from Polish into English and from English into Polish, interpreting in person, and phone and video interpreting. I also provide language support for dealings with public services and for businesses.\n\nEach accepted quote defines the work included. Language support covers interpreting speech and translating text. It does not replace legal, tax or medical advice.\n\nIf the intended recipient requires a particular form of certification, signature or format, provide those requirements before I prepare the quote. Acceptance of a standard translation order does not include an undertaking to provide a certified or sworn translation.",
      },
      {
        heading: "3. Your account and contact details",
        content:
          "Provide accurate, current registration details and keep your account secure. Do not share your password. Contact me if you suspect unauthorised access.\n\nYour client account is used to manage orders and download completed translations. You can also contact me about an order at hello@linklang.co.uk or by phone.\n\nVisiting the website or sending an enquiry does not commit you to buying a service.",
      },
      {
        heading: "4. Material for a quote",
        content:
          "Send complete, legible material and specify the translation direction, intended use and requested deadline. For interpreting, include the subject, location or connection method, date and expected appointment length.\n\nFor material totalling up to 5,000 words in one enquiry, I prepare a quote within 24 hours. For larger or more complex requests, I will confirm when the quote will be ready or ask for missing information within that time.\n\nThe 24-hour period excludes Saturdays, Sundays and public holidays. The service delivery date is agreed separately.",
      },
      {
        heading: "5. Quotes and your contract",
        content:
          "The quote sets out the service, price, delivery date, delivery method and any additional costs. It remains valid for 14 days unless a different period is stated. Appointment availability must be confirmed before booking.\n\nBy approving the quote and placing an order with an obligation to pay, you accept the agreed scope, price and deadline. You will receive confirmation of your order and its terms in a form you can keep.\n\nChanges to the material, scope or deadline may require a revised quote. Additional work and charges require your agreement before the work is carried out.",
      },
      {
        heading: "6. Prices and payment",
        content:
          "All prices are in pounds sterling (GBP). LinkLang is not VAT registered, so VAT is not added.\n\nThe price for a general text includes translation from Polish into English or from English into Polish, proofreading and basic document formatting. The minimum charge for written translation is £35. The minimum charge for an in-person appointment is one hour.\n\nFor in-person appointments, travel time, mileage and parking are calculated separately. The total price is provided for the client's approval before the booking is confirmed.\n\nStripe processes online payments. The payment methods available to the client are displayed at checkout. Full payment is required before work begins.\n\nPayment alone does not constitute an express request for the service to begin during the cancellation period. The separate request described in section 9 is also required.",
        table: {
          headers: ["Service", "Price"],
          rows: [
            ["General text of up to 350 source words", "£35"],
            ["General text of more than 350 source words", "£0.10 per source word, calculated for the entire text"],
            ["In-person interpreting", "£60 for the first hour, then £15 for each additional 15 minutes or part thereof"],
            ["Telephone or video interpreting", "£30 for the first 30 minutes, then £15 for each additional 15 minutes or part thereof"],
            ["Specialist documents, handwritten text or complex formatting", "Quoted individually"],
          ],
        },
      },
      {
        heading: "7. Travel and appointments",
        content:
          "I travel from Banff. Travel availability is agreed individually according to the appointment location, date and duration.\n\nTravel charges comprise £0.50 per mile for the total outward and return distance, £20 per hour for total travel time, and paid parking where needed. You will receive the total price for approval before booking.\n\nAgree any change to the time, location or duration with me before the appointment. Extensions are subject to confirmation of availability and cost.",
      },
      {
        heading: "8. Completing and delivering the service",
        content:
          "I perform the service with reasonable care and skill and in accordance with the accepted scope. If the material is unclear or illegible, I will ask for clarification.\n\nOnce your translation is complete and payment has been received, I will email it to you. It will also be available to download by signing in to your client account. Download and keep your own copy.\n\nIf a problem puts the agreed deadline at risk, I will tell you and propose a solution. Any revised deadline must be agreed and does not restrict your rights where the service is delayed or the contract is not fulfilled.",
      },
      {
        heading: "9. Consumers' right to cancel",
        content:
          "If you order as a consumer online or by phone, you may cancel without giving a reason within 14 days, starting on the day after the contract is made. Where the law extends that period, the statutory period applies.\n\nTell me clearly that you wish to cancel. You may do this by email, by phone or using the form at the end of these terms. You do not have to use the form. Sending your cancellation before the deadline is sufficient.\n\nIf you want me to start within those 14 days, you must expressly request this. If you then cancel after work has started, you may have to pay an amount proportionate to the service supplied up to the time you notify me, provided the statutory information requirements have been met.\n\nYou lose the cancellation right after full performance within that period only if you previously requested the early start and acknowledged that consequence. Paying for the order alone does not remove your right to cancel.\n\nThese rules are set out in the Consumer Contracts Regulations 2013.",
      },
      {
        heading: "10. Cancellations and refunds",
        content:
          "You may cancel without charge before paying. If you have paid and cancel before performance begins, you will receive a full refund.\n\nWhen you exercise a statutory cancellation right, I will refund the amount due without undue delay and within 14 days of receiving your cancellation. I will use your original payment method unless you expressly agree otherwise, at no additional cost. I do not deduct a Stripe fee simply because you exercise your statutory right to cancel.\n\nOnce the service has started, section 9 applies. For cancellation after the statutory period, or for business orders, the lawful cancellation terms agreed in the quote apply.\n\nIf I cancel because I cannot fulfil the order, I will refund your payment. We may separately agree partial delivery and payment for it. This does not limit other rights arising from a failure to fulfil the contract.",
      },
      {
        heading: "11. Complaints and corrections",
        content:
          "You can complain by emailing hello@linklang.co.uk, by phone or in a message relating to your order. Include an order reference if you have one, describe the problem and identify any passage that needs checking. An order reference helps, but is not required for your complaint to be accepted.\n\nI will investigate without undue delay. If I need more information or time, I will explain why and keep you informed.\n\nIf a service has not been provided with reasonable care and skill or as agreed, a consumer may require the relevant work to be repeated at no extra cost, within a reasonable time and without significant inconvenience. Where the statutory conditions are met, a price reduction of up to the full price is available. Other statutory remedies remain available.\n\nPlease report a problem when you notice it. Reporting it more than seven days after delivery does not remove your statutory rights. Changes to the source text or requests for additional work are considered separately from correcting an error in the service supplied.\n\nConsumer rights are set out in the Consumer Rights Act 2015.",
      },
      {
        heading: "12. Documents, confidentiality and rights in material",
        content:
          "Only provide material that you are entitled to use and lawfully share for translation. Uploading files does not transfer your rights in the source material to me.\n\nI use the material as needed to handle the order. After full payment, you may use the delivered translation for its agreed purpose and provide it to its intended recipients, subject to rights in the source material.\n\nI treat documents and order information as confidential. Providers needed to operate the website, process payments and deliver emails may process information for those purposes. Details are set out in the privacy policy.\n\nWebsite material may belong to LinkLang or other rights holders. Using the service does not transfer rights in its logo, text, graphics or software.",
      },
      {
        heading: "13. Liability",
        content:
          "I am responsible for providing the agreed service in accordance with the contract and applicable law. I do not guarantee decisions made by a public authority, employer or another recipient of a translation.\n\nThe cause of a problem will be considered, including the quality of the source material and the instructions provided. This does not remove my duty to exercise reasonable care and skill.\n\nThese terms do not exclude or limit liability where doing so would be unlawful, including liability for fraud or for death or personal injury caused by negligence. They do not restrict consumers' statutory rights.",
      },
      {
        heading: "14. Governing law and changes to these terms",
        content:
          "Scottish law applies to the contract. This choice does not deprive consumers of mandatory legal protections or their right to bring proceedings in a court with jurisdiction under applicable law.\n\nThe version in force when the contract is made applies to the order. Later changes to the website do not automatically change the agreed price, scope or terms of an existing order.",
      },
      {
        heading: "Cancellation form",
        content:
          "To: Miroslaw Potaczek, LinkLang\n\nBusiness address: Aberdeenshire\n\nEmail: hello@linklang.co.uk\n\nI give notice that I cancel my contract for the following service:\n\nService and order reference, if issued: ____________________\n\nDate of contract: ____________________\n\nConsumer's name: ____________________\n\nConsumer's address: ____________________\n\nDate: ____________________\n\nSignature, if submitting this form on paper: ____________________",
      },
      {
        heading: "Request to start the service within 14 days",
        content:
          "I expressly request that the service starts before the end of the 14-day cancellation period. I understand that if I cancel after the service has started, I may have to pay a proportionate amount for the service already supplied. I acknowledge that I will lose my right to cancel once the service has been fully performed.",
      },
    ],
    lastUpdated: "Last updated: 8 September 2026.",
  },
};

export default function Terms() {
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
                {idx === 5 && (
                  <div className="mb-5 overflow-hidden rounded-xl border border-slate-200 bg-white">
                    <div className="grid grid-cols-[minmax(0,1fr)_minmax(12rem,0.8fr)] gap-4 border-b border-slate-200 bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-900 md:px-5">
                      <span>{lang === "PL" ? "Usługa" : "Service"}</span>
                      <span className="md:text-right">{lang === "PL" ? "Cena" : "Price"}</span>
                    </div>
                    {priceRows[lang].map(([service, price]) => (
                      <div key={service} className="grid grid-cols-1 gap-2 border-b border-slate-200 px-4 py-3 text-sm last:border-b-0 md:grid-cols-[minmax(0,1fr)_minmax(12rem,0.8fr)] md:gap-4 md:px-5">
                        <span className="text-slate-700">{service}</span>
                        <span className="font-medium text-slate-900 md:text-right">{price}</span>
                      </div>
                    ))}
                  </div>
                )}
                <div className="space-y-3 leading-7">
                  {section.content && section.content.split("\n\n").map((para, i) => (
                    <Fragment key={i}>
                      <p>{para}</p>
                      {i === 0 && "table" in section && (
                        <div className="my-5 overflow-x-auto">
                          <table className="w-full border-collapse text-left text-sm">
                            <thead>
                              <tr className="border-b border-slate-300">
                                {section.table?.headers.map((header) => (
                                  <th key={header} className="px-3 py-2 font-semibold text-slate-900 first:pl-0 last:text-right last:pr-0">
                                    {header}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {section.table?.rows.map(([service, price]) => (
                                <tr key={service} className="border-b border-slate-200 align-top last:border-b-0">
                                  <td className="px-3 py-3 first:pl-0">{service}</td>
                                  <td className="px-3 py-3 text-right last:pr-0">{price}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </Fragment>
                  ))}
                </div>
              </section>
            ))}
            <p className="pt-2 text-sm text-slate-500">{t.lastUpdated}</p>
          </div>
        </div>
      </div>
    </main>
  );
}
