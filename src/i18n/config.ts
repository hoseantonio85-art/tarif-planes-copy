import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import tariff from "@/i18n/locales/ru/tariff";

void i18n.use(initReactI18next).init({
  resources: {
    ru: {
      tariff,
    },
  },
  lng: "ru",
  fallbackLng: "ru",
  defaultNS: "tariff",
  ns: ["tariff"],
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;

