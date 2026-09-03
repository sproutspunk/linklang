import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { apiFetch } from "../lib/api";
import { ArrowLeft, Loader2, File as FileIcon, X } from "lucide-react";

export default function NewOrder() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [type, setType] = useState(searchParams.get("type")?.toUpperCase() || "TRANSLATION");
  const [submitting, setSubmitting] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

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
      for (const file of files) {
        const uploadForm = new FormData();
        uploadForm.append("file", file);
        await apiFetch(`/api/orders/${data.id}/documents`, {
          method: "POST",
          body: uploadForm,
        });
      }
      navigate(`/portal/${data.id}`);
    } catch {
      alert("Nie udało się utworzyć zlecenia");
      setSubmitting(false);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files || []);
    setFiles((prev) => [...prev, ...selected].slice(0, 5));
    e.target.value = "";
  }

  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
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
        <div>
          <label className="block text-sm font-medium text-slate-700">Załączniki</label>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="mt-1 block w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-brand-50 file:px-3 file:py-2 file:text-sm file:font-medium file:text-brand-700 hover:file:bg-brand-100"
          />
          <p className="mt-1 text-xs text-slate-500">Maks. 5 plików, każdy do 10 MB.</p>
          {files.length > 0 && (
            <ul className="mt-3 space-y-2">
              {files.map((file, i) => (
                <li key={i} className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
                  <span className="flex items-center gap-2 truncate text-slate-700">
                    <FileIcon className="h-4 w-4 shrink-0 text-slate-400" /> {file.name}
                  </span>
                  <button type="button" onClick={() => removeFile(i)} className="text-slate-400 hover:text-red-600" aria-label="Usuń plik">
                    <X className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <button type="submit" disabled={submitting}
          className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-50">
          {submitting && <Loader2 className="h-4 w-4 animate-spin" />} Złóż zlecenie
        </button>
      </form>
    </div>
  );
}
