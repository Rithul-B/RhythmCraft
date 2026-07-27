import { countWordSyllables, getWordsFromLine } from "./syllables";

export type FootPreset = "any" | "iambic" | "trochaic" | "anapestic" | "dactylic";

export const FOOT_PATTERNS: Record<Exclude<FootPreset, "any">, ("u" | "/")[]> = {
  iambic: ["u", "/"],
  trochaic: ["/", "u"],
  anapestic: ["u", "u", "/"],
  dactylic: ["/", "u", "u"],
};

export function getWordStressPattern(word: string): ("u" | "/")[] {
  const syllables = countWordSyllables(word);
  if (syllables <= 0) return [];

  if (syllables === 1) return ["/"];

  const pattern: ("u" | "/")[] = [];
  for (let i = 0; i < syllables; i++) {
    if (syllables === 2) {
      pattern.push(i === 0 ? "/" : "u");
    } else if (i === syllables - 1) {
      pattern.push("/");
    } else if (i === 0 && syllables >= 3) {
      pattern.push("/");
    } else {
      pattern.push("u");
    }
  }

  return pattern;
}

export function getLineStressArray(line: string): ("u" | "/")[] {
  const words = getWordsFromLine(line);
  return words.flatMap((word) => getWordStressPattern(word));
}

export function getStressPattern(line: string): string {
  const words = getWordsFromLine(line);
  if (words.length === 0) return "";

  return words
    .map((word) => getWordStressPattern(word).join(" "))
    .join("  ");
}

export function parseArpabetStress(tags?: string[]): ("u" | "/")[] {
  if (!tags) return [];
  const pronTag = tags.find((t) => t.startsWith("pron:"));
  if (!pronTag) return [];

  const phonemes = pronTag.replace("pron:", "").split(" ");
  const pattern: ("u" | "/")[] = [];

  for (const phoneme of phonemes) {
    const match = phoneme.match(/[012]$/);
    if (match) {
      pattern.push(match[0] === "0" ? "u" : "/");
    }
  }

  return pattern;
}

function patternsMatch(a: ("u" | "/")[], b: ("u" | "/")[]): boolean {
  if (a.length < b.length) return false;
  const tail = a.slice(a.length - b.length);
  return tail.every((v, i) => v === b[i]);
}

function isComposedOfFeet(pattern: ("u" | "/")[], foot: ("u" | "/")[]): boolean {
  if (pattern.length === 0 || foot.length === 0) return false;
  if (pattern.length % foot.length !== 0) return false;

  for (let i = 0; i < pattern.length; i++) {
    if (pattern[i] !== foot[i % foot.length]) return false;
  }

  return true;
}

export function matchesMeter(
  stressPattern: ("u" | "/")[],
  foot: FootPreset
): boolean {
  if (foot === "any" || stressPattern.length === 0) return true;

  const footPattern = FOOT_PATTERNS[foot];
  return (
    patternsMatch(stressPattern, footPattern) ||
    isComposedOfFeet(stressPattern, footPattern)
  );
}

export interface WordStressInfo {
  word: string;
  syllables: number;
  stress: string;
}

export function getLineWordBreakdown(line: string): WordStressInfo[] {
  return getWordsFromLine(line).map((word) => {
    const stressArr = getWordStressPattern(word);
    return {
      word,
      syllables: stressArr.length || countWordSyllables(word),
      stress: stressArr.join(" ") || "—",
    };
  });
}
