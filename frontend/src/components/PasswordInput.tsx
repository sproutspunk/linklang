import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

type PasswordInputProps = {
  id?: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  showLabel: string;
  hideLabel: string;
  required?: boolean;
  minLength?: number;
  placeholder?: string;
};

export default function PasswordInput({
  id,
  label,
  value,
  onChange,
  showLabel,
  hideLabel,
  required,
  minLength,
  placeholder,
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);
  const inputId = id || label.toLowerCase().replace(/\s+/g, "-");
  const toggleLabel = visible ? hideLabel : showLabel;

  return (
    <div>
      <label htmlFor={inputId} className="block text-sm font-medium text-slate-700">{label}</label>
      <div className="relative mt-1">
        <input
          id={inputId}
          type={visible ? "text" : "password"}
          required={required}
          minLength={minLength}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="block w-full rounded-lg border border-slate-300 px-3 py-2 pr-12 text-sm focus:border-brand-500 focus:outline-none"
        />
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-500 hover:text-brand-700"
          aria-label={toggleLabel}
          title={toggleLabel}
          aria-pressed={visible}
        >
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      <button
        type="button"
        onClick={() => setVisible((current) => !current)}
        className="mt-1 text-xs font-medium text-slate-600 underline hover:text-brand-700"
        aria-pressed={visible}
      >
        {toggleLabel}
      </button>
    </div>
  );
}
