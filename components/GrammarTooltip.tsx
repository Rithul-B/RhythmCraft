"use client";

import type { GrammarMatch } from "@/lib/grammarCheck";
import { clampPopoverPosition } from "@/lib/popoverPosition";

interface GrammarTooltipProps {
  match: GrammarMatch | null;
  anchor: { top: number; left: number } | null;
  replaceLabel: string;
  noSuggestionsLabel?: string;
  onReplace: (replacement: string) => void;
  onClose: () => void;
}

export function GrammarTooltip({
  match,
  anchor,
  replaceLabel,
  noSuggestionsLabel = "No suggestions",
  onReplace,
  onClose,
}: GrammarTooltipProps) {
  if (!match || !anchor) return null;

  const pos = clampPopoverPosition(anchor, 300, 160);

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div
        className="fixed z-50 min-w-[220px] max-w-[300px] rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-bg)] p-3 font-[family-name:var(--font-ui)] shadow-xl backdrop-blur-xl"
        style={{
          top: pos.top,
          left: pos.left,
          boxShadow: "var(--drawer-shadow)",
        }}
        data-testid="grammar-tooltip"
      >
        <p className="mb-2 text-xs text-[var(--text)]">{match.message}</p>
        {match.replacements.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {match.replacements.slice(0, 3).map((replacement) => (
              <button
                key={replacement}
                type="button"
                onClick={() => onReplace(replacement)}
                className="zen-pill min-h-11 rounded-full bg-[var(--surface-raised)]/70 px-3 py-1.5 text-xs text-[var(--text)] hover:shadow-md"
              >
                {replaceLabel}: {replacement}
              </button>
            ))}
          </div>
        ) : (
          <p className="text-[10px] text-[var(--muted)]">{noSuggestionsLabel}</p>
        )}
      </div>
    </>
  );
}
