import React, { useState } from "react";
import i18n from "i18next";

const languages = [
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "fr", label: "Français" },
  { code: "de", label: "Deutsch" },
  { code: "zh", label: "中文" },
  // Add more as needed
];

export default function LanguageSwitcher() {
  const [loading, setLoading] = useState(false);

  const changeLanguage = async (lng) => {
    setLoading(true);
    await i18n.changeLanguage(lng); // triggers dynamic translation
    setLoading(false);
  };

  return (
    <div>
      <select
        onChange={(e) => changeLanguage(e.target.value)}
        value={i18n.language}
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.label}
          </option>
        ))}
      </select>
      {loading && <span style={{ marginLeft: "10px" }}>Translating...</span>}
    </div>
  );
}
