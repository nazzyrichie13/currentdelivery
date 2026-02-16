import { useState } from "react";
import { useTranslation } from "react-i18next";

const languages = [
  { code: "en", label: "English", flag: "https://flagcdn.com/w20/gb.png" },
  { code: "us", label: "English (US)", flag: "https://flagcdn.com/w20/us.png" },
  { code: "es", label: "Spanish", flag: "https://flagcdn.com/w20/es.png" },
  { code: "fr", label: "French", flag: "https://flagcdn.com/w20/fr.png" },
  { code: "de", label: "German", flag: "https://flagcdn.com/w20/de.png" },
  { code: "it", label: "Italian", flag: "https://flagcdn.com/w20/it.png" },
  { code: "pt", label: "Portuguese", flag: "https://flagcdn.com/w20/pt.png" },
  { code: "ru", label: "Russian", flag: "https://flagcdn.com/w20/ru.png" },
  { code: "zh", label: "Chinese", flag: "https://flagcdn.com/w20/cn.png" },
  { code: "ja", label: "Japanese", flag: "https://flagcdn.com/w20/jp.png" },
  { code: "ko", label: "Korean", flag: "https://flagcdn.com/w20/kr.png" },
  { code: "ar", label: "Arabic", flag: "https://flagcdn.com/w20/sa.png" },
  { code: "hi", label: "Hindi", flag: "https://flagcdn.com/w20/in.png" },
  { code: "tr", label: "Turkish", flag: "https://flagcdn.com/w20/tr.png" },
  { code: "nl", label: "Dutch", flag: "https://flagcdn.com/w20/nl.png" },
  { code: "sv", label: "Swedish", flag: "https://flagcdn.com/w20/se.png" },
  { code: "pl", label: "Polish", flag: "https://flagcdn.com/w20/pl.png" },
  { code: "no", label: "Norwegian", flag: "https://flagcdn.com/w20/no.png" },
  { code: "fi", label: "Finnish", flag: "https://flagcdn.com/w20/fi.png" },
  { code: "da", label: "Danish", flag: "https://flagcdn.com/w20/dk.png" },
  { code: "el", label: "Greek", flag: "https://flagcdn.com/w20/gr.png" },
  { code: "he", label: "Hebrew", flag: "https://flagcdn.com/w20/il.png" },
  { code: "th", label: "Thai", flag: "https://flagcdn.com/w20/th.png" },
  { code: "vi", label: "Vietnamese", flag: "https://flagcdn.com/w20/vn.png" },
  { code: "id", label: "Indonesian", flag: "https://flagcdn.com/w20/id.png" },
  { code: "ms", label: "Malay", flag: "https://flagcdn.com/w20/my.png" },
  { code: "uk", label: "Ukrainian", flag: "https://flagcdn.com/w20/ua.png" },
  { code: "ro", label: "Romanian", flag: "https://flagcdn.com/w20/ro.png" },
  { code: "hu", label: "Hungarian", flag: "https://flagcdn.com/w20/hu.png" },
  { code: "cs", label: "Czech", flag: "https://flagcdn.com/w20/cz.png" },
  { code: "sk", label: "Slovak", flag: "https://flagcdn.com/w20/sk.png" },
  { code: "bg", label: "Bulgarian", flag: "https://flagcdn.com/w20/bg.png" },
  { code: "hr", label: "Croatian", flag: "https://flagcdn.com/w20/hr.png" },
  { code: "sr", label: "Serbian", flag: "https://flagcdn.com/w20/rs.png" },
  { code: "sl", label: "Slovenian", flag: "https://flagcdn.com/w20/si.png" },
  { code: "et", label: "Estonian", flag: "https://flagcdn.com/w20/ee.png" },
  { code: "lv", label: "Latvian", flag: "https://flagcdn.com/w20/lv.png" },
  { code: "lt", label: "Lithuanian", flag: "https://flagcdn.com/w20/lt.png" },
  { code: "fa", label: "Persian", flag: "https://flagcdn.com/w20/ir.png" },
  { code: "sw", label: "Swahili", flag: "https://flagcdn.com/w20/ke.png" },
  { code: "af", label: "Afrikaans", flag: "https://flagcdn.com/w20/za.png" }
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [loading, setLoading] = useState(false);

  const changeLanguage = async (lng) => {
    setLoading(true);
    await i18n.changeLanguage(lng);
    setLoading(false);
  };

  const current =
    languages.find((l) => l.code === i18n.language) ||
    languages[0];

  return (
    <div style={{ display: "flex", gap: 10 }}>
      <select
        value={current.code}
        onChange={(e) =>
          changeLanguage(e.target.value)
        }
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.label}
          </option>
        ))}
      </select>

      <img
        src={current.flag}
        alt=""
        width={24}
      />

      {loading && <span>Translating…</span>}
    </div>
  );
}
