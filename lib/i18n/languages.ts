export type AppLanguage =
  | "en"
  | "es"
  | "fr"
  | "de"
  | "it"
  | "pt"
  | "nl"
  | "pl"
  | "ru"
  | "sv";

export const APP_LANGUAGES: { id: AppLanguage; label: string; nativeLabel: string }[] = [
  { id: "en", label: "English", nativeLabel: "English" },
  { id: "es", label: "Spanish", nativeLabel: "Español" },
  { id: "fr", label: "French", nativeLabel: "Français" },
  { id: "de", label: "German", nativeLabel: "Deutsch" },
  { id: "it", label: "Italian", nativeLabel: "Italiano" },
  { id: "pt", label: "Portuguese", nativeLabel: "Português" },
  { id: "nl", label: "Dutch", nativeLabel: "Nederlands" },
  { id: "pl", label: "Polish", nativeLabel: "Polski" },
  { id: "ru", label: "Russian", nativeLabel: "Русский" },
  { id: "sv", label: "Swedish", nativeLabel: "Svenska" },
];

/** Languages with full rhyme + syllable + meter via Datamuse. */
export function hasFullWordSearch(lang: AppLanguage): boolean {
  return lang === "en" || lang === "es";
}

/** Tone / writing-style filters use English seed lexicons. */
export function hasToneFilters(lang: AppLanguage): boolean {
  return lang === "en";
}

/** Synonym-only content languages (Wiktionary Free Dictionary). */
export function isSynonymOnlyLanguage(lang: AppLanguage): boolean {
  return !hasFullWordSearch(lang);
}
