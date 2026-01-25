import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
const resources = {
en: { translation: { "Create Shipment": "Create Shipment", "Tracking Code": "Tracking Code", "Track": "Track", "Download Invoice": "Download Invoice" } },
es: { translation: { "Create Shipment": "Crear Envío", "Tracking Code": "Código de Seguimiento", "Track": "Rastrear", "Download Invoice": "Descargar Factura" } }
};


i18n.use(initReactI18next).init({ resources, fallbackLng: 'en', interpolation: { escapeValue: false } });
export default i18n;