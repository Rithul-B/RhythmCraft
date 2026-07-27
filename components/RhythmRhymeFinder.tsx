"use client";

import { Search, Music2 } from "lucide-react";
import { useEffect, useRef } from "react";
import { WordGrid } from "./WordGrid";
import { ToneVibeSelector } from "./ToneVibeSelector";
import { useWordSearch } from "@/hooks/useWordSearch";
import { FOOT_PATTERNS, type FootPreset } from "@/lib/stress";

const SYLLABLE_OPTIONS = [1, 2, 3, 4, 5];

const FOOT_LABELS: { id: FootPreset; label: string; pattern: string }[] = [
  { id: "any", label: "Any", pattern: "—" },
  { id: "iambic", label: "Iambic", pattern: FOOT_PATTERNS.iambic.join(" ") },
  { id: "trochaic", label: "Trochaic", pattern: FOOT_PATTERNS.trochaic.join(" ") },
  { id: "anapestic", label: "Anapestic", pattern: FOOT_PATTERNS.anapestic.join(" ") },
  { id: "dactylic", label: "Dactylic", pattern: FOOT_PATTERNS.dactylic.join(" ") },
];

interface RhythmRhymeFinderProps {
  footPreset: FootPreset;
  onFootPresetChange: (preset: FootPreset) => void;
  initialQuery?: string;
  autoFocus?: boolean;
}

export function RhythmRhymeFinder({
  footPreset,
  onFootPresetChange,
  initialQuery = "",
  autoFocus = false,
}: RhythmRhymeFinderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    query,
    setQuery,
    syllableFilters,
    toggleSyllableFilter,
    tone,
    setTone,
    results,
    loading,
    isMock,
    copiedWord,
    copyWord,
  } = useWordSearch();

  useEffect(() => {
    if (initialQuery) setQuery(initialQuery);
  }, [initialQuery, setQuery]);

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  return (
    <div className="flex h-full flex-col gap-5">
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-light)]"
          strokeWidth={1.5}
        />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search rhymes & synonyms..."
          className="w-full rounded-full border border-[var(--glass-border)] bg-[var(--surface-raised)]/70 py-3 pl-11 pr-5 text-sm text-[var(--text)] shadow-sm placeholder:text-[var(--muted-light)] transition-all duration-300 focus:shadow-md focus:outline-none"
        />
      </div>

      <div>
        <p className="mb-2.5 text-[10px] tracking-[0.2em] text-[var(--muted-light)] uppercase">
          Syllables
        </p>
        <div className="flex flex-wrap gap-2">
          {SYLLABLE_OPTIONS.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => toggleSyllableFilter(n)}
              className={`zen-pill rounded-full px-4 py-1.5 font-mono text-xs transition-all duration-300 ease-in-out ${
                syllableFilters.includes(n)
                  ? "zen-pill-active bg-[var(--text)] text-[var(--bg)] ring-2 ring-[var(--glow-active)] shadow-[0_0_12px_var(--accent-soft)]"
                  : "bg-[var(--surface-raised)]/50 text-[var(--muted)] hover:-translate-y-0.5 hover:text-[var(--text)] hover:shadow-md"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2.5 flex items-center gap-1.5 text-[10px] tracking-[0.2em] text-[var(--muted-light)] uppercase">
          <Music2 className="h-3 w-3" strokeWidth={1.5} />
          Metric feet
        </p>
        <div className="flex flex-wrap gap-2">
          {FOOT_LABELS.map(({ id, label, pattern }) => (
            <button
              key={id}
              type="button"
              onClick={() => onFootPresetChange(id)}
              className={`zen-pill rounded-2xl px-3.5 py-2 text-left transition-all duration-300 ease-in-out ${
                footPreset === id
                  ? "zen-pill-active bg-[var(--text)] text-[var(--bg)] ring-2 ring-[var(--glow-active)] shadow-[0_0_12px_var(--accent-soft)]"
                  : "bg-[var(--surface-raised)]/50 text-[var(--muted)] hover:-translate-y-0.5 hover:text-[var(--text)] hover:shadow-md"
              }`}
            >
              <span className="block text-xs">{label}</span>
              {id !== "any" && (
                <span className="font-mono text-[10px] opacity-70">{pattern}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <ToneVibeSelector tone={tone} onToneChange={setTone} />

      {isMock && query.trim() && (
        <p className="text-[10px] tracking-[0.15em] text-[var(--muted-light)] uppercase">
          Using offline suggestions
        </p>
      )}

      <div className="min-h-0 flex-1 overflow-y-auto">
        <WordGrid
          words={results}
          loading={loading}
          query={query}
          copiedWord={copiedWord}
          onCopy={copyWord}
        />
      </div>
    </div>
  );
}
