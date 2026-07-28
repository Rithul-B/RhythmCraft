"use client";

import { useEffect, useState } from "react";
import { countWordSyllables } from "@/lib/syllables";
import { fetchFreeDictionarySynonyms } from "@/lib/freeDictionary";
import { hasFullWordSearch, type AppLanguage } from "@/lib/i18n/languages";
import { clampPopoverPosition } from "@/lib/popoverPosition";
import type { WordResult } from "@/lib/datamuse";

const EMPTY_RESULTS: WordResult[] = [];

interface SelectionPopoverProps {
  word: string | null;
  anchor: { top: number; left: number } | null;
  language: AppLanguage;
  onSearchMore: (word: string) => void;
  onClose: () => void;
  labels?: {
    searchMore?: string;
    noQuickMatches?: string;
    findingRhymes?: string;
    sylSuffix?: string;
  };
}

export function SelectionPopover({
  word,
  anchor,
  language,
  onSearchMore,
  onClose,
  labels = {},
}: SelectionPopoverProps) {
  const [fetched, setFetched] = useState<{ word: string; items: WordResult[] } | null>(null);

  useEffect(() => {
    if (!word) return;

    const controller = new AbortController();

    async function load() {
      try {
        if (!hasFullWordSearch(language)) {
          const synonyms = await fetchFreeDictionarySynonyms(
            word!,
            language as "fr" | "de" | "it",
            controller.signal
          );
          if (!controller.signal.aborted) {
            setFetched({ word: word!, items: synonyms.slice(0, 5) });
          }
          return;
        }

        const res = await fetch(
          `/api/words?q=${encodeURIComponent(word!)}&max=10&lang=${language}`,
          { signal: controller.signal }
        );
        const data = (await res.json()) as { words: WordResult[] };
        if (!controller.signal.aborted) {
          setFetched({ word: word!, items: (data.words ?? []).slice(0, 5) });
        }
      } catch {
        if (!controller.signal.aborted) setFetched({ word: word!, items: [] });
      }
    }

    void load();
    return () => controller.abort();
  }, [word, language]);

  const hasResultsForWord = fetched?.word === word;
  const results = hasResultsForWord ? fetched.items : EMPTY_RESULTS;
  const loading = word !== null && !hasResultsForWord;

  if (!word || !anchor) return null;

  const syllables = countWordSyllables(word);
  const pos = clampPopoverPosition(anchor, 280, 180);

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div
        className="fixed z-50 min-w-[220px] max-w-[280px] rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-bg)] p-3 font-[family-name:var(--font-ui)] shadow-xl backdrop-blur-xl"
        style={{
          top: pos.top,
          left: pos.left,
          boxShadow: "var(--drawer-shadow)",
        }}
        data-testid="selection-popover"
      >
        <div className="mb-2 flex items-baseline justify-between gap-2">
          <span className="font-[family-name:var(--font-editor)] text-sm text-[var(--text)]">
            {word}
          </span>
          <span className="font-mono text-[10px] text-[var(--muted-light)]">
            {syllables}
            {labels.sylSuffix ?? "syl"}
          </span>
        </div>

        {loading ? (
          <div className="py-3 text-center text-xs text-[var(--muted)]">
            {labels.findingRhymes ?? "Finding rhymes..."}
          </div>
        ) : results.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {results.map((r) => (
              <button
                key={r.word}
                type="button"
                onClick={() => navigator.clipboard.writeText(r.word)}
                className="zen-pill min-h-11 rounded-full bg-[var(--surface-raised)]/70 px-2.5 py-1 text-xs text-[var(--text)] hover:shadow-md md:min-h-0"
              >
                {r.word}
              </button>
            ))}
          </div>
        ) : (
          <p className="text-xs text-[var(--muted)]">
            {labels.noQuickMatches ?? "No quick matches"}
          </p>
        )}

        <button
          type="button"
          onClick={() => onSearchMore(word)}
          className="mt-2 w-full text-left text-[10px] text-[var(--accent)] hover:underline"
        >
          {labels.searchMore ?? "Search more →"}
        </button>
      </div>
    </>
  );
}
