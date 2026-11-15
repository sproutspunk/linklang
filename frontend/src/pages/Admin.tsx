import { useLanguage } from "../lib/language";
import { serviceLabels } from "../lib/labels";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../lib/api";
import { formatDate, formatCurrency } from "../lib/utils";
import ChangePasswordForm from "../components/ChangePasswordForm";
import { Loader2, ExternalLink, PoundSterling, MessageSquare } from "lucide-react";

const statuses = ["ALL", "NEW", "UNDER_REVIEW", "QUOTE_SENT", "APPROVED", "PAID", "IN_PROGRESS", "READY", "DOWNLOADED", "CANCELLED"];

const polishStatusLabels: Record<string, string> = {
  ALL: "Wszystkie", NEW: "Przesłane", UNDER_REVIEW: "Weryfikacja", QUOTE_SENT: "Wycena wysłana",
  APPROVED: "Zaakceptowane", PAID: "Opłacone", IN_PROGRESS: "W realizacji", READY: "Gotowe",
  DOWNLOADED: "Pobrane", CANCELLED: "Anulowane",
};

const polishHealthConsentLabels: Record<string, string> = {
  NOT_APPLICABLE: "Nie dotyczy",
  NOT_GIVEN: "Brak zgody",
  ACTIVE: "Zgoda aktywna",
  WITHDRAWN: "Zgoda wycofana",
};

const content = {
  "PL": {
    "title": "Panel administracyjny",
    "revenue": "Przychód",
    "orders": "Zlecenia",
    "client": "Klient",
    "type": "Typ",
    "status": "Status",
    "consent": "Zgoda medyczna",
    "quote": "Wycena",
    "deadline": "Termin",
    "preview": "Podgląd",
    "empty": "Brak zleceń w tym statusie.",
    "sendQuote": "Wyślij wycenę",
    "amount": "Kwota (£)",
    "notes": "Uwagi",
    "cancel": "Anuluj",
    "notesPlaceholder": "Szczegóły wyceny..."
  },
  "EN": {
    "title": "Admin panel",
    "revenue": "Revenue",
    "orders": "Orders",
    "client": "Client",
    "type": "Type",
    "status": "Status",
    "consent": "Health consent",
    "quote": "Quote",
    "deadline": "Deadline",
    "preview": "Preview",
    "empty": "No orders with this status.",
    "sendQuote": "Send quote",
    "amount": "Amount (£)",
    "notes": "Notes",
    "cancel": "Cancel",
    "notesPlaceholder": "Quote details..."
  }
};

export default function Admin() {
  const { lang } = useLanguage();
  const t = content[lang];
  const statusLabels: Record<string, string> = lang === "PL" ? polishStatusLabels : { ALL: "All", NEW: "Submitted", UNDER_REVIEW: "Under review", QUOTE_SENT: "Quote sent", APPROVED: "Approved", PAID: "Paid", IN_PROGRESS: "In progress", READY: "Ready", DOWNLOADED: "Downloaded", CANCELLED: "Cancelled" };
  const healthConsentLabels: Record<string, string> = lang === "PL" ? polishHealthConsentLabels : { NOT_APPLICABLE: "Not applicable", NOT_GIVEN: "Not given", ACTIVE: "Active", WITHDRAWN: "Withdrawn" };
  const [orders, setOrders] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [filter, setFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [quoteModal, setQuoteModal] = useState<number | null>(null);
  const [quoteAmount, setQuoteAmount] = useState("");
  const [quoteNotes, setQuoteNotes] = useState("");
  const [summary, setSummary] = useState<any>(null);

  useEffect(() => {
    apiFetch("/api/orders")
      .then((data) => { setOrders(data); setFiltered(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
    apiFetch("/api/admin/summary").then(setSummary).catch(() => {});
  }, []);

  useEffect(() => {
    if (filter === "ALL") setFiltered(orders);
    else setFiltered(orders.filter((o) => o.status === filter));
  }, [filter, orders]);

  async function updateStatus(orderId: number, status: string) {
    await apiFetch(`/api/orders/${orderId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
  }

  async function sendQuote(orderId: number) {
    await apiFetch("/api/quotes", {
      method: "POST",
      body: JSON.stringify({ orderId, amount: parseFloat(quoteAmount), notes: quoteNotes }),
    });
    setQuoteModal(null);
    setQuoteAmount("");
    setQuoteNotes("");
    setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status: "QUOTE_SENT" } : o));
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-slate-900">{t.title}</h1>
        {summary && (
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-emerald-50 px-4 py-2 text-sm">
              <span className="text-slate-500">{t.revenue}</span>
              <span className="ml-2 font-bold text-emerald-700">{formatCurrency(summary.revenue)}</span>
            </div>
            <div className="rounded-lg bg-brand-50 px-4 py-2 text-sm">
              <span className="text-slate-500">{t.orders}</span>
              <span className="ml-2 font-bold text-brand-700">{summary.totalOrders}</span>
            </div>
          </div>
        )}
      </div>

      <ChangePasswordForm lang={lang} />

      <div className="mt-6 flex flex-wrap gap-2">
        {statuses.map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition ${filter === s ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
            {statusLabels[s]} {s === "ALL" ? `(${orders.length})` : `(${orders.filter((o) => o.status === s).length})`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="mt-10 flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-brand-600" /></div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">ID</th>
                <th className="px-4 py-3 font-medium">{t.client}</th>
                <th className="px-4 py-3 font-medium">{t.type}</th>
                <th className="px-4 py-3 font-medium">{t.status}</th>
                <th className="px-4 py-3 font-medium">{t.consent}</th>
                <th className="px-4 py-3 font-medium">{t.quote}</th>
                <th className="px-4 py-3 font-medium">{t.deadline}</th>
                <th className="px-4 py-3 font-medium">{t.preview}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((o) => {
                const q = o.quotes?.[0];
                return (
                  <tr key={o.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-mono text-xs text-slate-500">{String(o.id).padStart(4, "0")}</td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-900">{o.user?.name || "-"}</div>
                      <div className="text-xs text-slate-500">{o.user?.email}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-700">{serviceLabels[o.type]?.[lang] || o.type}</td>
                    <td className="px-4 py-3">
                      <select value={o.status} onChange={(e) => updateStatus(o.id, e.target.value)}
                        className="rounded border border-slate-200 bg-white px-2 py-1 text-xs">
                        {statuses.filter((s) => s !== "ALL").map((s) => (
                          <option key={s} value={s}>{statusLabels[s]}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-600">{healthConsentLabels[o.healthConsentStatus] || healthConsentLabels.NOT_APPLICABLE}</td>
                    <td className="px-4 py-3">
                      {q ? (
                        <span className="font-medium text-slate-900">{formatCurrency(q.amount)}</span>
                      ) : (
                        <button onClick={() => setQuoteModal(o.id)}
                          className="inline-flex items-center gap-1 rounded bg-brand-50 px-2 py-1 text-xs font-medium text-brand-700 hover:bg-brand-100">
                          <PoundSterling className="h-3 w-3" /> {t.quote}
                        </button>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-500">{o.deadline ? formatDate(o.deadline) : "-"}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link to={`/portal/${o.id}`} className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700" title={t.preview}>
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                        {o.messageCount > 0 && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs text-amber-700">
                            <MessageSquare className="h-3 w-3" /> {o.messageCount}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && <p className="py-10 text-center text-sm text-slate-400">{t.empty}</p>}
        </div>
      )}

      {quoteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-bold text-slate-900">{t.sendQuote}</h3>
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">{t.amount}</label>
                <input type="number" step="0.01" value={quoteAmount} onChange={(e) => setQuoteAmount(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="150.00" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">{t.notes}</label>
                <textarea value={quoteNotes} onChange={(e) => setQuoteNotes(e.target.value)} rows={3}
                  className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder={t.notesPlaceholder} />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setQuoteModal(null)}
                className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100">{t.cancel}</button>
              <button onClick={() => sendQuote(quoteModal)} disabled={!quoteAmount}
                className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-50">
                {t.sendQuote}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
