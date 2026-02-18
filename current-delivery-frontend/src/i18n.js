import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import axios from "axios";

// 1️⃣ BASE TRANSLATIONS
const baseTranslations = {
  "Create Shipment": "Create Shipment",
  "Track Shipment": "Track Shipment",
  "Tracking Code": "Tracking Code",
  "Shipment": "Shipment",
  "Status": "Status",
  "Delivery Progress": "Delivery Progress",
  "Shipment not found.": "Shipment not found.",
  "Failed to load shipment.": "Failed to load shipment.",
  "Loading shipment…": "Loading shipment…",
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
  "Package": "Package",
  "created": "Created",
  "scheduled": "Scheduled",
  "rescheduled": "Rescheduled",
  "in_transit": "In Transit",
  "on_hold": "On Hold",
  "out_for_delivery": "Out for Delivery",
  "delivered": "Delivered",
  "cancelled": "Cancelled",

  // HOME / LANDING
  "How Does It Work?": "How Does It Work?",
  "Step 1.": "Step 1.",
  "Step 2.": "Step 2.",
  "Step 3.": "Step 3.",
  "Sign Up Today": "Sign Up Today",

  // NAV / HEADER
  "Logout": "Logout",
  "Login": "Login",
  "Admin": "Admin",
  "Home": "Home",
  "About Us": "About Us",
  "Blog": "Blog",
  "FAQ": "FAQ",
  "Track": "Track",
  "Contact": "Contact",

  // REVIEWS / MARKETING
  "Customer Reviews": "Customer Reviews",
  "See what our clients speak": "See what our clients speak",

  // SERVICES / FEATURES
  "Reliable & On-Time Delivery": "Reliable & On-Time Delivery",
  "We prioritize speed and accuracy to ensure your packages arrive safely and on schedule.": "We prioritize speed and accuracy to ensure your packages arrive safely and on schedule.",
  "Real-Time Shipment Tracking": "Real-Time Shipment Tracking",
  "Track your delivery at every stage, from pickup to final destination.": "Track your delivery at every stage, from pickup to final destination.",
  "Secure Package Handling": "Secure Package Handling",
  "Your items are handled with care and protected throughout the delivery process.": "Your items are handled with care and protected throughout the delivery process.",
  "International Shipping Expertise": "International Shipping Expertise",
  "We ship from the USA to countries worldwide and from other countries to the USA with full compliance.": "We ship from the USA to countries worldwide and from other countries to the USA with full compliance.",
  "Transparent Pricing": "Transparent Pricing",
  "No hidden fees—clear and honest shipping costs you can trust.": "No hidden fees—clear and honest shipping costs you can trust.",
  "Dedicated Customer Support": "Dedicated Customer Support",
  "Our support team is always available to assist you before, during, and after delivery.": "Our support team is always available to assist you before, during, and after delivery.",
  "Trusted by Many Customers": "Trusted by Many Customers",
  "Our growing customer base is built on consistency, professionalism, and satisfaction.": "Our growing customer base is built on consistency, professionalism, and satisfaction.",
  "Sign up today! it's simple": "Sign up today! it's simple",
  "Get A Free U.S. Address": "Get A Free U.S. Address",
  "Ship To & From Worldwide With Confidence": "Ship To & From Worldwide With Confidence",

  // SHIPPING TYPES
  "Air Freight": "Air Freight",
  "Sea Freight": "Sea Freight",
  "Vehicle Delivery": "Vehicle Delivery",
  "Home Delivery": "Home Delivery",

  // MARKETING / HERO
  "We ship from the USA to countries worldwide, and from other countries to the USA.": "We ship from the USA to countries worldwide, and from other countries to the USA.",
  "Reliable and Affordable Shipping Services To Give You the Peace Of mind You Deserve": "Reliable and Affordable Shipping Services To Give You the Peace Of mind You Deserve",
  "Shipping To & From Any Country Should Be More Reliable": "Shipping To & From Any Country Should Be More Reliable",
  "Ship, Send, & Receive With Confidence": "Ship, Send, & Receive With Confidence"
};

// 2️⃣ AI BACKEND FOR MULTIPLE LANGUAGES
class OpenAIBackend {
  type = "backend";

  read(language, namespace, callback) {
    if (language === "en") return callback(null, baseTranslations);

    axios
      .post("/api/translate", {
        text: Object.values(baseTranslations),
        targetLang: language
      })
      .then((res) => {
        const translationsArray = res.data.translations || [];
        const translations = {};
        Object.keys(baseTranslations).forEach((key, i) => {
          translations[key] = translationsArray[i] || baseTranslations[key];
        });
        callback(null, translations);
      })
      .catch((err) => {
        console.error("Translation backend error:", err.message);
        callback(null, baseTranslations);
      });
  }
}

// 3️⃣ INIT i18next
i18n
  .use(new OpenAIBackend())
  .use(initReactI18next)
  .init({
    lng: "en",
    fallbackLng: "en",
    preload: ["en", "es", "fr", "it", "zh"],
    ns: ["translation"],
    defaultNS: "translation",
    debug: true,
    interpolation: { escapeValue: false },
    react: { useSuspense: true },
    saveMissing: false,
    initImmediate: false
  });

export default i18n;
