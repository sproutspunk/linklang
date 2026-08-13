import { Link } from "react-router-dom";
import { useAuth } from "../lib/store";
import {
  FileText, Users, Phone, Building2, Landmark,
  ArrowRight, ShieldCheck, Clock, MapPin,
} from "lucide-react";

export default function Home() {
  const { user } = useAuth();

  const services = [
    { icon: FileText, title: "Tłumaczenie dokumentów", desc: "Umowy, dokumentacja medyczna, akta stanu cywilnego. Polski ↔ angielski. Od £30.", href: "/portal/new?type=translation" },
    { icon: Users, title: "Tłumacz ustny na miejscu", desc: "Tłumaczenie zwykłe i specjalistyczne w całej Szkocji. Od £70 za godzinę.", href: "/portal/new?type=interpreter" },
    { icon: Phone, title: "Telefon / wideorozmowa", desc: "Zoom, Teams, WhatsApp. Od ręki lub umówione. Od £45 za 30 minut.", href: "/portal/new?type=phone_video" },
    { icon: Landmark, title: "Pomoc w instytucjach", desc: "Universal Credit, HMRC, Jobcentre Plus, wizyty w NHS.", href: "/portal/new?type=public_services" },
    { icon: Building2, title: "Oferta dla firm", desc: "Onboarding pracowników, dokumenty HR, wizyty na budowie, umowy abonamentowe.", href: "/portal/new?type=business" },
  ];

  const cities = ["Aberdeen", "Glasgow", "Edinburgh", "Dundee", "Inverness", "Perth", "Stirling", "Aberdeenshire", "Highlands", "Borders", "Fife", "Moray", "Angus"];

  return (
    <main>
      <section className="bg-brand-900 text-white">
        <div className="mx-auto max-w-6xl px-4 py-20 md:py-28">
          <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
            Tłumaczenia polsko-angielskie<br />i obsługa językowa
          </h1>
          <p className="mt-6 max-w-xl text-lg text-brand-100">
            W całej Szkocji. Wyślij dokument, otrzymaj wycenę w kilka minut, zapłać online, pobierz gotowe tłumaczenie. Bez dzwonienia. Bez czekania.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            {user ? (
              <Link to="/portal" className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 font-semibold text-brand-900 hover:bg-brand-50">
                Przejdź do panelu <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <Link to="/register" className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 font-semibold text-brand-900 hover:bg-brand-50">
                Zacznij teraz <ArrowRight className="h-4 w-4" />
              </Link>
            )}
            <span className="self-center text-sm text-brand-200">Tłumaczenia od £30 · Tłumacz ustny od £70/h</span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-2xl font-bold text-slate-900">Czego potrzebujesz?</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <Link key={s.title} to={s.href} className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-brand-500 hover:shadow-md">
              <s.icon className="h-8 w-8 text-brand-600" />
              <h3 className="mt-4 text-lg font-semibold text-slate-900">{s.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{s.desc}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand-600 group-hover:underline">Zamów <ArrowRight className="h-3 w-3" /></span>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-2xl font-bold text-slate-900">Dlaczego LinkLang?</h2>
          <div className="mt-8 grid gap-8 sm:grid-cols-3">
            <div><ShieldCheck className="h-8 w-8 text-brand-600" /><h3 className="mt-4 font-semibold">Poufność na pierwszym miejscu</h3><p className="mt-2 text-sm text-slate-600">Dokumenty szyfrowane. Bez tłumaczenia przez AI. Każdy plik weryfikuje człowiek.</p></div>
            <div><Clock className="h-8 w-8 text-brand-600" /><h3 className="mt-4 font-semibold">Terminy są realne</h3><p className="mt-2 text-sm text-slate-600">Jeśli nie dam rady na czas, powiem to przed płatnością. Bez obietnic na wyrost.</p></div>
            <div><MapPin className="h-8 w-8 text-brand-600" /><h3 className="mt-4 font-semibold">Cała Szkocja</h3><p className="mt-2 text-sm text-slate-600">Od Aberdeen po Inverness, od Glasgow po Borders. Znam lokalne realia.</p></div>
          </div>
          <p className="mt-10 text-sm text-slate-500">Nie jestem tłumaczem przysięgłym. Jeśli dokument wymaga tłumaczenia poświadczonego do sądu lub urzędu, skieruję Cię do certyfikowanego partnera.</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-lg font-semibold text-slate-900">Obszar działania</h2>
        <p className="mt-2 text-sm text-slate-500">Tłumacz polsko-angielski dostępny w:</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {cities.map((c) => <span key={c} className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">{c}</span>)}
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-slate-500">© {new Date().getFullYear()} LinkLang. linklang.co.uk</div>
      </footer>
    </main>
  );
}
