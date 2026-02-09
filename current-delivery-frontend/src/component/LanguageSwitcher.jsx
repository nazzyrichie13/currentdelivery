import { useState } from "react";
import i18n from "../i18n"; // adjust path to your i18n instance

const languages = [
  { code: "en", label: "English", flag: "https://flagcdn.com/w20/gb.png" },
  { code: "es", label: "Español", flag: "https://flagcdn.com/w20/es.png" },
  { code: "fr", label: "Français", flag: "https://flagcdn.com/w20/fr.png" },
  { code: "de", label: "Deutsch", flag: "https://flagcdn.com/w20/de.png" },
  { code: "zh", label: "中文", flag: "https://flagcdn.com/w20/cn.png" },
  { code: "ja", label: "日本語", flag: "https://flagcdn.com/w20/jp.png" },
  { code: "ru", label: "Русский", flag: "https://flagcdn.com/w20/ru.png" },
  { code: "it", label: "Italiano", flag: "https://flagcdn.com/w20/it.png" },
  { code: "pt", label: "Português", flag: "https://flagcdn.com/w20/pt.png" },
  { code: "ar", label: "العربية", flag: "https://flagcdn.com/w20/sa.png" },
  { code: "ko", label: "한국어", flag: "https://flagcdn.com/w20/kr.png" },
  { code: "hi", label: "हिन्दी", flag: "https://flagcdn.com/w20/in.png" },
  { code: "tr", label: "Türkçe", flag: "https://flagcdn.com/w20/tr.png" },
  { code: "nl", label: "Nederlands", flag: "https://flagcdn.com/w20/nl.png" },
  { code: "sv", label: "Svenska", flag: "https://flagcdn.com/w20/se.png" },
  { code: "pl", label: "Polski", flag: "https://flagcdn.com/w20/pl.png" },
];

export default function LanguageSwitcher() {
  const [loading, setLoading] = useState(false);

  const changeLanguage = async (lng) => {
    try {
      setLoading(true);
      await i18n.changeLanguage(lng);
    } catch (err) {
      console.error("Language change failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <select
        onChange={(e) => changeLanguage(e.target.value)}
        value={i18n.language}
        style={{ fontSize: "16px", padding: "4px" }}
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.label}
          </option>
        ))}
      </select>

      {/* Display the flag of the current language */}
      <img
        src={languages.find((l) => l.code === i18n.language)?.flag}
        alt="flag"
        style={{ width: "24px", height: "16px" }}
      />

      {loading && <span>Translating...</span>}
    </div>
  );
}
