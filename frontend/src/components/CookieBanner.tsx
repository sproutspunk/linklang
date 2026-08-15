import { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const cookiesAccepted = localStorage.getItem("linklang_cookies_accepted");
    if (!cookiesAccepted) {
      setIsVisible(true);
    }
  }, []);

  function handleAccept() {
    localStorage.setItem("linklang_cookies_accepted", "true");
    setIsVisible(false);
  }

  function handleReject() {
    localStorage.setItem("linklang_cookies_accepted", "false");
    setIsVisible(false);
  }

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-900 text-white p-4 z-50 shadow-lg">
      <div className="mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex-1">
          <p className="text-sm">
            Używamy cookies do poprawy doświadczenia użytkownika. Klikając "Akceptuj", zgadzasz się na ich użycie.{" "}
            <a href="/privacy" className="text-brand-400 hover:underline">
              Polityka prywatności
            </a>
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={handleReject}
            className="px-4 py-2 rounded text-sm font-medium border border-slate-500 hover:bg-slate-800"
          >
            Odrzuć
          </button>
          <button
            onClick={handleAccept}
            className="px-4 py-2 rounded text-sm font-medium bg-brand-600 hover:bg-brand-700"
          >
            Akceptuj
          </button>
        </div>
        <button onClick={() => setIsVisible(false)} className="shrink-0">
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
