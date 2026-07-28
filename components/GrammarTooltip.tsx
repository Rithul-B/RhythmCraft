"use client";

import type { GrammarMatch } from "@/lib/grammarCheck";

interface GrammarTooltipProps {
  match: GrammarMatch | null;
  anchor: { top: number; left: number } | null;
  replaceLabel: string;
  onReplace: (replacement: string) => void;
  onClose: () => void;
}

export function GrammarTooltip({
  match,
  anchor,
  replaceLabel,
  onReplace,
  onClose,
}: GrammarTooltipProps) {
  if (!match || !anchor) return null;

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div
        className="fixed z-50 min-w-[220px] max-w-[300px] rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-bg)] p-3 font-[family-name:var(--font-ui)] shadow-xl backdrop-blur-xl"
        style={{
          top: anchor.top + 8,
          left: Math.max(16, Math.min(anchor.left, window.innerWidth - 316)),
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
                className="zen-pill min-h-11 rounded-full bg-[var(--surface-raised)]/70 px-3 py-1.5 text-xs text-[var(--text)] hover:shadow-md md:min-h-0"
              >
                {replaceLabel}: {replacement}
              </button>
            ))}
          </div>
        ) : (
          <p className="text-[10px] text-[var(--muted)]">No suggestions</p>
        )}
      </div>
    </>
  );
}
