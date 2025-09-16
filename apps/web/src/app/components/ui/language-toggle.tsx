import { Globe } from "lucide-react";
import { useTranslation } from "react-i18next";

const languages = [
  { code: "ka", label: "ქარ" },
  { code: "en", label: "ENG" }
];

export function LanguageToggle() {
  const { i18n } = useTranslation();
  const current = i18n.language ?? "ka";

  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-surface-muted/70 px-3 py-1 text-xs text-ink-500">
      <Globe className="h-4 w-4" />
      <div className="flex gap-1">
        {languages.map((lang) => (
          <button
            key={lang.code}
            type="button"
            onClick={() => i18n.changeLanguage(lang.code)}
            className={`rounded-full px-2 py-1 font-semibold transition ${
              current.startsWith(lang.code)
                ? "bg-brand-500 text-white shadow-glow"
                : "hover:text-ink-900"
            }`}
          >
            {lang.label}
          </button>
        ))}
      </div>
    </div>
  );
}
