export type TonePreset =
  | "none"
  | "melancholic"
  | "ethereal"
  | "gothic"
  | "uplifting"
  | "archaic"
  | "modern";

export interface ToneDefinition {
  id: Exclude<TonePreset, "none">;
  label: string;
  mlHints: string;
  seeds: string[];
  demote: string[];
}

export const TONE_DEFINITIONS: ToneDefinition[] = [
  {
    id: "melancholic",
    label: "Melancholic",
    mlHints: "sad sorrowful mournful grief",
    seeds: [
      "weep", "mourning", "dusk", "fading", "lonely", "ache", "sorrow",
      "lament", "dim", "waning", "forlorn", "bleak", "somber", "grief",
      "tear", "shadow", "wistful", "yearning", "drear", "woe",
    ],
    demote: ["joy", "bright", "gleam", "laugh"],
  },
  {
    id: "ethereal",
    label: "Ethereal",
    mlHints: "celestial dreamy otherworldly light",
    seeds: [
      "mist", "veil", "glimmer", "haze", "float", "drift", "luminous",
      "celestial", "faint", "whisper", "gossamer", "transcend", "aura",
      "spirit", "dream", "shimmer", "radiant", "ethereal", "fog", "glow",
    ],
    demote: ["grit", "harsh", "crude"],
  },
  {
    id: "gothic",
    label: "Gothic",
    mlHints: "dark macabre eerie haunted",
    seeds: [
      "shadow", "thorn", "crypt", "veil", "raven", "bleak", "grave",
      "thorn", "wrought", "dread", "specter", "gloom", "murk", "ash",
      "iron", "black", "wither", "chill", "forsaken", "haunt",
    ],
    demote: ["sunny", "cheer", "bright"],
  },
  {
    id: "uplifting",
    label: "Uplifting",
    mlHints: "joyful hopeful bright radiant",
    seeds: [
      "rise", "soar", "gleam", "bright", "hope", "dawn", "bloom",
      "lift", "shine", "warm", "golden", "triumph", "joy", "radiant",
      "soar", "ascend", "glory", "bliss", "cheer", "light",
    ],
    demote: ["gloom", "dread", "woe"],
  },
  {
    id: "archaic",
    label: "Archaic",
    mlHints: "old english poetic ancient",
    seeds: [
      "thou", "thee", "hath", "doth", "ere", "whence", "whilst",
      "oft", "nigh", "hither", "yon", "betwixt", "forsooth", "verily",
      "twas", "neer", "oer", "amidst", "henceforth", "wherefore",
    ],
    demote: ["lol", "gonna", "tech"],
  },
  {
    id: "modern",
    label: "Modern / Gritty",
    mlHints: "urban raw contemporary street",
    seeds: [
      "grit", "raw", "neon", "static", "fracture", "pulse", "chrome",
      "asphalt", "wired", "glitch", "urban", "steel", "burn", "crash",
      "noise", "sharp", "bleed", "grind", "rush", "snap",
    ],
    demote: ["thee", "hath", "forsooth"],
  },
];

export function getToneDefinition(tone: TonePreset): ToneDefinition | null {
  if (tone === "none") return null;
  return TONE_DEFINITIONS.find((t) => t.id === tone) ?? null;
}

export function getToneMlHints(tone: TonePreset): string | null {
  return getToneDefinition(tone)?.mlHints ?? null;
}

export function scoreWordForTone(word: string, tone: TonePreset): number {
  if (tone === "none") return 50;

  const def = getToneDefinition(tone);
  if (!def) return 50;

  const lower = word.toLowerCase();
  let score = 0;

  if (def.seeds.some((s) => lower === s || lower.includes(s))) score += 80;
  if (def.demote.some((d) => lower.includes(d))) score -= 40;

  if (tone === "archaic") {
    if (/(eth|est|thou|thee|hath|doth|ere|nigh)$/.test(lower)) score += 30;
  }

  if (tone === "modern") {
    if (/(ing|ed|ly)$/.test(lower) && lower.length < 6) score += 10;
  }

  return Math.max(0, Math.min(100, score));
}
