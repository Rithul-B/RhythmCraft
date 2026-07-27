import { getWordsFromLine } from "./syllables";

export interface RhymeSchemeResult {
  scheme: string;
  labels: string[];
  groups: Map<string, number[]>;
}

const VOWEL_GROUPS: Record<string, string> = {
  a: "A",
  e: "E",
  i: "I",
  o: "O",
  u: "U",
  y: "Y",
};

function getEndWord(line: string): string {
  const words = getWordsFromLine(line);
  if (words.length === 0) return "";
  return words[words.length - 1].toLowerCase().replace(/[^a-z']/g, "");
}

function getRhymeKey(word: string): string {
  if (!word) return "";
  const cleaned = word.toLowerCase().replace(/[^a-z]/g, "");
  if (!cleaned) return "";

  let vowelIndex = -1;
  for (let i = cleaned.length - 1; i >= 0; i--) {
    if ("aeiouy".includes(cleaned[i])) {
      vowelIndex = i;
      break;
    }
  }

  if (vowelIndex === -1) return cleaned.slice(-2);

  const vowel = cleaned[vowelIndex];
  const tail = cleaned.slice(vowelIndex);
  const onset = cleaned.slice(0, vowelIndex).replace(/[^bcdfghjklmnpqrstvwxyz]/g, "");
  const group = VOWEL_GROUPS[vowel] ?? vowel.toUpperCase();

  return `${group}:${onset.slice(-1)}${tail}`;
}

export function computeRhymeScheme(lines: string[]): RhymeSchemeResult {
  const labels: string[] = new Array(lines.length).fill("");
  const groups = new Map<string, number[]>();
  const rhymeKeyToLetter = new Map<string, string>();
  const letterToRhymeKey = new Map<string, string>();
  let nextLetterCode = 65;

  const endWords = lines.map(getEndWord);

  for (let i = 0; i < lines.length; i++) {
    if (!lines[i].trim()) {
      labels[i] = "";
      continue;
    }

    const endWord = endWords[i];
    if (!endWord) {
      labels[i] = "";
      continue;
    }

    const rhymeKey = getRhymeKey(endWord);
    let letter = rhymeKeyToLetter.get(rhymeKey);

    if (!letter) {
      for (const [existingLetter, existingKey] of letterToRhymeKey) {
        if (existingKey === rhymeKey) {
          letter = existingLetter;
          break;
        }
      }
    }

    if (!letter) {
      letter = String.fromCharCode(nextLetterCode);
      nextLetterCode++;
      rhymeKeyToLetter.set(rhymeKey, letter);
      letterToRhymeKey.set(letter, rhymeKey);
      groups.set(letter, [i]);
    } else {
      const existing = groups.get(letter) ?? [];
      groups.set(letter, [...existing, i]);
    }

    labels[i] = letter;
  }

  const scheme = labels.filter(Boolean).join("");

  return { scheme, labels, groups };
}

export function getRhymeLabel(
  labels: string[],
  lineIndex: number
): string {
  return labels[lineIndex] ?? "";
}
