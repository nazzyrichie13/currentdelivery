import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import axios from "axios";

// Base English keys
const baseTranslations = {
  "Create Shipment": "Create Shipment",
  "Tracking Code": "Tracking Code",
  "Track": "Track",
  "Download Invoice": "Download Invoice",
  "Shipment not found.": "Shipment not found.",
  "Failed to load shipment.": "Failed to load shipment.",
  "Loading shipment…": "Loading shipment…",
  "Shipment": "Shipment",
  "Status": "Status",
  "Delivery Progress": "Delivery Progress",
  "Shipment is currently on hold.": "Shipment is currently on hold.",
  "Sender Information": "Sender Information",
  "Recipient": "Recipient",
  "Package Details": "Package Details",
  "Package Description": "Package Description",
  "Package Service Type": "Package Service Type",
  "Package Quantity": "Package Quantity",
  "Package Weight": "Package Weight",
  "Shipping Cost": "Shipping Cost",
  "Shipping Details": "Shipping Details",
  "Service": "Service",
  "Expected Delivery": "Expected Delivery",
  "Confirmed Delivery": "Confirmed Delivery",
  "Package Destination": "Package Destination",
  "Current Location": "Current Location",
  "Last updated": "Last updated",
  "Package Image": "Package Image",
  "No location yet": "No location yet",
  "Chat": "Chat",
  "Do you want to reschedule delivery Date? click here!!!": "Do you want to reschedule delivery Date? click here!!!",
  "N/A": "N/A",
  "Not yet": "Not yet",
  "Package": "Package"
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
