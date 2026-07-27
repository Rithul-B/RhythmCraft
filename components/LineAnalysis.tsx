"use client";

import { useState } from "react";
import { BarChart3 } from "lucide-react";
import { CadenceReader } from "./CadenceReader";
import type { LineAnalysisResult } from "@/hooks/useLineAnalysis";
import { FOOT_PATTERNS } from "@/lib/stress";

interface LineAnalysisProps {
  analysis: LineAnalysisResult;
  text: string;
  showAllMeterBreaks: boolean;
  onShowAllMeterBreaksChange: (value: boolean) => void;
}

export function LineAnalysis({
  analysis,
  text,
  showAllMeterBreaks,
  onShowAllMeterBreaksChange,
}: LineAnalysisProps) {
  const {
    activeStats,
    activeLineIndex,
    stanzaLineCount,
    avgSyllablesPerLine,
    rhymeScheme,
    prevailingMeter,
    meterDiagnostics,
    lines,
  } = analysis;

  const softBreaks = meterDiagnostics.filter((b) => b.severity === "soft").length;
  const hardBreaks = meterDiagnostics.filter((b) => b.severity === "hard").length;

  const rhymeLines = lines
    .map((line, i) => ({ line, label: rhymeScheme.labels[i], index: i }))
    .filter((item) => item.line.trim() && item.label);

  return (
    <div className="space-y-6">
      {rhymeScheme.scheme && (
        <div>
          <p className="mb-2 text-[10px] tracking-[0.2em] text-[var(--muted-light)] uppercase">
            Rhyme scheme
          </p>
          <p className="mb-3 font-mono text-2xl tracking-[0.3em] text-[var(--accent)]">
            {rhymeScheme.scheme}
          </p>
          {rhymeLines.length > 0 && (
            <div className="space-y-1 rounded-2xl bg-[var(--surface-raised)]/60 p-3 shadow-sm">
              {rhymeLines.map(({ line, label, index }) => (
                <div
                  key={index}
                  className={`flex gap-2 text-xs ${
                    index === activeLineIndex ? "text-[var(--text)]" : "text-[var(--muted)]"
                  }`}
                >
                  <span className="w-4 shrink-0 font-mono text-[var(--accent)]">{label}</span>
                  <span className="truncate italic">{line}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div>
        <p className="mb-2 text-[10px] tracking-[0.2em] text-[var(--muted-light)] uppercase">
          Meter summary
        </p>
        <div className="rounded-2xl bg-[var(--surface-raised)]/60 p-4 shadow-sm">
          <p className="text-sm text-[var(--text)]">
            Prevailing:{" "}
            <span className="capitalize text-[var(--accent)]">
              {prevailingMeter === "any" ? "Undetected" : prevailingMeter}
            </span>
            {prevailingMeter !== "any" && (
              <span className="ml-2 font-mono text-xs text-[var(--muted)]">
                ({FOOT_PATTERNS[prevailingMeter].join(" ")})
              </span>
            )}
          </p>
          <p className="mt-2 text-xs text-[var(--muted)]">
            {softBreaks} soft break{softBreaks !== 1 ? "s" : ""}
            {hardBreaks > 0 && ` · ${hardBreaks} hard break${hardBreaks !== 1 ? "s" : ""}`}
          </p>
          <label className="mt-3 flex cursor-pointer items-center gap-2 text-xs text-[var(--muted)]">
            <input
              type="checkbox"
              checked={showAllMeterBreaks}
              onChange={(e) => onShowAllMeterBreaksChange(e.target.checked)}
              className="rounded accent-[var(--accent)]"
            />
            Show all meter breaks
          </label>
        </div>
      </div>

      <CadenceReader text={text} />

      {!activeStats || !activeStats.text.trim() ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <BarChart3 className="mb-4 h-8 w-8 text-[var(--muted-light)]" strokeWidth={1.5} />
          <p className="text-sm text-[var(--muted)]">
            Place your cursor on a line to analyze its rhythm.
          </p>
        </div>
      ) : (
        <>
          <div>
            <p className="mb-1 text-[10px] tracking-[0.2em] text-[var(--muted-light)] uppercase">
              Line {activeLineIndex + 1}
            </p>
            <p className="text-sm italic text-[var(--muted)]">
              &ldquo;{activeStats.text}&rdquo;
            </p>
          </div>

          <div>
            <p className="mb-1 text-[10px] tracking-[0.2em] text-[var(--muted-light)] uppercase">
              Syllables
            </p>
            <p className="text-4xl font-light tabular-nums text-[var(--text)]">
              {activeStats.syllables}
            </p>
          </div>

          <div>
            <p className="mb-2 text-[10px] tracking-[0.2em] text-[var(--muted-light)] uppercase">
              Stress pattern
            </p>
            <p className="rounded-2xl bg-[var(--surface-raised)]/70 px-5 py-4 font-mono text-base tracking-widest text-[var(--accent)] shadow-sm">
              {activeStats.stressPattern || "—"}
            </p>
            <p className="mt-2 text-[10px] text-[var(--muted-light)]">
              u = unstressed &nbsp;·&nbsp; / = stressed
            </p>
          </div>

          {activeStats.words.length > 0 && (
            <div>
              <p className="mb-2 text-[10px] tracking-[0.2em] text-[var(--muted-light)] uppercase">
                Word breakdown
              </p>
              <div className="overflow-hidden rounded-2xl bg-[var(--surface-raised)]/60 shadow-sm">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs text-[var(--muted-light)]">
                      <th className="px-4 py-2.5 font-normal">Word</th>
                      <th className="px-4 py-2.5 font-normal">Syl</th>
                      <th className="px-4 py-2.5 font-normal">Stress</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeStats.words.map((w, i) => (
                      <tr key={w.word} className={i % 2 === 0 ? "bg-[var(--surface-raised)]/40" : ""}>
                        <td className="px-4 py-2 text-[var(--text)]">{w.word}</td>
                        <td className="px-4 py-2 font-mono text-[var(--muted)]">{w.syllables}</td>
                        <td className="px-4 py-2 font-mono text-xs text-[var(--muted)]">{w.stress}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      <div className="pt-2">
        <p className="mb-2 text-[10px] tracking-[0.2em] text-[var(--muted-light)] uppercase">
          Stanza summary
        </p>
        <div className="flex gap-6 text-sm text-[var(--muted)]">
          <span>{stanzaLineCount} lines</span>
          <span>{avgSyllablesPerLine.toFixed(1)} avg syl/line</span>
        </div>
      </div>
    </div>
  );
}
