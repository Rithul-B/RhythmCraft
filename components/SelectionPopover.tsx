"use client";

import { useEffect, useState } from "react";
import { countWordSyllables } from "@/lib/syllables";
import type { WordResult } from "@/lib/datamuse";

interface SelectionPopoverProps {
  word: string | null;
  anchor: { top: number; left: number } | null;
  onSearchMore: (word: string) => void;
  onClose: () => void;
}

export function SelectionPopover({
  word,
  anchor,
  onSearchMore,
  onClose,
}: SelectionPopoverProps) {
  const [results, setResults] = useState<WordResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!word) {
      setResults([]);
      return;
    }

    const controller = new AbortController();
    setLoading(true);

    fetch(`/api/words?q=${encodeURIComponent(word)}&max=10`, {
      signal: controller.signal,
    })
      .then((r) => r.json())
      .then((data: { words: WordResult[] }) => {
        setResults((data.words ?? []).slice(0, 5));
      })
      .catch(() => setResults([]))
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [word]);

  if (!word || !anchor) return null;

  const syllables = countWordSyllables(word);

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div
        className="fixed z-50 min-w-[220px] max-w-[280px] rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-bg)] p-3 font-[family-name:var(--font-ui)] shadow-xl backdrop-blur-xl"
        style={{
          top: anchor.top + 8,
          left: Math.max(16, Math.min(anchor.left, window.innerWidth - 296)),
          boxShadow: "var(--drawer-shadow)",
        }}
        data-testid="selection-popover"
      >
        <div className="mb-2 flex items-baseline justify-between gap-2">
          <span className="font-[family-name:var(--font-editor)] text-sm text-[var(--text)]">
            {word}
          </span>
          <span className="font-mono text-[10px] text-[var(--muted-light)]">
            {syllables}syl
          </span>
        </div>

        {loading ? (
          <div className="py-3 text-center text-xs text-[var(--muted)]">Finding rhymes...</div>
        ) : results.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {results.map((r) => (
              <button
                key={r.word}
                type="button"
                onClick={() => navigator.clipboard.writeText(r.word)}
                className="zen-pill rounded-full bg-[var(--surface-raised)]/70 px-2.5 py-1 text-xs text-[var(--text)] hover:shadow-md"
              >
                {r.word}
              </button>
            ))}
          </div>
        ) : (
          <p className="text-xs text-[var(--muted)]">No quick matches</p>
        )}

        <button
          type="button"
          onClick={() => onSearchMore(word)}
          className="mt-2 w-full text-left text-[10px] text-[var(--accent)] hover:underline"
        >
          Search more →
        </button>
      </div>
    </>
  );
}
