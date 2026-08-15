import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import CookieBanner from "./CookieBanner";

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <CookieBanner />
    </div>
  );
}
