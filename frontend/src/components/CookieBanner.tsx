import { useState, useEffect } from "react";
import { X, Settings } from "lucide-react";

const translations = {
  PL: {
    title: "Ustawienia Cookies",
    subtitle: "Wykorzystujemy cookies do poprawy doświadczenia. Akceptując, zgadzasz się na wszystkie typy cookies.",
    privacyLink: "Polityka prywatności",
    settings: "Ustawienia",
    reject: "Odrzuć",
    accept: "Akceptuj",
    preferences: "Preferencje Cookies",
    necessary: "Cookies Niezbędne",
    necessaryDesc: "Zawsze włączone. Niezbędne do funkcjonowania strony.",
    analytics: "Cookies Analityczne",
    analyticsDesc: "Pomagają nam zrozumieć, jak używasz naszej strony.",
    marketing: "Cookies Marketingowe",
    marketingDesc: "Używane do wyświetlania spersonalizowanych reklam.",
    rejectAll: "Odrzuć Wszystkie",
    savePreferences: "Zapisz Preferencje",
  },
  EN: {
    title: "Cookie Settings",
    subtitle: "We use cookies to improve your experience. By accepting, you agree to all types of cookies.",
    privacyLink: "Privacy Policy",
    settings: "Settings",
    reject: "Reject",
    accept: "Accept",
    preferences: "Cookie Preferences",
    necessary: "Necessary Cookies",
    necessaryDesc: "Always enabled. Necessary for website functionality.",
    analytics: "Analytics Cookies",
    analyticsDesc: "Help us understand how you use our site.",
    marketing: "Marketing Cookies",
    marketingDesc: "Used to display personalized advertisements.",
    rejectAll: "Reject All",
    savePreferences: "Save Preferences",
  },
};

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [lang, setLang] = useState<"PL" | "EN">("PL");
  const t = translations[lang];
  const [preferences, setPreferences] = useState({
    necessary: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const savedLang = localStorage.getItem("linklang_lang") as "PL" | "EN" | null;
    if (savedLang) setLang(savedLang);
    
    const cookiesAccepted = localStorage.getItem("linklang_cookies_accepted");
    if (!cookiesAccepted) {
      setIsVisible(true);
    } else {
      const saved = localStorage.getItem("linklang_cookie_preferences");
      if (saved) setPreferences(JSON.parse(saved));
    }
  }, []);

  function handleAccept() {
    localStorage.setItem("linklang_cookies_accepted", "true");
    localStorage.setItem("linklang_cookie_preferences", JSON.stringify({
      necessary: true,
      analytics: true,
      marketing: true,
    }));
    setIsVisible(false);
  }

  function handleReject() {
    localStorage.setItem("linklang_cookies_accepted", "false");
    localStorage.setItem("linklang_cookie_preferences", JSON.stringify({
      necessary: true,
      analytics: false,
      marketing: false,
    }));
    setIsVisible(false);
  }

  function handleSavePreferences() {
    localStorage.setItem("linklang_cookies_accepted", "true");
    localStorage.setItem("linklang_cookie_preferences", JSON.stringify(preferences));
    setIsVisible(false);
    setShowPreferences(false);
  }

  if (!isVisible) return null;

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-slate-900 text-white p-4 z-50 shadow-lg">
        <div className="mx-auto max-w-6xl">
          {!showPreferences ? (
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex-1">
                <p className="text-sm font-medium mb-2">{t.title}</p>
                <p className="text-xs text-slate-400">
                  {t.subtitle}{" "}
                  <a href="/privacy" className="text-brand-400 hover:underline">
                    {t.privacyLink}
                  </a>
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => setShowPreferences(true)}
                  className="flex items-center gap-1 px-4 py-2 rounded text-sm font-medium border border-slate-500 hover:bg-slate-800"
                >
                  <Settings className="h-4 w-4" /> {t.settings}
                </button>
                <button
                  onClick={handleReject}
                  className="px-4 py-2 rounded text-sm font-medium border border-slate-500 hover:bg-slate-800"
                >
                  {t.reject}
                </button>
                <button
                  onClick={handleAccept}
                  className="px-4 py-2 rounded text-sm font-medium bg-brand-600 hover:bg-brand-700"
                >
                  {t.accept}
                </button>
              </div>
              <button 
                onClick={handleReject} 
                className="shrink-0 md:hidden" 
                aria-label={lang === "PL" ? "Zamknij" : "Close"}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">{t.preferences}</h3>
                <button 
                  onClick={() => setShowPreferences(false)}
                  aria-label={lang === "PL" ? "Zamknij" : "Close"}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-3 bg-slate-800 p-4 rounded">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.necessary}
                    disabled
                    className="w-4 h-4"
                  />
                  <div>
                    <p className="text-sm font-medium">{t.necessary}</p>
                    <p className="text-xs text-slate-400">{t.necessaryDesc}</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.analytics}
                    onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <div>
                    <p className="text-sm font-medium">{t.analytics}</p>
                    <p className="text-xs text-slate-400">{t.analyticsDesc}</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.marketing}
                    onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <div>
                    <p className="text-sm font-medium">{t.marketing}</p>
                    <p className="text-xs text-slate-400">{t.marketingDesc}</p>
                  </div>
                </label>
              </div>

              <div className="flex gap-2 justify-end">
                <button
                  onClick={handleReject}
                  className="px-4 py-2 rounded text-sm font-medium border border-slate-500 hover:bg-slate-800"
                >
                  {t.rejectAll}
                </button>
                <button
                  onClick={handleSavePreferences}
                  className="px-4 py-2 rounded text-sm font-medium bg-brand-600 hover:bg-brand-700"
                >
                  {t.savePreferences}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
