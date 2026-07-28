export function countWordSyllables(word: string): number {
  // Keep letters (including accented Latin) so Spanish/French/etc. count correctly.
  const cleaned = word
    .toLowerCase()
    .normalize("NFC")
    .replace(/[^\p{L}']/gu, "");
  if (!cleaned) return 0;

  if (cleaned.length <= 3) return 1;

  let count = 0;
  const isVowel = (ch: string) =>
    /[aeiouyàáâäãåāăąèéêëēėęěìíîïīįòóôöõøōőùúûüūůűýÿæœ]/i.test(ch);
  let prevWasVowel = false;

  for (let i = 0; i < cleaned.length; i++) {
    const vowel = isVowel(cleaned[i]);
    if (vowel && !prevWasVowel) count++;
    prevWasVowel = vowel;
  }

  // English-oriented silent-e heuristics still help for English text.
  const ascii = cleaned.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  if (ascii.endsWith("e") && !ascii.endsWith("le") && count > 1) {
    count--;
  }

  if (ascii.endsWith("le") && ascii.length > 2 && !/[aeiouy]/.test(ascii[ascii.length - 3] ?? "")) {
    count++;
  }

  if (ascii.endsWith("ed") && !ascii.endsWith("ted") && !ascii.endsWith("ded")) {
    count = Math.max(1, count - 1);
  }

  if (ascii.endsWith("es") && count > 1) {
    const beforeEs = ascii.slice(0, -2);
    if (/[sxz]$/.test(beforeEs) || /[cs]h$/.test(beforeEs)) {
      // keep count
    } else if (!/[aeiouy]es$/.test(ascii)) {
      count = Math.max(1, count - 1);
    }
  }

  return Math.max(1, count);
}

export function countSyllables(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return 0;
  return words.reduce((sum, word) => sum + countWordSyllables(word), 0);
}

export function countLineSyllables(line: string): number {
  return countSyllables(line);
}

export function getWordsFromLine(line: string): string[] {
  return line.trim().split(/\s+/).filter(Boolean);
}
