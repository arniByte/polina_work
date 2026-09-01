import { useCallback, useEffect, useState } from "react";

export type Theme = "dark" | "light";

const KEY = "polina-theme";

export function readTheme(): Theme {
  try {
    return localStorage.getItem(KEY) === "light" ? "light" : "dark";
  } catch {
    /* приватный режим или запрет на хранилище — молча живём с тёмной */
    return "dark";
  }
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(readTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem(KEY, theme);
    } catch {
      /* не смогли сохранить — тема всё равно применена на эту сессию */
    }
  }, [theme]);

  const toggle = useCallback(
    () => setTheme((t) => (t === "dark" ? "light" : "dark")),
    [],
  );

  return { theme, toggle };
}
