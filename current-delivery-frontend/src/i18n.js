
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import axios from "axios";

///////////////////////////////////////////////////////////
// 1️⃣ BASE TRANSLATIONS (FIXED STRUCTURE)
///////////////////////////////////////////////////////////

const baseTranslations = {
  

      "Create Shipment": "Create Shipment",
      "Track Shipment": "Track Shipment",
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
      "We ship from the USA to countries worldwide, and from other countries to the USA.": "We ship from the USA to countries worldwide, and from other countries to the USA.",
  "Reliable and Affordable Shipping Services To Give You the Peace Of mind You Deserve": "Reliable and Affordable Shipping Services To Give You the Peace Of mind You Deserve",
  "Sign Up Today": "Sign Up Today",
  "You Deserve A Shipping Provider You Can Trust": "You Deserve A Shipping Provider You Can Trust",
  "Reasons to Trust Our Delivery Service": "Reasons to Trust Our Delivery Service",
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
  "Shipping To & From Any Country Should Be More Reliable": "Shipping To & From Any Country Should Be More Reliable",
  "How Does It Work?": "How Does It Work?",
  "Step 1.": "Step 1.",
  "sign up today! it's simple": "sign up today! it's simple",
  "Step 2.": "Step 2.",
  "Get A Free U.S. Address": "Get A Free U.S. Address",
  "Step 3.": "Step 3.",
  "Ship To & From WorldWide With Confidence": "Ship To & From WorldWide With Confidence",
  "Core Services": "Core Services",
  "Air Freight": "Air Freight",
  "Sea Freight": "Sea Freight",
  "VehicleDelivery": "VehicleDelivery",
  "Home Delivery": "Home Delivery",
  "Ship, Send, & Receive With Confidence": "Ship, Send, & Receive With Confidence",
  "Welcome Banner": "Welcome Banner"
    
  
};

///////////////////////////////////////////////////////////
// 2️⃣ AI BACKEND (FIXED)
///////////////////////////////////////////////////////////

class OpenAIBackend {
  type = "backend";

  read(language, namespace, callback) {
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
        callback(null, translations); // ✅ pass proper object
      })
      .catch((err) => {
        console.error("Translation backend error:", err.message);
        callback(null, baseTranslations); // fallback
      });
  }
}


// Init i18next
i18n
   .use(new OpenAIBackend())
  .use(initReactI18next)
  .init({
    lng: "en",
    fallbackLng: "en",
    ns: ["translation"],
    defaultNS: "translation",
    debug: true,
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
    saveMissing: true
  });

export default i18n;