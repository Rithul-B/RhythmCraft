"use client";

import { Check, Copy } from "lucide-react";
import type { WordResult } from "@/lib/datamuse";

interface WordGridProps {
  words: WordResult[];
  loading: boolean;
  query: string;
  copiedWord: string | null;
  onCopy: (word: string) => void;
  emptyLabel?: string;
  noMatchLabel?: string;
}

export function WordGrid({
  words,
  loading,
  query,
  copiedWord,
  onCopy,
  emptyLabel = "Enter a word to find rhymes and synonyms.",
  noMatchLabel = "No words match your filters.",
}: WordGridProps) {
  if (!query.trim()) {
    return (
      <p className="py-8 text-center text-sm text-[var(--muted)]">{emptyLabel}</p>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-[var(--muted-light)] border-t-[var(--accent)]" />
      </div>
    );
  }

  if (words.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-[var(--muted)]">{noMatchLabel}</p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {words.map((item) => {
        const isCopied = copiedWord === item.word;
        return (
          <button
            key={item.word}
            type="button"
            onClick={() => onCopy(item.word)}
            className="zen-pill group flex min-h-11 items-center justify-between gap-2 rounded-2xl bg-[var(--surface-raised)]/60 px-3.5 py-2.5 text-left shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:bg-[var(--surface-raised)] hover:shadow-md md:min-h-0"
          >
            <span className="truncate text-sm text-[var(--text)]">{item.word}</span>
            <span className="flex shrink-0 items-center gap-1.5">
              <span className="font-mono text-[10px] text-[var(--muted-light)]">
                {item.numSyllables}syl
              </span>
              {isCopied ? (
                <Check className="h-3 w-3 text-[var(--accent)]" />
              ) : (
                <Copy className="h-3 w-3 text-[var(--muted-light)] opacity-0 transition-opacity group-hover:opacity-100" />
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}
