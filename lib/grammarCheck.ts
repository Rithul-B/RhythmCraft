import type { AppLanguage } from "./i18n/languages";

export interface GrammarMatch {
  offset: number;
  length: number;
  message: string;
  shortMessage: string;
  replacements: string[];
  category: "spelling" | "grammar" | "style" | "other";
}

export interface GrammarCheckResult {
  matches: GrammarMatch[];
  source: "languagetool" | "error";
}

const LANG_MAP: Record<AppLanguage, string> = {
  en: "en-US",
  es: "es",
  fr: "fr",
  de: "de-DE",
  it: "it",
  pt: "pt-PT",
  nl: "nl",
  pl: "pl-PL",
  ru: "ru-RU",
  sv: "sv",
};

export function toLanguageToolCode(lang: AppLanguage): string {
  return LANG_MAP[lang] ?? "en-US";
}

export function categorizeRule(categoryId?: string, issueType?: string): GrammarMatch["category"] {
  const id = (categoryId ?? "").toUpperCase();
  const issue = (issueType ?? "").toLowerCase();
  if (id.includes("TYPOS") || issue === "misspelling") return "spelling";
  if (id.includes("STYLE") || id.includes("REDUNDANCY")) return "style";
  if (id.includes("GRAMMAR") || id.includes("PUNCTUATION") || issue === "grammar") {
    return "grammar";
  }
  return "other";
}
