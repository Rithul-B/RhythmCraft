"use client";

import { Search, PanelRight, SpellCheck } from "lucide-react";

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
  return (
    <div
      className={`fixed bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1 rounded-full border border-[var(--glass-border)] bg-[var(--glass-bg)] px-2 py-1.5 font-[family-name:var(--font-ui)] shadow-lg backdrop-blur-xl transition-all duration-300 ease-in-out ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0"
      }`}
      style={{ boxShadow: "var(--shadow-soft)" }}
    >
      <button
        type="button"
        onClick={onOpenCommand}
        className="zen-pill flex min-h-11 items-center gap-2 rounded-full px-3 py-1.5 text-xs text-[var(--muted)] hover:text-[var(--text)] md:min-h-0"
      >
        <Search className="h-3.5 w-3.5" strokeWidth={1.5} />
        <span className="hidden sm:inline">{searchLabel}</span>
        <kbd className="rounded bg-[var(--surface)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--muted-light)]">
          ⌘K
        </kbd>
      </button>
      <div className="mx-1 h-4 w-px bg-[var(--divider)]" />
      <button
        type="button"
        onClick={onToggleGrammar}
        aria-pressed={grammarCheckEnabled}
        title={grammarLabel}
        data-testid="grammar-toolbar-toggle"
        className={`zen-pill flex min-h-11 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs transition-all md:min-h-0 ${
          grammarCheckEnabled
            ? "bg-[var(--text)] text-[var(--bg)]"
            : "text-[var(--muted)] hover:text-[var(--text)]"
        }`}
      >
        <SpellCheck className="h-3.5 w-3.5" strokeWidth={1.5} />
        <span className="hidden sm:inline">{grammarLabel}</span>
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
        className="zen-pill flex min-h-11 items-center gap-2 rounded-full px-3 py-1.5 text-xs text-[var(--muted)] hover:text-[var(--text)] md:min-h-0"
        title={inspectorLabel}
      >
        <PanelRight className="h-3.5 w-3.5" strokeWidth={1.5} />
        <kbd className="rounded bg-[var(--surface)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--muted-light)]">
          ⌘I
        </kbd>
      </button>
    </div>
  );
}
