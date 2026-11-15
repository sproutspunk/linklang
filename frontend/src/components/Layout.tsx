import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { useLanguage } from "../lib/language";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import CookieBanner from "./CookieBanner";

export default function Layout() {
  const { lang } = useLanguage();
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={
          <div className="flex justify-center py-16" role="status" aria-label={lang === "PL" ? "Ładowanie" : "Loading"}>
            <Loader2 className="h-6 w-6 animate-spin text-brand-600" />
          </div>
        }>
          <Outlet />
        </Suspense>
      </main>
      <CookieBanner />
    </div>
  );
}
