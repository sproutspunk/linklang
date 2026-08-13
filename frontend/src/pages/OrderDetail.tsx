import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { apiFetch } from "../lib/api";
import { formatDate, formatCurrency } from "../lib/utils";
import { ArrowLeft, Loader2, Send, CheckCircle } from "lucide-react";

const statusFlow = ["NEW", "UNDER_REVIEW", "QUOTE_SENT", "APPROVED", "PAID", "IN_PROGRESS", "READY", "DOWNLOADED"];

const statusLabels: Record<string, string> = {
  NEW: "Przesłane", UNDER_REVIEW: "Weryfikacja", QUOTE_SENT: "Wycena wysłana",
  APPROVED: "Zaakceptowane", PAID: "Opłacone", IN_PROGRESS: "W realizacji",
  READY: "Gotowe", DOWNLOADED: "Pobrane",
};

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  async function load() {
    const data = await apiFetch(`/api/orders/${id}`);
    setOrder(data);
    setLoading(false);
  }

  useEffect(() => { load(); }, [id]);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;
    setSending(true);
    await apiFetch(`/api/orders/${id}/messages`, {
      method: "POST",
      body: JSON.stringify({ content: message }),
    });
    setMessage("");
    setSending(false);
    load();
  }

  async function acceptQuote(quoteId: number) {
    await apiFetch(`/api/quotes/${quoteId}/accept`, { method: "POST" });
    load();
  }

  if (loading) return <div className="flex h-64 items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-brand-600" /></div>;
  if (!order) return <p className="p-8 text-center text-slate-500">Nie znaleziono zlecenia</p>;

  const currentStep = statusFlow.indexOf(order.status);
  const latestQuote = order.quotes?.[0];

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link to="/portal" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800">
        <ArrowLeft className="h-4 w-4" /> Wróć
      </Link>

      <div className="mt-6 flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">{order.type.replace("_", " ")}</h1>
          <p className="mt-1 text-sm text-slate-500">{formatDate(order.createdAt)}</p>
        </div>
        <span className="rounded-full bg-brand-50 px-3 py-1 text-sm font-medium text-brand-700">{statusLabels[order.status] || order.status}</span>
      </div>

      {/* Timeline */}
      <div className="mt-8 overflow-x-auto">
        <div className="flex min-w-max items-center gap-2">
          {statusFlow.map((s, i) => {
            const active = i <= currentStep;
            return (
              <div key={s} className="flex items-center gap-2">
                <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${active ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-400"}`}>{i + 1}</div>
                <span className={`text-xs ${active ? "font-medium text-slate-900" : "text-slate-400"}`}>{statusLabels[s]}</span>
                {i < statusFlow.length - 1 && <div className={`mx-1 h-0.5 w-6 ${i < currentStep ? "bg-brand-600" : "bg-slate-200"}`} />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Details */}
      <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Szczegóły</h2>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <div><dt className="text-slate-500">Języki</dt><dd className="font-medium">{order.sourceLang} → {order.targetLang}</dd></div>
          {order.deadline && <div><dt className="text-slate-500">Termin</dt><dd className="font-medium">{formatDate(order.deadline)}</dd></div>}
          {order.location && <div><dt className="text-slate-500">Lokalizacja</dt><dd className="font-medium">{order.location}</dd></div>}
          {order.durationMin && <div><dt className="text-slate-500">Czas trwania</dt><dd className="font-medium">{order.durationMin} min</dd></div>}
          {order.institution && <div><dt className="text-slate-500">Instytucja</dt><dd className="font-medium">{order.institution}</dd></div>}
          {order.context && <div><dt className="text-slate-500">Kontekst</dt><dd className="font-medium">{order.context}</dd></div>}
        </dl>
        {order.notes && <div className="mt-4"><dt className="text-sm text-slate-500">Uwagi</dt><dd className="mt-1 text-sm text-slate-800">{order.notes}</dd></div>}
      </div>

      {/* Quote */}
      {latestQuote && (
        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Wycena</h2>
          <div className="mt-4 flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-slate-900">{formatCurrency(latestQuote.amount)}</p>
              {latestQuote.notes && <p className="mt-1 text-sm text-slate-600">{latestQuote.notes}</p>}
            </div>
            {!latestQuote.accepted && order.status === "QUOTE_SENT" && (
              <button onClick={() => acceptQuote(latestQuote.id)}
                className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700">
                <CheckCircle className="h-4 w-4" /> Akceptuj
              </button>
            )}
            {latestQuote.accepted && (
              <span className="inline-flex items-center gap-1 text-sm font-medium text-emerald-600">
                <CheckCircle className="h-4 w-4" /> Zaakceptowana
              </span>
            )}
          </div>
        </div>
      )}

      {/* Documents */}
      {order.documents?.length > 0 && (
        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Pliki</h2>
          <ul className="mt-3 space-y-2">
            {order.documents.map((d: any) => (
              <li key={d.id} className="flex items-center justify-between text-sm">
                <span className="text-slate-700">{d.filename}</span>
                {d.isFinal && <span className="rounded bg-emerald-50 px-2 py-0.5 text-xs text-emerald-700">Gotowe</span>}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Chat */}
      <div className="mt-8 rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-6 py-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Wiadomości</h2>
        </div>
        <div className="max-h-96 overflow-y-auto px-6 py-4">
          {order.messages?.length === 0 && <p className="text-sm text-slate-400">Brak wiadomości.</p>}
          <div className="space-y-4">
            {order.messages?.map((m: any) => (
              <div key={m.id} className={`flex flex-col ${m.isAdmin ? "items-start" : "items-end"}`}>
                <div className={`max-w-[80%] rounded-lg px-4 py-2 text-sm ${m.isAdmin ? "bg-slate-100 text-slate-800" : "bg-brand-600 text-white"}`}>{m.content}</div>
                <span className="mt-1 text-xs text-slate-400">{m.user?.name || "Ty"} · {new Date(m.createdAt).toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" })}</span>
              </div>
            ))}
          </div>
        </div>
        <form onSubmit={sendMessage} className="flex gap-2 border-t border-slate-100 px-6 py-4">
          <input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Napisz wiadomość..."
            className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none" />
          <button type="submit" disabled={sending}
            className="inline-flex items-center gap-1 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-50">
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
