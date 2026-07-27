import type { DatamuseWord } from "./datamuse";
import { TONE_DEFINITIONS, type TonePreset } from "./toneLexicon";

const TONE_MOCK_WORDS: Record<string, DatamuseWord[]> = {
  melancholic: [
    { word: "lament", numSyllables: 2, tags: ["pron:L AH0 M EH1 N T"] },
    { word: "forlorn", numSyllables: 2, tags: ["pron:F ER0 L AO1 R N"] },
    { word: "somber", numSyllables: 2, tags: ["pron:S AA1 M B ER0"] },
  ],
  gothic: [
    { word: "shadow", numSyllables: 2, tags: ["pron:SH AE1 D OW2"] },
    { word: "thorn", numSyllables: 1, tags: ["pron:TH AO1 R N"] },
    { word: "veil", numSyllables: 1, tags: ["pron:V EY1 L"] },
  ],
  ethereal: [
    { word: "glimmer", numSyllables: 2, tags: ["pron:G L IH1 M ER0"] },
    { word: "mist", numSyllables: 1, tags: ["pron:M IH1 S T"] },
    { word: "haze", numSyllables: 1, tags: ["pron:HH EY1 Z"] },
  ],
  uplifting: [
    { word: "radiant", numSyllables: 3, tags: ["pron:R EY1 D IY0 AH0 N T"] },
    { word: "soar", numSyllables: 1, tags: ["pron:S AO1 R"] },
    { word: "bloom", numSyllables: 1, tags: ["pron:B L UW1 M"] },
  ],
};

const MOCK_RHYMES: Record<string, DatamuseWord[]> = {
  love: [
    { word: "dove", numSyllables: 1, tags: ["pron:D AH1 V"] },
    { word: "above", numSyllables: 2, tags: ["pron:AH0 B AH1 V"] },
    { word: "glove", numSyllables: 1, tags: ["pron:G L AH1 V"] },
    { word: "of", numSyllables: 1, tags: ["pron:AH1 V"] },
    { word: "shove", numSyllables: 1, tags: ["pron:SH AH1 V"] },
  ],
  night: [
    { word: "light", numSyllables: 1, tags: ["pron:L AY1 T"] },
    { word: "bright", numSyllables: 1, tags: ["pron:B R AY1 T"] },
    { word: "flight", numSyllables: 1, tags: ["pron:F L AY1 T"] },
    { word: "sight", numSyllables: 1, tags: ["pron:S AY1 T"] },
    { word: "twilight", numSyllables: 2, tags: ["pron:T W AY1 L AY2 T"] },
    { word: "moonlight", numSyllables: 2, tags: ["pron:M UW1 N L AY2 T"] },
  ],
  heart: [
    { word: "start", numSyllables: 1, tags: ["pron:S T AA1 R T"] },
    { word: "part", numSyllables: 1, tags: ["pron:P AA1 R T"] },
    { word: "art", numSyllables: 1, tags: ["pron:AA1 R T"] },
    { word: "apart", numSyllables: 2, tags: ["pron:AH0 P AA1 R T"] },
    { word: "depart", numSyllables: 2, tags: ["pron:D IH0 P AA1 R T"] },
  ],
  time: [
    { word: "rhyme", numSyllables: 1, tags: ["pron:R AY1 M"] },
    { word: "climb", numSyllables: 1, tags: ["pron:K L AY1 M"] },
    { word: "chime", numSyllables: 1, tags: ["pron:CH AY1 M"] },
    { word: "sublime", numSyllables: 2, tags: ["pron:S AH0 B L AY1 M"] },
    { word: "prime", numSyllables: 1, tags: ["pron:P R AY1 M"] },
  ],
  sea: [
    { word: "free", numSyllables: 1, tags: ["pron:F R IY1"] },
    { word: "tree", numSyllables: 1, tags: ["pron:T R IY1"] },
    { word: "be", numSyllables: 1, tags: ["pron:B IY1"] },
    { word: "dee", numSyllables: 1, tags: ["pron:D IY1"] },
    { word: "flee", numSyllables: 1, tags: ["pron:F L IY1"] },
  ],
  fire: [
    { word: "desire", numSyllables: 3, tags: ["pron:D IH0 Z AY1 ER0"] },
    { word: "higher", numSyllables: 2, tags: ["pron:HH AY1 ER0"] },
    { word: "wire", numSyllables: 1, tags: ["pron:W AY1 ER0"] },
    { word: "choir", numSyllables: 2, tags: ["pron:K W AY1 ER0"] },
    { word: "pyre", numSyllables: 1, tags: ["pron:P AY1 ER0"] },
  ],
};

const MOCK_SYNONYMS: Record<string, DatamuseWord[]> = {
  love: [
    { word: "affection", numSyllables: 3, tags: ["pron:AH0 F EH1 K SH AH0 N"] },
    { word: "devotion", numSyllables: 3, tags: ["pron:D IH0 V OW1 SH AH0 N"] },
    { word: "passion", numSyllables: 2, tags: ["pron:P AE1 SH AH0 N"] },
    { word: "adore", numSyllables: 2, tags: ["pron:AH0 D AO1 R"] },
    { word: "cherish", numSyllables: 2, tags: ["pron:CH EH1 R IH0 SH"] },
  ],
  night: [
    { word: "darkness", numSyllables: 2, tags: ["pron:D AA1 R K N AH0 S"] },
    { word: "evening", numSyllables: 2, tags: ["pron:IY1 V N IH0 NG"] },
    { word: "midnight", numSyllables: 2, tags: ["pron:M IH1 D N AY2 T"] },
    { word: "dusk", numSyllables: 1, tags: ["pron:D AH1 S K"] },
    { word: "twilight", numSyllables: 2, tags: ["pron:T W AY1 L AY2 T"] },
  ],
  heart: [
    { word: "soul", numSyllables: 1, tags: ["pron:S OW1 L"] },
    { word: "spirit", numSyllables: 2, tags: ["pron:S P IH1 R IH0 T"] },
    { word: "core", numSyllables: 1, tags: ["pron:K AO1 R"] },
    { word: "center", numSyllables: 2, tags: ["pron:S EH1 N T ER0"] },
    { word: "essence", numSyllables: 2, tags: ["pron:EH1 S AH0 N S"] },
  ],
  time: [
    { word: "moment", numSyllables: 2, tags: ["pron:M OW1 M AH0 N T"] },
    { word: "era", numSyllables: 2, tags: ["pron:IH1 R AH0"] },
    { word: "period", numSyllables: 3, tags: ["pron:P IH1 R IY0 AH0 D"] },
    { word: "epoch", numSyllables: 2, tags: ["pron:EH1 P AH0 K"] },
    { word: "duration", numSyllables: 3, tags: ["pron:D UH0 R EY1 SH AH0 N"] },
  ],
  sea: [
    { word: "ocean", numSyllables: 2, tags: ["pron:OW1 SH AH0 N"] },
    { word: "waves", numSyllables: 1, tags: ["pron:W EY1 V Z"] },
    { word: "tide", numSyllables: 1, tags: ["pron:T AY1 D"] },
    { word: "deep", numSyllables: 1, tags: ["pron:D IY1 P"] },
    { word: "brine", numSyllables: 1, tags: ["pron:B R AY1 N"] },
  ],
  fire: [
    { word: "flame", numSyllables: 1, tags: ["pron:F L EY1 M"] },
    { word: "blaze", numSyllables: 1, tags: ["pron:B L EY1 Z"] },
    { word: "inferno", numSyllables: 3, tags: ["pron:IH0 N F ER1 N OW0"] },
    { word: "heat", numSyllables: 1, tags: ["pron:HH IY1 T"] },
    { word: "ember", numSyllables: 2, tags: ["pron:EH1 M B ER0"] },
  ],
};

const GENERIC_MOCK: DatamuseWord[] = [
  { word: "moon", numSyllables: 1, tags: ["pron:M UW1 N"] },
  { word: "dream", numSyllables: 1, tags: ["pron:D R IY1 M"] },
  { word: "stream", numSyllables: 1, tags: ["pron:S T R IY1 M"] },
  { word: "whisper", numSyllables: 2, tags: ["pron:W IH1 S P ER0"] },
  { word: "shadow", numSyllables: 2, tags: ["pron:SH AE1 D OW2"] },
  { word: "silver", numSyllables: 2, tags: ["pron:S IH1 L V ER0"] },
  { word: "golden", numSyllables: 2, tags: ["pron:G OW1 L D AH0 N"] },
  { word: "eternal", numSyllables: 3, tags: ["pron:IH0 T ER1 N AH0 L"] },
  { word: "melody", numSyllables: 3, tags: ["pron:M EH1 L AH0 D IY0"] },
  { word: "harmony", numSyllables: 3, tags: ["pron:HH AA1 R M AH0 N IY0"] },
  { word: "silence", numSyllables: 2, tags: ["pron:S AY1 L AH0 N S"] },
  { word: "solace", numSyllables: 2, tags: ["pron:S AA1 L AH0 S"] },
];

export function getMockWords(query: string, tone: TonePreset = "none"): DatamuseWord[] {
  const key = query.trim().toLowerCase();
  const rhymes = MOCK_RHYMES[key] ?? [];
  const synonyms = MOCK_SYNONYMS[key] ?? [];
  const toneWords = tone !== "none" ? (TONE_MOCK_WORDS[tone] ?? []) : [];
  const combined = [...rhymes, ...synonyms, ...toneWords];

  if (combined.length === 0) {
    if (tone !== "none") {
      const def = TONE_DEFINITIONS.find((t) => t.id === tone);
      if (def) {
        return def.seeds.slice(0, 10).map((word) => ({
          word,
          numSyllables: word.length > 6 ? 2 : 1,
          tags: [],
        }));
      }
    }
    return GENERIC_MOCK;
  }

  const seen = new Set<string>();
  return combined.filter((w) => {
    const k = w.word.toLowerCase();
    if (seen.has(k) || k === key) return false;
    seen.add(k);
    return true;
  });
}
