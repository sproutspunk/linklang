export default function Privacy() {
  return (
    <main className="bg-white">
      <div className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-4xl font-bold text-slate-900 mb-8">Polityka Prywatności</h1>
        
        <div className="prose prose-sm max-w-none text-slate-700 space-y-6">
          <section>
            <h2 className="text-2xl font-medium text-slate-900 mt-8 mb-4">1. Wprowadzenie</h2>
            <p>
              LinkLang ('my', 'nas', 'nasz') prowadzi stronę internetową linklang.co.uk. Ta strona jest usługą elektroniczną.
            </p>
            <p>
              Ta polityka prywatności wyjaśnia, jak zbieramy, wykorzystujemy, ujawniamy i w inny sposób obsługujemy Twoje dane osobowe.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-medium text-slate-900 mt-8 mb-4">2. Informacje, które zbieramy</h2>
            <p>
              Informacje, które nas dostarczasz, zawierają:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Imię i nazwisko</li>
              <li>Adres e-mail</li>
              <li>Numer telefonu (opcjonalnie)</li>
              <li>Zawartość formularza kontaktowego</li>
              <li>Szczegóły zlecenia tłumaczenia</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-medium text-slate-900 mt-8 mb-4">3. Jak wykorzystujemy Twoje dane</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Dostarczanie i utrzymanie naszych usług</li>
              <li>Wysyłanie powiadomień e-mail</li>
              <li>Odpowiadanie na Twoje zapytania</li>
              <li>Zgodność z obowiązkami prawnymi</li>
              <li>Zapobieganie oszustwom</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-medium text-slate-900 mt-8 mb-4">4. Bezpieczeństwo danych</h2>
            <p>
              Twoje dane osobowe przechowywane są na bezpiecznych serwerach Cloudflare. Stosujemy standardowe środki bezpieczeństwa IT, aby chronić Twoje dane przed nieautoryzowanym dostępem.
            </p>
            <p>
              Nigdy nie udostępniamy Twoich danych osobowych osobom trzecim bez Twojej zgody, z wyjątkiem przypadków wymaganych przez prawo.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-medium text-slate-900 mt-8 mb-4">5. Cookies</h2>
            <p>
              Nasza strona używa cookies do:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Zapamiętywania ustawień użytkownika</li>
              <li>Autentykacji użytkownika</li>
              <li>Analizy ruchu strony</li>
              <li>Poprawy doświadczenia użytkownika</li>
            </ul>
            <p className="mt-4">
              Możesz odrzucić cookies, ale to może wpłynąć na funkcjonalność strony.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-medium text-slate-900 mt-8 mb-4">6. Twoje prawa</h2>
            <p>
              Masz prawo do:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Dostępu do swoich danych osobowych</li>
              <li>Poprawy swoich danych</li>
              <li>Usunięcia swoich danych</li>
              <li>Wycofania zgody na przetwarzanie danych</li>
            </ul>
            <p className="mt-4">
              Aby skorzystać z tych praw, skontaktuj się z nami: hello@linklang.co.uk
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-medium text-slate-900 mt-8 mb-4">7. Kontakt</h2>
            <p>
              Jeśli masz pytania dotyczące tej polityki prywatności, skontaktuj się z nami:
            </p>
            <ul className="space-y-2">
              <li>Email: hello@linklang.co.uk</li>
              <li>Telefon: 07770 110735</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-medium text-slate-900 mt-8 mb-4">8. Zmiany w polityce</h2>
            <p>
              Możemy aktualizować tę politykę prywatności od czasu do czasu. Publikujemy datę ostatniej aktualizacji na tej stronie.
            </p>
            <p className="text-sm text-slate-500 mt-4">
              Ostatnia aktualizacja: 15 sierpnia 2026
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
