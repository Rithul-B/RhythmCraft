"use client";

import { Search, Music2 } from "lucide-react";
import { useEffect, useRef } from "react";
import { WordGrid } from "./WordGrid";
import { ToneVibeSelector } from "./ToneVibeSelector";
import { useWordSearch } from "@/hooks/useWordSearch";
import { FOOT_PATTERNS, type FootPreset } from "@/lib/stress";
import { hasFullWordSearch, hasToneFilters, type AppLanguage } from "@/lib/i18n/languages";
import type { TranslationKey } from "@/lib/i18n/translations";

const SYLLABLE_OPTIONS = [1, 2, 3, 4, 5];

interface RhythmRhymeFinderProps {
  footPreset: FootPreset;
  onFootPresetChange: (preset: FootPreset) => void;
  initialQuery?: string;
  autoFocus?: boolean;
  language: AppLanguage;
  t: (key: TranslationKey) => string;
}

export function RhythmRhymeFinder({
  footPreset,
  onFootPresetChange,
  initialQuery = "",
  autoFocus = false,
  language,
  t,
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
    emojiSuggestions,
  } = useWordSearch(language);

  const fullSearch = hasFullWordSearch(language);
  const showTone = hasToneFilters(language);

  const footLabels: { id: FootPreset; label: string; pattern: string }[] = [
    { id: "any", label: t("footAny"), pattern: "—" },
    { id: "iambic", label: t("footIambic"), pattern: FOOT_PATTERNS.iambic.join(" ") },
    { id: "trochaic", label: t("footTrochaic"), pattern: FOOT_PATTERNS.trochaic.join(" ") },
    { id: "anapestic", label: t("footAnapestic"), pattern: FOOT_PATTERNS.anapestic.join(" ") },
    { id: "dactylic", label: t("footDactylic"), pattern: FOOT_PATTERNS.dactylic.join(" ") },
  ];

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
          placeholder={t("searchPlaceholder")}
          className="min-h-11 w-full rounded-full border border-[var(--glass-border)] bg-[var(--surface-raised)]/70 py-3 pl-11 pr-5 text-sm text-[var(--text)] shadow-sm placeholder:text-[var(--muted-light)] transition-all duration-300 focus:shadow-md focus:outline-none md:min-h-0"
        />
      </div>

      {!fullSearch && (
        <p className="text-[10px] leading-relaxed text-[var(--muted)]" data-testid="synonyms-only-note">
          {t("synonymsOnlyNote")}
        </p>
      )}

      {fullSearch && (
        <div>
          <p className="mb-2.5 text-[10px] tracking-[0.2em] text-[var(--muted-light)] uppercase">
            {t("syllables")}
          </p>
          <div className="flex flex-wrap gap-2">
            {SYLLABLE_OPTIONS.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => toggleSyllableFilter(n)}
                className={`zen-pill min-h-11 rounded-full px-4 py-1.5 font-mono text-xs transition-all duration-300 ease-in-out md:min-h-0 ${
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
      )}

      {fullSearch && (
        <div>
          <p className="mb-2.5 flex items-center gap-1.5 text-[10px] tracking-[0.2em] text-[var(--muted-light)] uppercase">
            <Music2 className="h-3 w-3" strokeWidth={1.5} />
            {t("metricFeet")}
          </p>
          <div className="flex flex-wrap gap-2">
            {footLabels.map(({ id, label, pattern }) => (
              <button
                key={id}
                type="button"
                onClick={() => onFootPresetChange(id)}
                className={`zen-pill min-h-11 rounded-2xl px-3.5 py-2 text-left transition-all duration-300 ease-in-out md:min-h-0 ${
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
      )}

      {showTone && <ToneVibeSelector tone={tone} onToneChange={setTone} t={t} />}

      {emojiSuggestions.length > 0 && (
        <div data-testid="emoji-suggestions">
          <p className="mb-2.5 text-[10px] tracking-[0.2em] text-[var(--muted-light)] uppercase">
            {t("emojis")}
          </p>
          <div className="flex flex-wrap gap-2">
            {emojiSuggestions.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => copyWord(emoji)}
                className="zen-pill flex min-h-11 min-w-11 items-center justify-center rounded-full bg-[var(--surface-raised)]/60 text-lg hover:shadow-md md:min-h-0 md:min-w-0 md:px-3 md:py-1.5"
                title={copiedWord === emoji ? "Copied" : "Copy"}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}

      {isMock && query.trim() && (
        <p className="text-[10px] tracking-[0.15em] text-[var(--muted-light)] uppercase">
          {t("offlineSuggestions")}
        </p>
      )}

      <div className="min-h-0 flex-1 overflow-y-auto">
        <WordGrid
          words={results}
          loading={loading}
          query={query}
          copiedWord={copiedWord}
          onCopy={copyWord}
          emptyLabel={t("enterWord")}
          noMatchLabel={t("noMatches")}
        />
      </div>
    </div>
  );
}
