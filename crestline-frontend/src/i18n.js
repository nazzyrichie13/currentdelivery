import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import translations from "./translations";

i18n
  .use(initReactI18next)
  .init({
    resources: translations,   // all languages
    lng: "en",
    fallbackLng: "en",

    ns: ["translation"],
    defaultNS: "translation",

    interpolation: {
      escapeValue: false
    },

    react: {
      useSuspense: true
    },

    debug: false
  });

export default i18n;
