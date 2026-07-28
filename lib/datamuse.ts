export interface DatamuseWord {
  word: string;
  score?: number;
  numSyllables?: number;
  tags?: string[];
}

export interface WordResult {
  word: string;
  numSyllables: number;
  tags?: string[];
  source: "datamuse" | "mock";
  toneScore?: number;
}

export function buildDatamuseUrls(
  query: string,
  max = 80,
  toneMl?: string | null,
  lang: "en" | "es" = "en"
): string[] {
  const encoded = encodeURIComponent(query.trim());
  const base = "https://api.datamuse.com/words";
  const metadata = "md=s&md=r";
  const vocab = lang === "es" ? "&v=es" : "";

  const urls = [
    `${base}?rel_rhy=${encoded}&${metadata}&max=${max}${vocab}`,
    `${base}?ml=${encoded}&${metadata}&max=${max}${vocab}`,
  ];

  if (toneMl && lang === "en") {
    urls.push(
      `${base}?ml=${encodeURIComponent(toneMl)}&${metadata}&max=${max}${vocab}`
    );
  }

  return urls;
}

export function dedupeWords(words: DatamuseWord[]): DatamuseWord[] {
  const seen = new Set<string>();
  return words.filter((w) => {
    const key = w.word.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function normalizeWordResults(
  words: DatamuseWord[],
  source: "datamuse" | "mock"
): WordResult[] {
  return words.map((w) => ({
    word: w.word,
    numSyllables: w.numSyllables ?? 1,
    tags: w.tags,
    source,
  }));
}
