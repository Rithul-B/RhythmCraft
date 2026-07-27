"use client";

import { Play, Square } from "lucide-react";
import { useCadenceReader } from "@/hooks/useCadenceReader";
import {
  estimateReadingTimeMs,
  formatReadingTime,
  getPacingLabel,
  getStanzaCadences,
} from "@/lib/cadence";

interface CadenceReaderProps {
  text: string;
}

export function CadenceReader({ text }: CadenceReaderProps) {
  const { bpm, setBpm, isPlaying, isSupported, speak, stop } = useCadenceReader();

  const readingTime = formatReadingTime(estimateReadingTimeMs(text, bpm));
  const pacingLabel = getPacingLabel(bpm);
  const stanzas = getStanzaCadences(text, bpm);

  if (!isSupported) {
    return (
      <p className="text-xs text-[var(--muted)]">
        Speech synthesis is not available in this browser.
      </p>
    );
  }

  return (
    <div>
      <p className="mb-2 text-[10px] tracking-[0.2em] text-[var(--muted-light)] uppercase">
        Cadence reader
      </p>
      <div className="rounded-2xl bg-[var(--surface-raised)]/60 p-4 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <button
            type="button"
            onClick={() => (isPlaying ? stop() : speak(text))}
            disabled={!text.trim()}
            className="flex items-center gap-2 rounded-full bg-[var(--text)] px-4 py-2 text-xs text-[var(--bg)] transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            {isPlaying ? (
              <>
                <Square className="h-3 w-3" fill="currentColor" />
                Stop
              </>
            ) : (
              <>
                <Play className="h-3 w-3" />
                Read aloud
              </>
            )}
          </button>
          <span className="text-xs text-[var(--muted)]">
            {readingTime} · {pacingLabel}
          </span>
        </div>

        <label className="block">
          <span className="mb-1 block text-[10px] text-[var(--muted-light)] uppercase">
            Tempo — {bpm} BPM
          </span>
          <input
            type="range"
            min={60}
            max={180}
            value={bpm}
            onChange={(e) => setBpm(Number(e.target.value))}
            className="w-full accent-[var(--accent)]"
          />
        </label>

        {stanzas.length > 1 && (
          <div className="mt-3 space-y-1">
            {stanzas.map((s) => (
              <p key={s.index} className="text-[10px] text-[var(--muted)]">
                Stanza {s.index}: {s.lineCount} lines · {formatReadingTime(s.readingTimeMs)}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
