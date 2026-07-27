"use client";

import { useCallback, useEffect, useState } from "react";

export type ThemeId = "parchment" | "midnight";

const STORAGE_KEY = "rhythmic-thesaurus-theme";

function readStoredTheme(): ThemeId {
  if (typeof window === "undefined") return "parchment";
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === "parchment" || stored === "midnight" ? stored : "parchment";
}

export function useTheme() {
  const [theme, setThemeState] = useState<ThemeId>(readStoredTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const setTheme = useCallback((next: ThemeId) => {
    setThemeState(next);
    localStorage.setItem(STORAGE_KEY, next);
  }, []);

  return { theme, setTheme };
}
