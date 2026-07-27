import { useMemo } from "react";
import { diagnoseDocument, type MeterBreak } from "@/lib/meterDiagnostics";
import { computeRhymeScheme, type RhymeSchemeResult } from "@/lib/rhymeScheme";
import { countLineSyllables } from "@/lib/syllables";
import {
  getLineWordBreakdown,
  getStressPattern,
  type FootPreset,
  type WordStressInfo,
} from "@/lib/stress";

export interface LineStats {
  index: number;
  text: string;
  syllables: number;
  stressPattern: string;
  words: WordStressInfo[];
}

export interface LineAnalysisResult {
  lines: string[];
  lineStats: LineStats[];
  activeLineIndex: number;
  activeLine: string;
  activeStats: LineStats | null;
  stanzaLineCount: number;
  avgSyllablesPerLine: number;
  meterDiagnostics: MeterBreak[];
  prevailingMeter: FootPreset;
  rhymeScheme: RhymeSchemeResult;
  rhymeLabels: string[];
}

export function getLineIndexFromSelection(text: string, selectionStart: number): number {
  if (!text) return 0;
  return text.slice(0, selectionStart).split("\n").length - 1;
}

export function useLineAnalysis(
  text: string,
  selectionStart: number,
  footPreset: FootPreset = "any"
): LineAnalysisResult {
  return useMemo(() => {
    const lines = text.split("\n");
    const activeLineIndex = getLineIndexFromSelection(text, selectionStart);

    const lineStats: LineStats[] = lines.map((line, index) => ({
      index,
      text: line,
      syllables: countLineSyllables(line),
      stressPattern: getStressPattern(line),
      words: getLineWordBreakdown(line),
    }));

    const { breaks: meterDiagnostics, prevailingMeter } = diagnoseDocument(
      lines,
      footPreset
    );
    const rhymeScheme = computeRhymeScheme(lines);
    const rhymeLabels = rhymeScheme.labels;

    const activeStats = lineStats[activeLineIndex] ?? null;
    const nonEmptyLines = lineStats.filter((l) => l.text.trim().length > 0);
    const totalSyllables = nonEmptyLines.reduce((sum, l) => sum + l.syllables, 0);
    const avgSyllablesPerLine =
      nonEmptyLines.length > 0 ? totalSyllables / nonEmptyLines.length : 0;

    return {
      lines,
      lineStats,
      activeLineIndex,
      activeLine: lines[activeLineIndex] ?? "",
      activeStats,
      stanzaLineCount: lines.length,
      avgSyllablesPerLine,
      meterDiagnostics,
      prevailingMeter,
      rhymeScheme,
      rhymeLabels,
    };
  }, [text, selectionStart, footPreset]);
}
