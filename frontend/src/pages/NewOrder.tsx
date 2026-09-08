import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { apiFetch } from "../lib/api";
import { ArrowLeft, Loader2, File as FileIcon, X } from "lucide-react";

const content = {
  PL: {
    back: "Wróć", title: "Nowe zlecenie", serviceType: "Rodzaj usługi", sourceLanguage: "Język źródłowy", targetLanguage: "Język docelowy", documentType: "Rodzaj dokumentu", selectDocumentType: "Wybierz rodzaj", location: "Lokalizacja", duration: "Czas trwania (min)", institution: "Instytucja", select: "Wybierz", deadline: "Termin", notes: "Uwagi", notesPlaceholder: "Opisz czego potrzebujesz...", attachments: "Załączniki", attachmentLimit: "Maks. 5 plików, każdy do 10 MB.", removeFile: "Usuń plik", submit: "Złóż zlecenie", createError: "Nie udało się utworzyć zlecenia", consentTitle: "Zgoda na przetwarzanie danych o zdrowiu", consentRequired: "Zaznacz zgodę, aby złożyć zlecenie dotyczące NHS.", consentLoadError: "Nie udało się pobrać tekstu zgody.",
    types: { TRANSLATION: "Tłumaczenie dokumentów", INTERPRETER: "Tłumacz ustny na miejscu", PHONE_VIDEO: "Telefon / wideorozmowa", PUBLIC_SERVICES: "Pomoc w instytucjach", BUSINESS: "Oferta dla firm" },
    contexts: { contract: "Umowa", certificate: "Akt / świadectwo", medical: "Medyczne", general: "Ogólne" },
  },
  EN: {
    back: "Back", title: "New order", serviceType: "Service type", sourceLanguage: "Source language", targetLanguage: "Target language", documentType: "Document type", selectDocumentType: "Select document type", location: "Location", duration: "Duration (min)", institution: "Institution", select: "Select", deadline: "Deadline", notes: "Notes", notesPlaceholder: "Describe what you need...", attachments: "Attachments", attachmentLimit: "Max. 5 files, up to 10 MB each.", removeFile: "Remove file", submit: "Place order", createError: "Unable to create order", consentTitle: "Consent to process health information", consentRequired: "Select the consent checkbox to place an order concerning NHS.", consentLoadError: "Unable to load the consent text.",
    types: { TRANSLATION: "Document translation", INTERPRETER: "In-person interpreting", PHONE_VIDEO: "Phone / video call", PUBLIC_SERVICES: "Help with public services", BUSINESS: "Business service" },
    contexts: { contract: "Contract", certificate: "Certificate", medical: "Medical", general: "General" },
  },
};

export default function NewOrder() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [type, setType] = useState(searchParams.get("type")?.toUpperCase() || "TRANSLATION");
  const [submitting, setSubmitting] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [lang, setLang] = useState<"PL" | "EN">("PL");
  const [institution, setInstitution] = useState("");
  const [consentText, setConsentText] = useState("");
  const [consentChecked, setConsentChecked] = useState(false);
  const [consentError, setConsentError] = useState("");

  useEffect(() => {
    const updateLanguage = () => setLang((localStorage.getItem("linklang_lang") as "PL" | "EN") || "PL");
    updateLanguage();
    window.addEventListener("languageChange", updateLanguage);
    return () => window.removeEventListener("languageChange", updateLanguage);
  }, []);

  const t = content[lang];
  const types = Object.entries(t.types).map(([value, label]) => ({ value, label }));
  const requiresHealthConsent = type === "PUBLIC_SERVICES" && institution === "nhs";

  useEffect(() => {
    if (!requiresHealthConsent) {
      setConsentChecked(false);
      setConsentError("");
      return;
    }
    apiFetch(`/api/health-consent/text?language=${lang}`)
      .then((data) => setConsentText(data.consentText))
      .catch(() => setConsentError(t.consentLoadError));
  }, [requiresHealthConsent, lang]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (requiresHealthConsent && !consentChecked) {
      setConsentError(t.consentRequired);
      return;
    }
    setSubmitting(true);
    setConsentError("");
    const form = new FormData(e.currentTarget);
    const payload: Record<string, any> = { type };
    form.forEach((v, k) => { if (v) payload[k] = v; });
    if (requiresHealthConsent) payload.context = "medical";
    if (payload.durationMin) payload.durationMin = parseInt(payload.durationMin);

    try {
      const data = await apiFetch("/api/orders", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      if (requiresHealthConsent) {
        await apiFetch(`/api/orders/${data.id}/health-consent/grant`, {
          method: "POST",
          body: JSON.stringify({ language: lang, requestId: crypto.randomUUID() }),
        });
      }
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
      alert(t.createError);
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
        <ArrowLeft className="h-4 w-4" /> {t.back}
      </Link>
      <h1 className="mt-4 text-2xl font-bold text-slate-900">{t.title}</h1>
      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700">{t.serviceType}</label>
          <select value={type} onChange={(e) => setType(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm">
            {types.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-slate-700">{t.sourceLanguage}</label>
            <select name="sourceLang" defaultValue="PL" className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm">
              <option value="PL">{lang === "PL" ? "Polski" : "Polish"}</option>
              <option value="EN">English</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">{t.targetLanguage}</label>
            <select name="targetLang" defaultValue="EN" className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm">
              <option value="EN">English</option>
              <option value="PL">{lang === "PL" ? "Polski" : "Polish"}</option>
            </select>
          </div>
        </div>
        {type === "TRANSLATION" && (
          <div>
            <label className="block text-sm font-medium text-slate-700">{t.documentType}</label>
            <select name="context" className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm">
              <option value="">{t.selectDocumentType}</option>
              <option value="contract">{t.contexts.contract}</option>
              <option value="certificate">{t.contexts.certificate}</option>
              <option value="medical">{t.contexts.medical}</option>
              <option value="general">{t.contexts.general}</option>
            </select>
          </div>
        )}
        {type === "INTERPRETER" && (
          <>
            <div>
              <label className="block text-sm font-medium text-slate-700">{t.location}</label>
              <input name="location" placeholder="Aberdeen" className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">{t.duration}</label>
              <input name="durationMin" type="number" placeholder="60" className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
            </div>
          </>
        )}
        {type === "PUBLIC_SERVICES" && (
          <div>
            <label className="block text-sm font-medium text-slate-700">{t.institution}</label>
            <select name="institution" value={institution} onChange={(event) => setInstitution(event.target.value)} className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm">
              <option value="">{t.select}</option>
              <option value="universal_credit">Universal Credit</option>
              <option value="hmrc">HMRC</option>
              <option value="jobcentre">Jobcentre Plus</option>
              <option value="nhs">NHS</option>
            </select>
            {requiresHealthConsent && (
              <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                <h2 className="font-semibold text-slate-900">{t.consentTitle}</h2>
                {consentText && (
                  <label className="mt-3 flex gap-3">
                    <input type="checkbox" checked={consentChecked} onChange={(event) => setConsentChecked(event.target.checked)} className="mt-1 h-4 w-4 shrink-0" />
                    <span>{consentText}</span>
                  </label>
                )}
                {consentError && <p className="mt-3 text-sm text-red-600">{consentError}</p>}
              </div>
            )}
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-slate-700">{t.deadline}</label>
          <input name="deadline" type="date" className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">{t.notes}</label>
          <textarea name="notes" rows={4} placeholder={t.notesPlaceholder} className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">{t.attachments}</label>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="mt-1 block w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-brand-50 file:px-3 file:py-2 file:text-sm file:font-medium file:text-brand-700 hover:file:bg-brand-100"
          />
          <p className="mt-1 text-xs text-slate-500">{t.attachmentLimit}</p>
          {files.length > 0 && (
            <ul className="mt-3 space-y-2">
              {files.map((file, i) => (
                <li key={i} className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
                  <span className="flex items-center gap-2 truncate text-slate-700">
                    <FileIcon className="h-4 w-4 shrink-0 text-slate-400" /> {file.name}
                  </span>
                  <button type="button" onClick={() => removeFile(i)} className="text-slate-400 hover:text-red-600" aria-label={t.removeFile}>
                    <X className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <button type="submit" disabled={submitting || (requiresHealthConsent && (!consentText || !consentChecked))}
          className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-50">
          {submitting && <Loader2 className="h-4 w-4 animate-spin" />} {t.submit}
        </button>
      </form>
    </div>
  );
}
