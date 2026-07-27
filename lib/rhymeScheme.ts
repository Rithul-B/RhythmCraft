import { getWordsFromLine } from "./syllables";

export interface RhymeSchemeResult {
  scheme: string;
  labels: string[];
  groups: Map<string, number[]>;
}

const VOWELS = "aeiouy";

const hasVowel = (s: string) => [...s].some((c) => VOWELS.includes(c));

// A leading "y" is a consonant ("you"), everywhere else it acts as a vowel ("pity").
const isVowelAt = (s: string, i: number) =>
  VOWELS.includes(s[i]) && !(s[i] === "y" && i === 0);

function getEndWord(line: string): string {
  const words = getWordsFromLine(line);
  if (words.length === 0) return "";
  return words[words.length - 1].toLowerCase().replace(/[^a-z']/g, "");
}

/**
 * Words rhyme on everything from their last stressed vowel onward, so the key deliberately
 * excludes the consonant preceding that vowel — that is the part a rhyme must differ on.
 */
function getRhymeKey(word: string): string {
  if (!word) return "";
  const cleaned = word.toLowerCase().replace(/[^a-z]/g, "");
  if (!cleaned) return "";

  // A silent trailing "e" belongs to the previous vowel's sound: "fade" rhymes on "ade", not "e".
  const hasSilentE =
    cleaned.length > 2 &&
    cleaned.endsWith("e") &&
    !isVowelAt(cleaned, cleaned.length - 2) &&
    hasVowel(cleaned.slice(0, -2));
  const searchEnd = hasSilentE ? cleaned.length - 1 : cleaned.length;

  let i = searchEnd - 1;
  while (i >= 0 && !isVowelAt(cleaned, i)) i--;
  if (i < 0) return cleaned.slice(-2);

  while (i > 0 && isVowelAt(cleaned, i - 1)) i--;

  // Doubled consonants after the vowel are purely orthographic: "hills" rhymes "daffodils".
  const key = cleaned.slice(i).replace(/([bcdfghjklmnpqrstvwxz])\1+/g, "$1");

  // A final "y" is /aɪ/ when it is the only vowel ("sky") but /i/ otherwise ("pity").
  if (key === "y") return hasVowel(cleaned.slice(0, i)) ? "y" : "ay";

  return key;
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
