import { countLineSyllables, getWordsFromLine } from "./syllables";
import {
  FOOT_PATTERNS,
  getLineStressArray,
  getWordStressPattern,
  matchesMeter,
  type FootPreset,
} from "./stress";

export type MeterBreakType = "syllable" | "stress";
export type MeterBreakSeverity = "soft" | "hard";

export interface MeterBreak {
  lineIndex: number;
  wordIndex: number;
  type: MeterBreakType;
  severity: MeterBreakSeverity;
}

export interface LineMeterInput {
  index: number;
  text: string;
  syllables: number;
}

const METER_OPTIONS: Exclude<FootPreset, "any">[] = [
  "iambic",
  "trochaic",
  "anapestic",
  "dactylic",
];

function mode(values: number[]): number {
  if (values.length === 0) return 0;
  const freq = new Map<number, number>();
  for (const v of values) freq.set(v, (freq.get(v) ?? 0) + 1);
  let best = values[0];
  let bestCount = 0;
  for (const [v, c] of freq) {
    if (c > bestCount) {
      best = v;
      bestCount = c;
    }
  }
  return best;
}

export function detectPrevailingMeter(
  lineStats: LineMeterInput[],
  footPreset: FootPreset
): FootPreset {
  if (footPreset !== "any") return footPreset;

  const nonEmpty = lineStats.filter((l) => l.text.trim().length > 0);
  if (nonEmpty.length === 0) return "any";

  let bestFoot: FootPreset = "iambic";
  let bestScore = -1;

  for (const foot of METER_OPTIONS) {
    const score = nonEmpty.filter((line) =>
      matchesMeter(getLineStressArray(line.text), foot)
    ).length;
    if (score > bestScore) {
      bestScore = score;
      bestFoot = foot;
    }
  }

  return bestFoot;
}

function getExpectedStressAtPosition(
  foot: Exclude<FootPreset, "any">,
  position: number
): "u" | "/" {
  const pattern = FOOT_PATTERNS[foot];
  return pattern[position % pattern.length];
}

export function diagnoseDocument(
  lines: string[],
  footPreset: FootPreset
): { breaks: MeterBreak[]; prevailingMeter: FootPreset } {
  const lineStats: LineMeterInput[] = lines.map((text, index) => ({
    index,
    text,
    syllables: countLineSyllables(text),
  }));

  const prevailingMeter = detectPrevailingMeter(lineStats, footPreset);
  const breaks: MeterBreak[] = [];

  const nonEmpty = lineStats.filter((l) => l.text.trim().length > 0);
  const prevailingSyllableCount =
    nonEmpty.length > 0 ? mode(nonEmpty.map((l) => l.syllables)) : 0;

  for (const line of lineStats) {
    if (!line.text.trim()) continue;

    const words = getWordsFromLine(line.text);
    const syllableDeviation = Math.abs(line.syllables - prevailingSyllableCount);
    let stressBreaks = 0;

    if (prevailingMeter !== "any") {
      let stressPos = 0;
      for (let wordIndex = 0; wordIndex < words.length; wordIndex++) {
        const wordStress = getWordStressPattern(words[wordIndex]);
        for (let s = 0; s < wordStress.length; s++) {
          const expected = getExpectedStressAtPosition(
            prevailingMeter as Exclude<FootPreset, "any">,
            stressPos
          );
          if (wordStress[s] !== expected) {
            stressBreaks++;
            breaks.push({
              lineIndex: line.index,
              wordIndex,
              type: "stress",
              severity: "soft",
            });
          }
          stressPos++;
        }
      }
    }

    if (syllableDeviation > 0) {
      breaks.push({
        lineIndex: line.index,
        wordIndex: Math.max(0, words.length - 1),
        type: "syllable",
        severity: syllableDeviation >= 2 || stressBreaks >= 2 ? "hard" : "soft",
      });
    }

    if (stressBreaks >= 2) {
      for (const b of breaks) {
        if (b.lineIndex === line.index && b.type === "stress") {
          b.severity = "hard";
        }
      }
    }
  }

  return { breaks, prevailingMeter };
}

export function getBreaksForLine(
  breaks: MeterBreak[],
  lineIndex: number
): MeterBreak[] {
  return breaks.filter((b) => b.lineIndex === lineIndex);
}

export function getBrokenWordIndices(
  breaks: MeterBreak[],
  lineIndex: number
): Set<number> {
  return new Set(
    breaks
      .filter((b) => b.lineIndex === lineIndex)
      .map((b) => b.wordIndex)
  );
}
