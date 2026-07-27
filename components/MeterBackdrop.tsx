"use client";

import { getBrokenWordIndices, type MeterBreak } from "@/lib/meterDiagnostics";
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
          const brokenIndices = getBrokenWordIndices(meterDiagnostics, lineIndex);
          const showLine = showAllBreaks || lineIndex === activeLineIndex;

          if (!line.trim()) {
            return <div key={lineIndex}>&nbsp;</div>;
          }

          // Split on whitespace while keeping the separators, so indentation and repeated
          // spaces survive verbatim. Reconstructing from words alone shifts the underlines.
          let wordIndex = -1;

          return (
            <div key={lineIndex}>
              {line.split(/(\s+)/).map((segment, segmentIndex) => {
                if (!segment) return null;
                if (!segment.trim()) return <span key={segmentIndex}>{segment}</span>;

                wordIndex += 1;
                const isBroken = showLine && brokenIndices.has(wordIndex);

                return (
                  <span
                    key={segmentIndex}
                    className={
                      isBroken
                        ? "text-transparent underline decoration-[#C4A882]/60 decoration-2 underline-offset-[6px]"
                        : "text-transparent"
                    }
                  >
                    {segment}
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
