import { useState } from "react";
import { useTranslation } from "react-i18next";

const languages = [
  { code: "en", label: "English", flag: "https://flagcdn.com/w20/gb.png" },
  { code: "es", label: "Spanish", flag: "https://flagcdn.com/w20/es.png" },
  { code: "fr", label: "French", flag: "https://flagcdn.com/w20/fr.png" },
  { code: "it", label: "Italian", flag: "https://flagcdn.com/w20/it.png" },
  { code: "zh", label: "Chinese", flag: "https://flagcdn.com/w20/cn.png" }
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [loading, setLoading] = useState(false);

  const changeLanguage = async (lng) => {
    setLoading(true);
    try {
      await i18n.changeLanguage(lng);
    } catch (err) {
      console.error("Language change failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const currentLang = languages.find((l) => l.code === i18n.language) || languages[0];

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <select value={currentLang.code} onChange={(e) => changeLanguage(e.target.value)}>
        {languages.map((l) => (
          <option key={l.code} value={l.code}>{l.label}</option>
        ))}
      </select>

      <img src={currentLang.flag} alt={currentLang.label} width={24} height={16} />
      {loading && <span>Translating...</span>}
    </div>
  );
}