import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../lib/api";
import { formatDate, formatCurrency } from "../lib/utils";
import ChangePasswordForm from "../components/ChangePasswordForm";
import {
  FileText, Users, Phone, Building2, Landmark,
  Plus, ChevronRight, Loader2,
} from "lucide-react";

const typeIcons: Record<string, React.ElementType> = {
  TRANSLATION: FileText,
  INTERPRETER: Users,
  PHONE_VIDEO: Phone,
  PUBLIC_SERVICES: Landmark,
  BUSINESS: Building2,
};

const content = {
  PL: {
    title: "Twoje zlecenia",
    newOrder: "Nowe zlecenie",
    active: "Aktywne",
    noActiveOrders: "Brak aktywnych zleceń. Zacznij powyżej.",
    history: "Historia",
    deadline: "Termin",
    quote: "Wycena",
    statuses: {
      NEW: "Przesłane", UNDER_REVIEW: "Weryfikacja", QUOTE_SENT: "Wycena wysłana", APPROVED: "Zaakceptowane", PAID: "Opłacone", IN_PROGRESS: "W realizacji", READY: "Gotowe", DOWNLOADED: "Pobrane", CANCELLED: "Anulowane",
    },
  },
  EN: {
    title: "Your orders",
    newOrder: "New order",
    active: "Active",
    noActiveOrders: "No active orders. Start above.",
    history: "History",
    deadline: "Deadline",
    quote: "Quote",
    statuses: {
      NEW: "Submitted", UNDER_REVIEW: "Under review", QUOTE_SENT: "Quote sent", APPROVED: "Approved", PAID: "Paid", IN_PROGRESS: "In progress", READY: "Ready", DOWNLOADED: "Downloaded", CANCELLED: "Cancelled",
    },
  },
};

const typeLabels: Record<string, { PL: string; EN: string }> = {
  TRANSLATION: { PL: "Tłumaczenie", EN: "Translation" },
  INTERPRETER: { PL: "Tłumaczenie ustne", EN: "Interpreting" },
  PHONE_VIDEO: { PL: "Telefon / wideo", EN: "Phone / video" },
  PUBLIC_SERVICES: { PL: "Usługi publiczne", EN: "Public services" },
  BUSINESS: { PL: "Biznes", EN: "Business" },
};

const statusColors: Record<string, string> = {
  NEW: "bg-slate-100 text-slate-700",
  UNDER_REVIEW: "bg-amber-100 text-amber-700",
  QUOTE_SENT: "bg-blue-100 text-blue-700",
  APPROVED: "bg-indigo-100 text-indigo-700",
  PAID: "bg-emerald-100 text-emerald-700",
  IN_PROGRESS: "bg-purple-100 text-purple-700",
  READY: "bg-green-100 text-green-700",
  DOWNLOADED: "bg-slate-100 text-slate-500",
  CANCELLED: "bg-red-100 text-red-700",
};

export default function Portal() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState<"PL" | "EN">("PL");

  useEffect(() => {
    apiFetch("/api/orders").then((data) => { setOrders(data); setLoading(false); }).catch(() => setLoading(false));
    const updateLanguage = () => {
      const savedLang = localStorage.getItem("linklang_lang") as "PL" | "EN" | null;
      if (savedLang) setLang(savedLang);
    };
    updateLanguage();
    window.addEventListener("languageChange", updateLanguage);
    return () => window.removeEventListener("languageChange", updateLanguage);
  }, []);

  const t = content[lang];

  const active = orders.filter((o) => o.status !== "DOWNLOADED" && o.status !== "CANCELLED");
  const history = orders.filter((o) => o.status === "DOWNLOADED" || o.status === "CANCELLED");

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">{t.title}</h1>
        <Link to="/portal/new" className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700">
          <Plus className="h-4 w-4" /> {t.newOrder}
        </Link>
      </div>

      <ChangePasswordForm lang={lang} />

      {loading ? (
        <div className="mt-10 flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-brand-600" /></div>
      ) : (
        <>
          <section className="mt-8">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">{t.active} ({active.length})</h2>
            <div className="mt-4 space-y-3">
              {active.length === 0 && <p className="text-sm text-slate-500">{t.noActiveOrders}</p>}
              {active.map((o) => <OrderRow key={o.id} order={o} lang={lang} />)}
            </div>
          </section>
          {history.length > 0 && (
            <section className="mt-12">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">{t.history} ({history.length})</h2>
              <div className="mt-4 space-y-3">
                {history.map((o) => <OrderRow key={o.id} order={o} lang={lang} />)}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}

function OrderRow({ order, lang }: { order: any; lang: "PL" | "EN" }) {
  const Icon = typeIcons[order.type] || FileText;
  const latestQuote = order.quotes?.[0];
  const t = content[lang];
  return (
    <Link to={`/portal/${order.id}`} className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-brand-300 hover:shadow-md">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50">
        <Icon className="h-5 w-5 text-brand-600" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate text-sm font-semibold text-slate-900">{typeLabels[order.type]?.[lang] || order.type.replace("_", " ")}</span>
          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[order.status]}`}>{t.statuses[order.status as keyof typeof t.statuses] || order.status}</span>
        </div>
        <p className="mt-0.5 text-xs text-slate-500">
          {formatDate(order.createdAt)}
          {order.deadline && ` · ${t.deadline} ${formatDate(order.deadline)}`}
          {latestQuote && ` · ${t.quote} ${formatCurrency(latestQuote.amount)}`}
        </p>
      </div>
      <ChevronRight className="h-5 w-5 shrink-0 text-slate-300" />
    </Link>
  );
}
