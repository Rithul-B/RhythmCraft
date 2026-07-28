export type AppLanguage = "en" | "es" | "fr" | "de" | "it";

export const APP_LANGUAGES: { id: AppLanguage; label: string; nativeLabel: string }[] = [
  { id: "en", label: "English", nativeLabel: "English" },
  { id: "es", label: "Spanish", nativeLabel: "Español" },
  { id: "fr", label: "French", nativeLabel: "Français" },
  { id: "de", label: "German", nativeLabel: "Deutsch" },
  { id: "it", label: "Italian", nativeLabel: "Italiano" },
];

/** Languages with full rhyme + syllable + meter + tone support via Datamuse. */
export function hasFullWordSearch(lang: AppLanguage): boolean {
  return lang === "en" || lang === "es";
}

/** Tone filters only make sense for English seed lexicons. */
export function hasToneFilters(lang: AppLanguage): boolean {
  return lang === "en";
}
