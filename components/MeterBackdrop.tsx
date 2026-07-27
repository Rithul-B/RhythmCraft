"use client";

import { getBrokenWordIndices, type MeterBreak } from "@/lib/meterDiagnostics";
import { getWordsFromLine } from "@/lib/syllables";
import { editorTextStyles } from "./editorStyles";

interface MeterBackdropProps {
  lines: string[];
  meterDiagnostics: MeterBreak[];
  activeLineIndex: number;
  showAllBreaks: boolean;
}

export function MeterBackdrop({
  lines,
  meterDiagnostics,
  activeLineIndex,
  showAllBreaks,
}: MeterBackdropProps) {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden
    >
      {/* Must mirror the textarea's font and metrics exactly, or the underlines drift off their words. */}
      <div
        style={editorTextStyles}
        className="whitespace-pre-wrap break-words font-[family-name:var(--font-editor)]"
      >
        {lines.map((line, lineIndex) => {
          const words = getWordsFromLine(line);
          const brokenIndices = getBrokenWordIndices(meterDiagnostics, lineIndex);
          const showLine =
            showAllBreaks || lineIndex === activeLineIndex;

          if (words.length === 0) {
            return <div key={lineIndex}>&nbsp;</div>;
          }

          return (
            <div key={lineIndex}>
              {words.map((word, wordIndex) => {
                const isBroken = showLine && brokenIndices.has(wordIndex);
                return (
                  <span key={wordIndex}>
                    <span
                      className={
                        isBroken
                          ? "text-transparent underline decoration-[#C4A882]/60 decoration-2 underline-offset-[6px]"
                          : "text-transparent"
                      }
                    >
                      {word}
                    </span>
                    {wordIndex < words.length - 1 ? " " : ""}
                  </span>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
