import { create } from "zustand";

interface User {
  id: number;
  email: string;
  name: string | null;
  role: "CLIENT" | "ADMIN";
}

interface AuthState {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  user: JSON.parse(localStorage.getItem("linklang_user") || "null"),
  token: localStorage.getItem("linklang_token") || null,
  setAuth: (user, token) => {
    localStorage.setItem("linklang_user", JSON.stringify(user));
    localStorage.setItem("linklang_token", token);
    set({ user, token });
  },
  logout: () => {
    localStorage.removeItem("linklang_user");
    localStorage.removeItem("linklang_token");
    set({ user: null, token: null });
  },
}));
