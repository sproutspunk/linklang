import { useEffect, useState } from "react";
import { CreditCard, FileText } from "lucide-react";

const content = {
  PL: { title: "Tłumaczenie dokumentów", order: "Zlecenie #0042", approved: "Zaakceptowane", details: "Szczegóły", languages: "Polski - angielski", deadline: "Termin: 24 września 2026", quote: "Wycena", description: "Tłumaczenie przysięgłe dokumentów.", payOnline: "Zapłać online" },
  EN: { title: "Document translation", order: "Order #0042", approved: "Approved", details: "Details", languages: "Polish - English", deadline: "Deadline: 24 September 2026", quote: "Quote", description: "Certified translation of documents.", payOnline: "Pay online" },
};

export default function PaymentPreview() {
  const [lang, setLang] = useState<"PL" | "EN">("PL");

  useEffect(() => {
    const updateLanguage = () => setLang(localStorage.getItem("linklang_lang") === "EN" ? "EN" : "PL");
    updateLanguage();
    window.addEventListener("languageChange", updateLanguage);
    return () => window.removeEventListener("languageChange", updateLanguage);
  }, []);

  const t = content[lang];

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">{t.title}</h1>
          <p className="mt-1 text-sm text-slate-500">{t.order}</p>
        </div>
        <span className="rounded-full bg-brand-50 px-3 py-1 text-sm font-medium text-brand-700">{t.approved}</span>
      </div>

      <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">{t.details}</h2>
        <div className="mt-4 flex items-center gap-3 text-sm text-slate-700">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50">
            <FileText className="h-5 w-5 text-brand-600" />
          </div>
          <div>
            <p className="font-medium text-slate-900">{t.languages}</p>
            <p className="text-slate-500">{t.deadline}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">{t.quote}</h2>
        <div className="mt-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-2xl font-bold text-slate-900">£150.00</p>
            <p className="mt-1 text-sm text-slate-600">{t.description}</p>
          </div>
          <button className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700">
            <CreditCard className="h-4 w-4" /> {t.payOnline}
          </button>
        </div>
      </div>
    </div>
  );
}