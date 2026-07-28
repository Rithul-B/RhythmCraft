"use client";

import { Search, PanelRight, SpellCheck } from "lucide-react";
import { useStableViewport } from "@/hooks/useStableViewport";

interface BottomToolbarProps {
  visible: boolean;
  onOpenCommand: () => void;
  onOpenInspector: () => void;
  onToggleGrammar: () => void;
  grammarCheckEnabled: boolean;
  grammarIssueCount?: number;
  grammarLoading?: boolean;
  searchLabel?: string;
  grammarLabel?: string;
  inspectorLabel?: string;
}

export function BottomToolbar({
  visible,
  onOpenCommand,
  onOpenInspector,
  onToggleGrammar,
  grammarCheckEnabled,
  grammarIssueCount = 0,
  grammarLoading = false,
  searchLabel = "Search",
  grammarLabel = "Spelling & grammar",
  inspectorLabel = "Analysis",
}: BottomToolbarProps) {
  const { bottomInset } = useStableViewport();

  return (
    <div
      className={`fixed left-1/2 z-20 flex max-w-[calc(100vw-1.5rem)] -translate-x-1/2 items-center gap-1 rounded-full border border-[var(--glass-border)] bg-[var(--surface-raised)] px-2 py-1.5 font-[family-name:var(--font-ui)] shadow-lg transition-opacity duration-200 ${
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
      style={{
        boxShadow: "var(--shadow-soft)",
        // Track Android Chrome URL bar / keyboard via visualViewport.
        bottom: `calc(1rem + env(safe-area-inset-bottom, 0px) + ${bottomInset}px)`,
      }}
    >
      <button
        type="button"
        onClick={onOpenCommand}
        className="zen-pill flex min-h-11 items-center gap-2 rounded-full px-3 py-1.5 text-xs text-[var(--muted)] hover:text-[var(--text)]"
      >
        <Search className="h-3.5 w-3.5" strokeWidth={1.5} />
        <span className="hidden xl:inline">{searchLabel}</span>
      </button>
      <div className="mx-1 h-4 w-px bg-[var(--divider)]" />
      <button
        type="button"
        onClick={onToggleGrammar}
        aria-pressed={grammarCheckEnabled}
        title={grammarLabel}
        data-testid="grammar-toolbar-toggle"
        className={`zen-pill flex min-h-11 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs ${
          grammarCheckEnabled
            ? "bg-[var(--text)] text-[var(--bg)]"
            : "text-[var(--muted)] hover:text-[var(--text)]"
        }`}
      >
        <SpellCheck className="h-3.5 w-3.5" strokeWidth={1.5} />
        <span className="hidden xl:inline">{grammarLabel}</span>
        {grammarCheckEnabled && grammarLoading && (
          <span className="font-mono text-[10px] opacity-70">…</span>
        )}
        {grammarCheckEnabled && !grammarLoading && grammarIssueCount > 0 && (
          <span className="rounded-full bg-[var(--bg)]/20 px-1.5 font-mono text-[10px]">
            {grammarIssueCount}
          </span>
        )}
      </button>
      <div className="mx-1 h-4 w-px bg-[var(--divider)]" />
      <button
        type="button"
        onClick={onOpenInspector}
        className="zen-pill flex min-h-11 items-center gap-2 rounded-full px-3 py-1.5 text-xs text-[var(--muted)] hover:text-[var(--text)]"
        title={inspectorLabel}
      >
        <PanelRight className="h-3.5 w-3.5" strokeWidth={1.5} />
      </button>
    </div>
  );
}
