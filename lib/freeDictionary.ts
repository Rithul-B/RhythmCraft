import type { WordResult } from "./datamuse";
import type { AppLanguage } from "./i18n/languages";

interface DictionaryDefinition {
  definition?: string;
  synonyms?: string[];
}

interface DictionaryMeaning {
  partOfSpeech?: string;
  definitions?: DictionaryDefinition[];
  synonyms?: string[];
}

interface DictionaryEntry {
  word?: string;
  meanings?: DictionaryMeaning[];
}

function estimateSyllables(word: string): number {
  const cleaned = word
    .toLowerCase()
    .replace(/[^a-zàâäéèêëïîôùûüçñáíóúüöß']/gi, "");
  if (!cleaned) return 1;
  const groups = cleaned.match(/[aeiouyàâäéèêëïîôùûüáíóúüö]+/gi);
  return Math.max(1, groups?.length ?? 1);
}

/**
 * Fetch synonyms for French / German / Italian via Free Dictionary API (Wiktionary-backed).
 * Does not provide rhyme search.
 */
export async function fetchFreeDictionarySynonyms(
  query: string,
  lang: Extract<AppLanguage, "fr" | "de" | "it">,
  signal?: AbortSignal
): Promise<WordResult[]> {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const url = `https://api.dictionaryapi.dev/api/v2/entries/${lang}/${encodeURIComponent(trimmed)}`;

  try {
    const res = await fetch(url, { signal });
    if (!res.ok) return [];
    const data = (await res.json()) as DictionaryEntry[] | { title?: string };
    if (!Array.isArray(data)) return [];

    const synonyms = new Set<string>();
    const lowerQuery = trimmed.toLowerCase();

    for (const entry of data) {
      for (const meaning of entry.meanings ?? []) {
        for (const syn of meaning.synonyms ?? []) {
          if (syn && syn.toLowerCase() !== lowerQuery) synonyms.add(syn);
        }
        for (const def of meaning.definitions ?? []) {
          for (const syn of def.synonyms ?? []) {
            if (syn && syn.toLowerCase() !== lowerQuery) synonyms.add(syn);
          }
        }
      }
    }

    return [...synonyms].slice(0, 40).map((word) => ({
      word,
      numSyllables: estimateSyllables(word),
      source: "datamuse" as const,
    }));
  } catch {
    return [];
  }
}
