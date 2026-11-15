import { useLanguage } from "./language";

export function cn(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat(useLanguage.getState().lang === "PL" ? "pl-PL" : "en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(amount);
}

export function formatDate(date: string | Date | null) {
  if (!date) return "-";
  return new Date(date).toLocaleDateString(useLanguage.getState().lang === "PL" ? "pl-PL" : "en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
