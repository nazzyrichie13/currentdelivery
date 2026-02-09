import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import axios from "axios";

// Base English keys
const baseTranslations = {
  "Create Shipment": "Create Shipment",
  "Tracking Code": "Tracking Code",
  "Track": "Track",
  "Download Invoice": "Download Invoice",
};

// Custom backend to fetch translations from OpenAI dynamically
class OpenAIBackend {
  type = "backend";

  async read(language, namespace, callback) {
    try {
      const translations = {};

      // Loop through keys and get translations
      for (const key of Object.keys(baseTranslations)) {
        const prompt = `Translate this into ${language}: "${baseTranslations[key]}"`;

        // Call your backend API that communicates with OpenAI
        const response = await axios.post("/api/translate", { text: baseTranslations[key], targetLang: language });
        translations[key] = response.data.translation || baseTranslations[key];
      }

      callback(null, translations);
    } catch (error) {
      console.error("Translation error:", error);
      callback(error, null);
    }
  }
}

i18n
  .use(initReactI18next)
  .use(OpenAIBackend)
  .init({
    lng: "en",
    fallbackLng: "en",
    debug: false,
    interpolation: { escapeValue: false },
    ns: ["translation"],
    defaultNS: "translation",
    react: { useSuspense: true },
  });

export default i18n;
