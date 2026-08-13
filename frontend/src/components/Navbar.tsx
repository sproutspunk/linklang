import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/store";
import { LogOut, User, Shield } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-brand-700">LinkLang</Link>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              {user.role === "ADMIN" && (
                <Link to="/admin" className="text-sm font-medium text-slate-600 hover:text-brand-600 flex items-center gap-1">
                  <Shield className="h-4 w-4" /> Panel admina
                </Link>
              )}
              <Link to="/portal" className="text-sm font-medium text-slate-600 hover:text-brand-600 flex items-center gap-1">
                <User className="h-4 w-4" /> Panel klienta
              </Link>
              <button
                onClick={() => { logout(); navigate("/"); }}
                className="text-sm font-medium text-slate-500 hover:text-red-600 flex items-center gap-1"
              >
                <LogOut className="h-4 w-4" /> Wyloguj
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-brand-600">Zaloguj się</Link>
              <Link to="/register" className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700">
                Załóż konto
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
