"use client";

import { BookOpen, ChevronLeft, ChevronRight, FileText, Plus, Trash2 } from "lucide-react";
import type { Notebook } from "@/lib/workspaceTypes";

interface NotebookSidebarProps {
  open: boolean;
  onToggle: () => void;
  notebooks: Notebook[];
  activeNotebookId: string | null;
  activePoemId: string | null;
  onSelectPoem: (notebookId: string, poemId: string) => void;
  onCreateNotebook: () => void;
  onCreatePoem: () => void;
  onDeletePoem: (poemId: string) => void;
  onRenamePoem: (title: string) => void;
  poemTitle: string;
}

export function NotebookSidebar({
  open,
  onToggle,
  notebooks,
  activeNotebookId,
  activePoemId,
  onSelectPoem,
  onCreateNotebook,
  onCreatePoem,
  onDeletePoem,
  onRenamePoem,
  poemTitle,
}: NotebookSidebarProps) {
  const activeNotebook = notebooks.find((n) => n.id === activeNotebookId);

  if (!open) {
    return (
      <div className="flex w-12 shrink-0 flex-col items-center border-r border-[var(--divider)] py-4">
        <button
          type="button"
          onClick={onToggle}
          className="rounded-full p-2 text-[var(--muted)] hover:bg-[var(--surface-raised)]/60"
          title="Open notebooks"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
        <BookOpen className="mt-4 h-4 w-4 text-[var(--muted-light)]" strokeWidth={1.5} />
      </div>
    );
  }

  return (
    <div className="flex w-[220px] shrink-0 flex-col border-r border-[var(--divider)] bg-[var(--surface)]/50">
      <div className="flex items-center justify-between px-4 py-3">
        <span className="text-[10px] tracking-[0.2em] text-[var(--muted-light)] uppercase">
          Notebooks
        </span>
        <button
          type="button"
          onClick={onToggle}
          className="rounded-full p-1 text-[var(--muted)] hover:bg-[var(--surface-raised)]/60"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      </div>

      <div className="flex gap-1 px-3 pb-2">
        <button
          type="button"
          onClick={onCreateNotebook}
          className="flex flex-1 items-center justify-center gap-1 rounded-full py-1.5 text-[10px] text-[var(--muted)] hover:bg-[var(--surface-raised)]/60"
        >
          <Plus className="h-3 w-3" />
          Notebook
        </button>
        <button
          type="button"
          onClick={onCreatePoem}
          className="flex flex-1 items-center justify-center gap-1 rounded-full py-1.5 text-[10px] text-[var(--muted)] hover:bg-[var(--surface-raised)]/60"
        >
          <Plus className="h-3 w-3" />
          Poem
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-4">
        {notebooks.map((nb) => (
          <div key={nb.id} className="mb-3">
            <p className="mb-1 px-2 text-[10px] font-medium tracking-wide text-[var(--muted)] uppercase">
              {nb.name}
            </p>
            {nb.poems.map((poem) => (
              <button
                key={poem.id}
                type="button"
                onClick={() => onSelectPoem(nb.id, poem.id)}
                className={`mb-0.5 flex w-full items-center gap-2 rounded-xl px-2 py-2 text-left text-xs transition-colors ${
                  poem.id === activePoemId && nb.id === activeNotebookId
                    ? "bg-[var(--text)] text-[var(--bg)]"
                    : "text-[var(--muted)] hover:bg-[var(--surface-raised)]/60 hover:text-[var(--text)]"
                }`}
              >
                <FileText className="h-3 w-3 shrink-0" strokeWidth={1.5} />
                <span className="truncate">{poem.title || "Untitled"}</span>
              </button>
            ))}
          </div>
        ))}
      </div>

      {activePoemId && activeNotebook && activeNotebook.poems.length > 1 && (
        <div className="border-t border-[var(--divider)] p-3">
          <button
            type="button"
            onClick={() => onDeletePoem(activePoemId)}
            className="flex w-full items-center justify-center gap-1 rounded-full py-1.5 text-[10px] text-[var(--muted)] hover:bg-[var(--surface-raised)]/60"
          >
            <Trash2 className="h-3 w-3" />
            Delete poem
          </button>
        </div>
      )}

      {activePoemId && (
        <div className="border-t border-[var(--divider)] p-3">
          <input
            type="text"
            value={poemTitle}
            onChange={(e) => onRenamePoem(e.target.value)}
            placeholder="Poem title"
            className="w-full rounded-xl bg-[var(--surface-raised)]/60 px-3 py-2 text-xs text-[var(--text)] placeholder:text-[var(--muted-light)] focus:outline-none"
          />
        </div>
      )}
    </div>
  );
}
