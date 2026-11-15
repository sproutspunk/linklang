const measurementId = "G-44JZYMF2YD";
const scriptId = "linklang-analytics";
let initialized = false;

export function hasAnalyticsConsent(): boolean {
  try {
    return localStorage.getItem("linklang_cookies_accepted") === "true" &&
      JSON.parse(localStorage.getItem("linklang_cookie_preferences") || "null")?.analytics === true;
  } catch {
    return false;
  }
}

export function applyAnalyticsConsent(allowed: boolean) {
  window["ga-disable-G-44JZYMF2YD"] = !allowed;
  if (!allowed) {
    window.gtag = undefined;
    return;
  }

  window.dataLayer = window.dataLayer || [];
  function queue(..._args: unknown[]) { window.dataLayer!.push(arguments); }
  window.gtag = queue;
  if (initialized) return;
  initialized = true;
  // Queue configuration before loading the library; first visits without consent
  // never download or execute Google Analytics.
  queue("js", new Date());
  window.gtag("config", measurementId);
  const script = document.createElement("script");
  script.id = scriptId;
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);
}
