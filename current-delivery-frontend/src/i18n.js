import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import axios from "axios";

///////////////////////////////////////////////////////////
// 1️⃣ BASE TRANSLATIONS
///////////////////////////////////////////////////////////

const baseTranslations = {
  "Create Shipment": "Create Shipment",
  "Track Shipment": "Track Shipment",
  "Tracking Code": "Tracking Code",
  
  "You Deserve A Shipping Provider You Can Trust": "You Deserve A Shipping Provider You Can Trust",
  "Reasons to Trust Our Delivery Service": "Reasons to Trust Our Delivery Service",
  "Shipping To & From Any Country Should Be More Reliable": "Shipping To & From Any Country Should Be More Reliable",
  "Ship, Send, & Receive With Confidence": "Ship, Send, & Receive With Confidence",
  "Core Services": "Core Services",
  "Download Invoice": "Download Invoice",
  "Welcome to ShipTrack": "Welcome to ShipTrack",
  "Track your shipments quickly and easily":
    "Track your shipments quickly and easily",
  "Enter Tracking Code": "Enter Tracking Code",
  "Submit": "Submit",
  "Recent Shipments": "Recent Shipments",
  "No shipments found": "No shipments found",
  "Shipment": "Shipment",
  "Status": "Status",
  "Delivery Progress": "Delivery Progress",
  "Shipment not found.": "Shipment not found.",
  "Failed to load shipment.": "Failed to load shipment.",
  "Loading shipment…": "Loading shipment…",
  "Shipment is currently on hold.":
    "Shipment is currently on hold.",
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
  "Do you want to reschedule delivery Date? click here!!!":
    "Do you want to reschedule delivery Date? click here!!!",
  "N/A": "N/A",
  "Not yet": "Not yet",
  "Package": "Package",
  "created": "Created",
  "scheduled": "Scheduled",
  "rescheduled": "Rescheduled",
  "in_transit": "In Transit",
  "on_hold": "On Hold",
  "out_for_delivery": "Out for Delivery",
  "delivered": "Delivered",
  "cancelled": "Cancelled",

  // HOME
  "How Does It Work?": "How Does It Work?",
  "Step 1.": "Step 1.",
  "Step 2.": "Step 2.",
  "Step 3.": "Step 3.",
  "Sign Up Today": "Sign Up Today",
  "logout":"logout",
  "Customer Reviews":"Customer Reviews",
  "Admin":"Admin",
  "Home":"Home",
  "About us":"About us",
  "Blog":"Blog",
  "FAQ":"FAQ",
  "Track":"Track",
  "Contact":"Contact",
  "see what our clients speak":"see what our clients speak"

};

///////////////////////////////////////////////////////////
// 2️⃣ AI BACKEND
///////////////////////////////////////////////////////////

class OpenAIBackend {
  type = "backend";

  read(language, namespace, callback) {
    // 🚀 If English → return instantly (prevents init warning)
    if (language === "en") {
      return callback(null, baseTranslations);
    }

    axios
      .post("/api/translate", {
        text: Object.values(baseTranslations),
        targetLang: language
      })
      .then((res) => {
        const translationsArray = res.data.translations || [];

        const translations = {};
        Object.keys(baseTranslations).forEach((key, i) => {
          translations[key] =
            translationsArray[i] || baseTranslations[key];
        });

        callback(null, translations);
      })
      .catch((err) => {
        console.error("Translation backend error:", err.message);
        callback(null, baseTranslations);
      });
  }
}

///////////////////////////////////////////////////////////
// 3️⃣ INIT (FIXED)
///////////////////////////////////////////////////////////

i18n
  .use(new OpenAIBackend())
  .use(initReactI18next)
  .init({
    lng: "en",
    fallbackLng: "en",

    ns: ["translation"],
    defaultNS: "translation",

    // ✅ preload English so namespace is ready
    preload: ["en"],

    debug: true,

    interpolation: {
      escapeValue: false
    },

    react: {
      useSuspense: true   // ✅ MUST be true
    },

    saveMissing: false,  // ❌ disable (you had no create())
    initImmediate: false // ✅ prevents race condition
  });

export default i18n;
