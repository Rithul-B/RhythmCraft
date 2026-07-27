"use client";

import { FolderOpen, PanelRight } from "lucide-react";
import { ExportMenu } from "./ExportMenu";
import { ThemeSwitcher } from "./ThemeSwitcher";
import type { ThemeId } from "@/hooks/useTheme";
import type { RhymeSchemeResult } from "@/lib/rhymeScheme";

interface EditorHeaderProps {
  poemTitle: string;
  onTitleChange: (title: string) => void;
  lineCount: number;
  onToggleNotebook: () => void;
  onToggleInspector: () => void;
  theme: ThemeId;
  onThemeChange: (theme: ThemeId) => void;
  text: string;
  rhymeScheme: RhymeSchemeResult;
}

export function EditorHeader({
  poemTitle,
  onTitleChange,
  lineCount,
  onToggleNotebook,
  onToggleInspector,
  theme,
  onThemeChange,
  text,
  rhymeScheme,
}: EditorHeaderProps) {
  return (
    <header className="relative grid h-12 shrink-0 grid-cols-[1fr_auto_1fr] items-center px-4 md:px-6">
      <div className="flex min-w-0 items-center gap-3 justify-self-start">
        <button
          type="button"
          onClick={onToggleNotebook}
          className="rounded-full p-2 text-[var(--muted)] transition-all duration-300 ease-in-out hover:bg-[var(--surface-raised)]/60 hover:text-[var(--text)]"
          title="Notebooks (⌘\)"
        >
          <FolderOpen className="h-4 w-4" strokeWidth={1.5} />
        </button>
        <input
          type="text"
          value={poemTitle}
          onChange={(e) => onTitleChange(e.target.value)}
          className="min-w-0 max-w-[140px] truncate bg-transparent font-[family-name:var(--font-ui)] text-sm text-[var(--muted)] placeholder:text-[var(--muted-light)] focus:text-[var(--text)] focus:outline-none md:max-w-[200px]"
          placeholder="Untitled"
        />
      </div>

      <h1 className="pointer-events-none justify-self-center font-[family-name:var(--font-editor)] text-sm font-bold tracking-[0.15em] text-[var(--text)] uppercase">
        RhythmCraft
      </h1>

      <div className="flex items-center gap-1 justify-self-end">
        <span className="mr-2 hidden font-mono text-[10px] text-[var(--muted-light)] sm:inline">
          {lineCount} {lineCount === 1 ? "line" : "lines"}
        </span>
        <button
          type="button"
          onClick={onToggleInspector}
          className="rounded-full p-2 text-[var(--muted)] transition-all duration-300 ease-in-out hover:bg-[var(--surface-raised)]/60 hover:text-[var(--text)]"
          title="Inspector (⌘I)"
        >
          <PanelRight className="h-4 w-4" strokeWidth={1.5} />
        </button>
        <ExportMenu text={text} title={poemTitle} rhymeScheme={rhymeScheme} />
        <ThemeSwitcher theme={theme} onThemeChange={onThemeChange} />
      </div>
    </header>
  );
}
