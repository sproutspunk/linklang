import { create } from "zustand";

export type Language = "PL" | "EN";
const storageKey = "linklang_lang";
export function readLanguage(): Language {
  try { return localStorage.getItem(storageKey) === "EN" ? "EN" : "PL"; }
  catch { return "PL"; }
}
function applyLanguage(lang: Language) {
  document.documentElement.lang = lang === "PL" ? "pl" : "en";
}
export const useLanguage = create<{ lang: Language; setLang: (lang: Language) => void }>((set) => ({
  lang: readLanguage(),
  setLang: (lang) => {
    try { localStorage.setItem(storageKey, lang); } catch { /* Keep switching available without storage. */ }
    applyLanguage(lang);
    set({ lang });
  },
}));
applyLanguage(useLanguage.getState().lang);
window.addEventListener("storage", (event) => {
  if (event.key === storageKey || event.key === null) {
    const lang = readLanguage();
    applyLanguage(lang);
    useLanguage.setState({ lang });
  }
});
