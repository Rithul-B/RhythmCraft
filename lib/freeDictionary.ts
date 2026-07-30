import type { WordResult } from "./datamuse";
import type { AppLanguage } from "./i18n/languages";

interface FreeDictSense {
  definition?: string;
  synonyms?: string[];
  subsenses?: FreeDictSense[];
}

interface FreeDictEntry {
  language?: { code?: string; name?: string };
  partOfSpeech?: string;
  synonyms?: string[];
  senses?: FreeDictSense[];
}

interface FreeDictResponse {
  word?: string;
  entries?: FreeDictEntry[];
}

function estimateSyllables(word: string): number {
  const cleaned = word
    .toLowerCase()
    .replace(/[^a-zàâäéèêëïîôùûüçñáíóúüöß']/gi, "");
  if (!cleaned) return 1;
  const groups = cleaned.match(/[aeiouyàâäéèêëïîôùûüáíóúüö]+/gi);
  return Math.max(1, groups?.length ?? 1);
}

function collectSynonyms(node: FreeDictSense | FreeDictEntry, into: Set<string>) {
  for (const syn of node.synonyms ?? []) {
    if (syn?.trim()) into.add(syn.trim());
  }
  if ("senses" in node) {
    for (const sense of node.senses ?? []) collectSynonyms(sense, into);
  }
  if ("subsenses" in node) {
    for (const sub of node.subsenses ?? []) collectSynonyms(sub, into);
  }
}

/**
 * Fetch synonyms via FreeDictionaryAPI.com (Wiktionary-backed).
 * Used for languages without Datamuse rhyme search. Does not provide rhymes.
 */
export async function fetchFreeDictionarySynonyms(
  query: string,
  lang: AppLanguage,
  signal?: AbortSignal
): Promise<WordResult[]> {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const url = `https://freedictionaryapi.com/api/v1/entries/${lang}/${encodeURIComponent(trimmed)}`;

  try {
    const res = await fetch(url, { signal });
    if (!res.ok) return [];
    const data = (await res.json()) as FreeDictResponse;
    if (!data?.entries?.length) return [];

    const synonyms = new Set<string>();
    const lowerQuery = trimmed.toLowerCase();

    for (const entry of data.entries) {
      // Prefer entries that match the requested language when present.
      if (entry.language?.code && entry.language.code !== lang) continue;
      collectSynonyms(entry, synonyms);
    }

    // If language filtering removed everything (unexpected schema), fall back.
    if (synonyms.size === 0) {
      for (const entry of data.entries) collectSynonyms(entry, synonyms);
    }

    return [...synonyms]
      .filter((word) => word.toLowerCase() !== lowerQuery)
      .slice(0, 40)
      .map((word) => ({
        word,
        numSyllables: estimateSyllables(word),
        source: "datamuse" as const,
      }));
  } catch {
    return [];
  }
}
