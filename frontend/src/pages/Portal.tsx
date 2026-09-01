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

const statusLabels: Record<string, string> = {
  NEW: "Przesłane",
  UNDER_REVIEW: "Weryfikacja",
  QUOTE_SENT: "Wycena wysłana",
  APPROVED: "Zaakceptowane",
  PAID: "Opłacone",
  IN_PROGRESS: "W realizacji",
  READY: "Gotowe",
  DOWNLOADED: "Pobrane",
  CANCELLED: "Anulowane",
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

  useEffect(() => {
    apiFetch("/api/orders").then((data) => { setOrders(data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const active = orders.filter((o) => o.status !== "DOWNLOADED" && o.status !== "CANCELLED");
  const history = orders.filter((o) => o.status === "DOWNLOADED" || o.status === "CANCELLED");

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Twoje zlecenia</h1>
        <Link to="/portal/new" className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700">
          <Plus className="h-4 w-4" /> Nowe zlecenie
        </Link>
      </div>

      <ChangePasswordForm />

      {loading ? (
        <div className="mt-10 flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-brand-600" /></div>
      ) : (
        <>
          <section className="mt-8">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Aktywne ({active.length})</h2>
            <div className="mt-4 space-y-3">
              {active.length === 0 && <p className="text-sm text-slate-500">Brak aktywnych zleceń. Zacznij powyżej.</p>}
              {active.map((o) => <OrderRow key={o.id} order={o} />)}
            </div>
          </section>
          {history.length > 0 && (
            <section className="mt-12">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Historia ({history.length})</h2>
              <div className="mt-4 space-y-3">
                {history.map((o) => <OrderRow key={o.id} order={o} />)}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}

function OrderRow({ order }: { order: any }) {
  const Icon = typeIcons[order.type] || FileText;
  const latestQuote = order.quotes?.[0];
  return (
    <Link to={`/portal/${order.id}`} className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-brand-300 hover:shadow-md">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50">
        <Icon className="h-5 w-5 text-brand-600" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate text-sm font-semibold text-slate-900">{order.type.replace("_", " ")}</span>
          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[order.status]}`}>{statusLabels[order.status]}</span>
        </div>
        <p className="mt-0.5 text-xs text-slate-500">
          {formatDate(order.createdAt)}
          {order.deadline && ` · Termin ${formatDate(order.deadline)}`}
          {latestQuote && ` · Wycena ${formatCurrency(latestQuote.amount)}`}
        </p>
      </div>
      <ChevronRight className="h-5 w-5 shrink-0 text-slate-300" />
    </Link>
  );
}
