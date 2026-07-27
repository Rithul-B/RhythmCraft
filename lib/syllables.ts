export function countWordSyllables(word: string): number {
  const cleaned = word.toLowerCase().replace(/[^a-z']/g, "");
  if (!cleaned) return 0;

  if (cleaned.length <= 3) return 1;

  let count = 0;
  const vowels = "aeiouy";
  let prevWasVowel = false;

  for (let i = 0; i < cleaned.length; i++) {
    const isVowel = vowels.includes(cleaned[i]);
    if (isVowel && !prevWasVowel) count++;
    prevWasVowel = isVowel;
  }

  if (cleaned.endsWith("e") && !cleaned.endsWith("le") && count > 1) {
    count--;
  }

  if (cleaned.endsWith("le") && cleaned.length > 2 && !vowels.includes(cleaned[cleaned.length - 3])) {
    count++;
  }

  if (cleaned.endsWith("ed") && !cleaned.endsWith("ted") && !cleaned.endsWith("ded")) {
    const stem = cleaned.slice(0, -2);
    if (!/[aeiouy]ed$/.test(stem + "ed")) count = Math.max(1, count - 1);
  }

  if (cleaned.endsWith("es") && count > 1) {
    const beforeEs = cleaned.slice(0, -2);
    if (/[sxz]$/.test(beforeEs) || /[cs]h$/.test(beforeEs)) {
      // keep count
    } else if (!/[aeiouy]es$/.test(cleaned)) {
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
