import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { apiFetch } from "../lib/api";
import { ArrowLeft, Loader2 } from "lucide-react";

export default function NewOrder() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [type, setType] = useState(searchParams.get("type")?.toUpperCase() || "TRANSLATION");
  const [submitting, setSubmitting] = useState(false);

  const types = [
    { value: "TRANSLATION", label: "Tłumaczenie dokumentów" },
    { value: "INTERPRETER", label: "Tłumacz ustny na miejscu" },
    { value: "PHONE_VIDEO", label: "Telefon / wideorozmowa" },
    { value: "PUBLIC_SERVICES", label: "Pomoc w instytucjach" },
    { value: "BUSINESS", label: "Oferta dla firm" },
  ];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    const form = new FormData(e.currentTarget);
    const payload: Record<string, any> = { type };
    form.forEach((v, k) => { if (v) payload[k] = v; });
    if (payload.durationMin) payload.durationMin = parseInt(payload.durationMin);

    try {
      const data = await apiFetch("/api/orders", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      navigate(`/portal/${data.id}`);
    } catch {
      alert("Nie udało się utworzyć zlecenia");
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <Link to="/portal" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800">
        <ArrowLeft className="h-4 w-4" /> Wróć
      </Link>
      <h1 className="mt-4 text-2xl font-bold text-slate-900">Nowe zlecenie</h1>
      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700">Rodzaj usługi</label>
          <select value={type} onChange={(e) => setType(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm">
            {types.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-slate-700">Język źródłowy</label>
            <select name="sourceLang" defaultValue="PL" className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm">
              <option value="PL">Polski</option>
              <option value="EN">English</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Język docelowy</label>
            <select name="targetLang" defaultValue="EN" className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm">
              <option value="EN">English</option>
              <option value="PL">Polski</option>
            </select>
          </div>
        </div>
        {type === "TRANSLATION" && (
          <div>
            <label className="block text-sm font-medium text-slate-700">Rodzaj dokumentu</label>
            <select name="context" className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm">
              <option value="">Wybierz rodzaj</option>
              <option value="contract">Umowa</option>
              <option value="certificate">Akt / świadectwo</option>
              <option value="medical">Medyczne</option>
              <option value="general">Ogólne</option>
            </select>
          </div>
        )}
        {type === "INTERPRETER" && (
          <>
            <div>
              <label className="block text-sm font-medium text-slate-700">Lokalizacja</label>
              <input name="location" placeholder="Aberdeen" className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Czas trwania (min)</label>
              <input name="durationMin" type="number" placeholder="60" className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
            </div>
          </>
        )}
        {type === "PUBLIC_SERVICES" && (
          <div>
            <label className="block text-sm font-medium text-slate-700">Instytucja</label>
            <select name="institution" className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm">
              <option value="">Wybierz</option>
              <option value="universal_credit">Universal Credit</option>
              <option value="hmrc">HMRC</option>
              <option value="jobcentre">Jobcentre Plus</option>
              <option value="nhs">NHS</option>
            </select>
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-slate-700">Termin</label>
          <input name="deadline" type="date" className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Uwagi</label>
          <textarea name="notes" rows={4} placeholder="Opisz czego potrzebujesz..." className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
        </div>
        <button type="submit" disabled={submitting}
          className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-50">
          {submitting && <Loader2 className="h-4 w-4 animate-spin" />} Złóż zlecenie
        </button>
      </form>
    </div>
  );
}
