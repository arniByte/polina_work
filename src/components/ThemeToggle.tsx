import type { Theme } from "../lib/theme";
import "./ThemeToggle.css";

/** Полукруг вместо солнца с луной: тот же жест, но не сток. */
export function ThemeToggle({
  theme,
  onToggle,
}: {
  theme: Theme;
  onToggle: () => void;
}) {
  const next = theme === "dark" ? "светлую" : "тёмную";

  return (
    <button
      className="theme-toggle"
      onClick={onToggle}
      aria-label={`Переключить на ${next} тему`}
      title={`Переключить на ${next} тему`}
    >
      <svg viewBox="0 0 20 20" aria-hidden="true">
        <circle cx="10" cy="10" r="7.5" className="theme-toggle__ring" />
        <path d="M10 2.5a7.5 7.5 0 0 1 0 15z" className="theme-toggle__fill" />
      </svg>
    </button>
  );
}
