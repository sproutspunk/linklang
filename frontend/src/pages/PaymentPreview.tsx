import { CreditCard, FileText } from "lucide-react";

export default function PaymentPreview() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Tłumaczenie dokumentów</h1>
          <p className="mt-1 text-sm text-slate-500">Zlecenie #0042</p>
        </div>
        <span className="rounded-full bg-brand-50 px-3 py-1 text-sm font-medium text-brand-700">Zaakceptowane</span>
      </div>

      <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Szczegóły</h2>
        <div className="mt-4 flex items-center gap-3 text-sm text-slate-700">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50">
            <FileText className="h-5 w-5 text-brand-600" />
          </div>
          <div>
            <p className="font-medium text-slate-900">Polski - angielski</p>
            <p className="text-slate-500">Termin: 24 wrzesnia 2026</p>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Wycena</h2>
        <div className="mt-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-2xl font-bold text-slate-900">£150.00</p>
            <p className="mt-1 text-sm text-slate-600">Tłumaczenie przysięgłe dokumentów.</p>
          </div>
          <button className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700">
            <CreditCard className="h-4 w-4" /> Zapłać online
          </button>
        </div>
      </div>
    </div>
  );
}