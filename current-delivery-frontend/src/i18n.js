import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import translations from "./translations";

i18n
  .use(initReactI18next)
  .init({
    resources: translations,
    lng: "en",
    fallbackLng: "en",
    preload: ["en", "fr", "es", "it", "zh"],
    ns: ["translation"],
    defaultNS: "translation",
    debug: true,
    interpolation: { escapeValue: false },
    react: { useSuspense: true },
    saveMissing: false,
    initImmediate: false
  });

export default i18n;

