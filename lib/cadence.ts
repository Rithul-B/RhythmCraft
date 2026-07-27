import { countSyllables } from "./syllables";

export type PacingLabel = "Deliberate" | "Moderate" | "Fast";

export function getPacingLabel(bpm: number): PacingLabel {
  if (bpm < 90) return "Deliberate";
  if (bpm <= 130) return "Moderate";
  return "Fast";
}

export function bpmToSpeechRate(bpm: number): number {
  const clamped = Math.max(60, Math.min(180, bpm));
  return 0.5 + ((clamped - 60) / 120) * 1.0;
}

export function estimateReadingTimeMs(text: string, bpm: number): number {
  const syllables = countSyllables(text);
  const baseMsPerSyllable = 280;
  const rateFactor = 120 / Math.max(60, bpm);
  return Math.round(syllables * baseMsPerSyllable * rateFactor);
}

export function formatReadingTime(ms: number): string {
  const seconds = Math.ceil(ms / 1000);
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.floor(seconds / 60);
  const rem = seconds % 60;
  return rem > 0 ? `${mins}m ${rem}s` : `${mins}m`;
}

export interface StanzaCadence {
  index: number;
  lineCount: number;
  syllables: number;
  readingTimeMs: number;
  pacingLabel: PacingLabel;
}

export function getStanzaCadences(text: string, bpm: number): StanzaCadence[] {
  const stanzas = text.split(/\n\s*\n/);
  return stanzas
    .filter((s) => s.trim())
    .map((stanza, index) => {
      const lines = stanza.split("\n").filter((l) => l.trim());
      const syllables = countSyllables(stanza);
      return {
        index: index + 1,
        lineCount: lines.length,
        syllables,
        readingTimeMs: estimateReadingTimeMs(stanza, bpm),
        pacingLabel: getPacingLabel(bpm),
      };
    });
}

export function getActiveStanzaText(text: string, lineIndex: number): string {
  const lines = text.split("\n");
  let start = lineIndex;
  let end = lineIndex;

  while (start > 0 && lines[start - 1]?.trim()) start--;
  while (start > 0 && !lines[start - 1]?.trim()) start--;
  if (start > 0 && !lines[start - 1]?.trim()) start++;

  while (end < lines.length - 1 && lines[end + 1]?.trim()) end++;
  while (end < lines.length - 1 && !lines[end + 1]?.trim()) end++;

  return lines.slice(start, end + 1).join("\n");
}
