import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/store";
import { LogOut, User, Shield } from "lucide-react";
import { useState, useEffect } from "react";

const navText = {
  PL: { contact: "Kontakt", support: "Pomoc", admin: "Panel admina", client: "Panel klienta", logout: "Wyloguj", login: "Zaloguj się", register: "Załóż konto" },
  EN: { contact: "Contact", support: "Support", admin: "Admin Panel", client: "Client Panel", logout: "Logout", login: "Sign in", register: "Sign up" },
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [lang, setLang] = useState<"PL" | "EN">("PL");

  useEffect(() => {
    const savedLang = localStorage.getItem("linklang_lang") as "PL" | "EN" | null;
    if (savedLang) setLang(savedLang);

    // Słuchaj zmian języka
    const handleStorageChange = () => {
      const newLang = localStorage.getItem("linklang_lang") as "PL" | "EN" | null;
      if (newLang) setLang(newLang);
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("languageChange", handleStorageChange);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("languageChange", handleStorageChange);
    };
  }, []);

  const t = navText[lang];

  return (
    <nav className="border-b border-slate-200 bg-white/90 backdrop-blur-sm">
      {/* Language Switcher */}
      <div className="flex justify-end gap-2 border-b border-slate-100 bg-slate-50 px-4 py-2">
        <button
          onClick={() => {
            setLang("PL");
            localStorage.setItem("linklang_lang", "PL");
            window.dispatchEvent(new Event("languageChange"));
          }}
          className={`px-3 py-1 rounded text-sm font-medium transition ${
            lang === "PL"
              ? "bg-brand-600 text-white"
              : "bg-white text-slate-700 border border-slate-200 hover:border-brand-600"
          }`}
        >
          PL
        </button>
        <button
          onClick={() => {
            setLang("EN");
            localStorage.setItem("linklang_lang", "EN");
            window.dispatchEvent(new Event("languageChange"));
          }}
          className={`px-3 py-1 rounded text-sm font-medium transition ${
            lang === "EN"
              ? "bg-brand-600 text-white"
              : "bg-white text-slate-700 border border-slate-200 hover:border-brand-600"
          }`}
        >
          EN
        </button>
      </div>
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="h-10 w-10 rounded-full ring-1 ring-slate-200 bg-white p-1 shadow-sm">
          <img src="/linklang_logo.svg" alt="LinkLang" className="h-8 w-8" />
        </Link>
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              const contactSection = document.getElementById("contact-section");
              if (contactSection) {
                contactSection.scrollIntoView({ behavior: "smooth" });
              } else {
                navigate("/");
                setTimeout(() => {
                  const section = document.getElementById("contact-section");
                  if (section) {
                    section.scrollIntoView({ behavior: "smooth" });
                  }
                }, 500);
              }
            }}
            className="text-sm font-medium text-slate-600 hover:text-brand-600"
          >
            {t.contact}
          </button>
          <Link to="/support" className="text-sm font-medium text-slate-600 hover:text-brand-600">
            {t.support}
          </Link>
          {user ? (
            <>
              {user.role === "ADMIN" && (
                <Link to="/admin" className="text-sm font-medium text-slate-600 hover:text-brand-600 flex items-center gap-1">
                  <Shield className="h-4 w-4" /> {t.admin}
                </Link>
              )}
              <Link to="/portal" className="text-sm font-medium text-slate-600 hover:text-brand-600 flex items-center gap-1">
                <User className="h-4 w-4" /> {t.client}
              </Link>
              <button
                onClick={() => { logout(); navigate("/"); }}
                className="text-sm font-medium text-slate-500 hover:text-red-600 flex items-center gap-1"
              >
                <LogOut className="h-4 w-4" /> {t.logout}
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-brand-600">{t.login}</Link>
              <Link to="/register" className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700">
                {t.register}
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
