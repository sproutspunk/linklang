import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../lib/api";
import { formatDate, formatCurrency } from "../lib/utils";
import { Loader2, ExternalLink, PoundSterling, MessageSquare } from "lucide-react";

const statuses = ["ALL", "NEW", "UNDER_REVIEW", "QUOTE_SENT", "APPROVED", "PAID", "IN_PROGRESS", "READY", "DOWNLOADED", "CANCELLED"];

const statusLabels: Record<string, string> = {
  ALL: "Wszystkie", NEW: "Przesłane", UNDER_REVIEW: "Weryfikacja", QUOTE_SENT: "Wycena wysłana",
  APPROVED: "Zaakceptowane", PAID: "Opłacone", IN_PROGRESS: "W realizacji", READY: "Gotowe",
  DOWNLOADED: "Pobrane", CANCELLED: "Anulowane",
};

export default function Admin() {
  const [orders, setOrders] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [filter, setFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [quoteModal, setQuoteModal] = useState<number | null>(null);
  const [quoteAmount, setQuoteAmount] = useState("");
  const [quoteNotes, setQuoteNotes] = useState("");
  const [summary, setSummary] = useState<any>(null);

  useEffect(() => {
    apiFetch("/api/orders").then((data) => { setOrders(data); setFiltered(data); setLoading(false); });
    apiFetch("/api/admin/summary").then(setSummary);
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
        <h1 className="text-2xl font-bold text-slate-900">Panel administracyjny</h1>
        {summary && (
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-emerald-50 px-4 py-2 text-sm">
              <span className="text-slate-500">Przychód</span>
              <span className="ml-2 font-bold text-emerald-700">{formatCurrency(summary.revenue)}</span>
            </div>
            <div className="rounded-lg bg-brand-50 px-4 py-2 text-sm">
              <span className="text-slate-500">Zlecenia</span>
              <span className="ml-2 font-bold text-brand-700">{summary.totalOrders}</span>
            </div>
          </div>
        )}
      </div>

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
                <th className="px-4 py-3 font-medium">Klient</th>
                <th className="px-4 py-3 font-medium">Typ</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Wycena</th>
                <th className="px-4 py-3 font-medium">Termin</th>
                <th className="px-4 py-3 font-medium">Podgląd</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((o) => {
                const q = o.quotes?.[0];
                return (
                  <tr key={o.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-mono text-xs text-slate-500">{String(o.id).padStart(4, "0")}</td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-900">{o.user?.name || "—"}</div>
                      <div className="text-xs text-slate-500">{o.user?.email}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-700">{o.type.replace("_", " ")}</td>
                    <td className="px-4 py-3">
                      <select value={o.status} onChange={(e) => updateStatus(o.id, e.target.value)}
                        className="rounded border border-slate-200 bg-white px-2 py-1 text-xs">
                        {statuses.filter((s) => s !== "ALL").map((s) => (
                          <option key={s} value={s}>{statusLabels[s]}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      {q ? (
                        <span className="font-medium text-slate-900">{formatCurrency(q.amount)}</span>
                      ) : (
                        <button onClick={() => setQuoteModal(o.id)}
                          className="inline-flex items-center gap-1 rounded bg-brand-50 px-2 py-1 text-xs font-medium text-brand-700 hover:bg-brand-100">
                          <PoundSterling className="h-3 w-3" /> Wycena
                        </button>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-500">{o.deadline ? formatDate(o.deadline) : "—"}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link to={`/portal/${o.id}`} className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700" title="Podgląd">
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
          {filtered.length === 0 && <p className="py-10 text-center text-sm text-slate-400">Brak zleceń w tym statusie.</p>}
        </div>
      )}

      {quoteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-bold text-slate-900">Wyślij wycenę</h3>
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">Kwota (£)</label>
                <input type="number" step="0.01" value={quoteAmount} onChange={(e) => setQuoteAmount(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="150.00" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Uwagi</label>
                <textarea value={quoteNotes} onChange={(e) => setQuoteNotes(e.target.value)} rows={3}
                  className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="Szczegóły wyceny..." />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setQuoteModal(null)}
                className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100">Anuluj</button>
              <button onClick={() => sendQuote(quoteModal)} disabled={!quoteAmount}
                className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-50">
                Wyślij wycenę
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
