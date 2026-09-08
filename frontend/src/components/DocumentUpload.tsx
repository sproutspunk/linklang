import { useState, useRef } from "react";
import { apiFetch } from "../lib/api";
import { Loader2, Upload, File as FileIcon, X } from "lucide-react";

type DocumentUploadProps = {
  orderId: number;
  onUploaded: () => void;
  maxFiles?: number;
  lang?: "PL" | "EN";
};

const content = {
  PL: { selectFiles: "Wybierz pliki", limit: (maxFiles: number) => `Maks. ${maxFiles} plików, każdy do 10 MB.`, removeFile: "Usuń plik", uploadFiles: "Wyślij pliki", error: "Błąd podczas wysyłania plików" },
  EN: { selectFiles: "Choose files", limit: (maxFiles: number) => `Max. ${maxFiles} files, up to 10 MB each.`, removeFile: "Remove file", uploadFiles: "Upload files", error: "Error uploading files" },
};

export default function DocumentUpload({ orderId, onUploaded, maxFiles = 5, lang = "PL" }: DocumentUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const t = content[lang];

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files || []);
    setFiles((prev) => [...prev, ...selected].slice(0, maxFiles));
    if (inputRef.current) inputRef.current.value = "";
  }

  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (files.length === 0) return;
    setUploading(true);
    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        await apiFetch(`/api/orders/${orderId}/documents`, {
          method: "POST",
          body: formData,
        });
      }
      setFiles([]);
      onUploaded();
    } catch (err: any) {
      alert(err.message || t.error);
    } finally {
      setUploading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-slate-700">{t.selectFiles}</label>
        <input
          ref={inputRef}
          type="file"
          multiple
          onChange={handleFileChange}
          className="mt-1 block w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-brand-50 file:px-3 file:py-2 file:text-sm file:font-medium file:text-brand-700 hover:file:bg-brand-100"
        />
        <p className="mt-1 text-xs text-slate-500">{t.limit(maxFiles)}</p>
      </div>
      {files.length > 0 && (
        <ul className="space-y-2">
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
      <button
        type="submit"
        disabled={uploading || files.length === 0}
        className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-50"
      >
        {uploading && <Loader2 className="h-4 w-4 animate-spin" />}
        <Upload className="h-4 w-4" /> {t.uploadFiles}
      </button>
    </form>
  );
}
