export const serviceLabels: Record<string, { PL: string; EN: string }> = {
  TRANSLATION: { PL: "Tłumaczenie dokumentów", EN: "Document translation" },
  INTERPRETER: { PL: "Tłumaczenie ustne", EN: "Interpreting" },
  PHONE_VIDEO: { PL: "Telefon / wideo", EN: "Phone / video" },
  PUBLIC_SERVICES: { PL: "Usługi publiczne", EN: "Public services" },
  BUSINESS: { PL: "Biznes", EN: "Business" },
};
export const contextLabels: Record<string, { PL: string; EN: string }> = {
  contract: { PL: "Umowa", EN: "Contract" }, certificate: { PL: "Akt / świadectwo", EN: "Certificate" },
  medical: { PL: "Medyczne", EN: "Medical" }, general: { PL: "Ogólne", EN: "General" },
};
export const institutionLabels: Record<string, string> = {
  universal_credit: "Universal Credit", hmrc: "HMRC", jobcentre: "Jobcentre Plus", nhs: "NHS",
};
