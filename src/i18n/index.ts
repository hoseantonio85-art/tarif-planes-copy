import i18n, { type InitOptions } from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import { defaultLanguage, defaultNamespace, resources } from "@/i18n/config";

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: false,
    fallbackLng: defaultLanguage,
    defaultNS: defaultNamespace,
    ns: Object.keys(resources.ru),
    resources,
    interpolation: {
      escapeValue: false,
      skipOnVariables: false,
    },
    detection: {
      caches: ["cookie"],
      order: ["querystring", "cookie"],
    },
    react: { useSuspense: true },
  } as InitOptions);

export default i18n;
