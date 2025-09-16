import { MoonStar, SunMedium } from "lucide-react";
import { clsx } from "clsx";
import { useTheme } from "../../providers/theme-provider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={clsx(
        "relative inline-flex items-center gap-2 rounded-full px-4 py-2",
        "bg-surface-muted/70 text-ink-500 hover:text-ink-900 transition"
      )}
      aria-label="Toggle color theme"
    >
      {theme === "light" ? <MoonStar className="h-4 w-4" /> : <SunMedium className="h-4 w-4" />}
      <span className="text-sm font-medium">{theme === "light" ? "ბნელი" : "ღია"}</span>
    </button>
  );
}
