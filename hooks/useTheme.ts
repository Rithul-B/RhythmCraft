"use client";

import { useCallback, useEffect, useState } from "react";

export type ThemeId = "parchment" | "midnight";

const STORAGE_KEY = "rhythmic-thesaurus-theme";

export function useTheme() {
  const [theme, setThemeState] = useState<ThemeId>("parchment");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const valid: ThemeId[] = ["parchment", "midnight"];
    const next =
      stored && valid.includes(stored as ThemeId)
        ? (stored as ThemeId)
        : "parchment";
    setThemeState(next);
    document.documentElement.setAttribute("data-theme", next);
  }, []);

  const setTheme = useCallback((next: ThemeId) => {
    setThemeState(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem(STORAGE_KEY, next);
  }, []);

  return { theme, setTheme };
}
