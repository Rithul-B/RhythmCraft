"use client";

import { useCallback, useEffect, useState } from "react";
import { APP_LANGUAGES, type AppLanguage } from "@/lib/i18n/languages";
import { t, type TranslationKey } from "@/lib/i18n/translations";

const STORAGE_KEY = "rhythmcraft-language";

function isAppLanguage(value: string | null): value is AppLanguage {
  return APP_LANGUAGES.some((l) => l.id === value);
}

function readStoredLanguage(): AppLanguage {
  if (typeof window === "undefined") return "en";
  const stored = localStorage.getItem(STORAGE_KEY);
  return isAppLanguage(stored) ? stored : "en";
}

export function useLanguage() {
  const [language, setLanguageState] = useState<AppLanguage>(readStoredLanguage);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = useCallback((next: AppLanguage) => {
    setLanguageState(next);
    localStorage.setItem(STORAGE_KEY, next);
  }, []);

  const translate = useCallback(
    (key: TranslationKey) => t(language, key),
    [language]
  );

  return {
    language,
    setLanguage,
    t: translate,
    /** Content language for word search / grammar mirrors the UI language. */
    contentLanguage: language,
  };
}
