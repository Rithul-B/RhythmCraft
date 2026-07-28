"use client";

import { FileText, Plus, Trash2, X } from "lucide-react";
import type { Notebook } from "@/lib/workspaceTypes";
import type { TranslationKey } from "@/lib/i18n/translations";

interface NotebookPanelProps {
  notebooks: Notebook[];
  activeNotebookId: string | null;
  activePoemId: string | null;
  onSelectPoem: (notebookId: string, poemId: string) => void;
  onCreateNotebook: () => void;
  onCreatePoem: () => void;
  onDeletePoem: (poemId: string) => void;
  onClose: () => void;
  t: (key: TranslationKey) => string;
}

export function NotebookPanel({
  notebooks,
  activeNotebookId,
  activePoemId,
  onSelectPoem,
  onCreateNotebook,
  onCreatePoem,
  onDeletePoem,
  onClose,
  t,
}: NotebookPanelProps) {
  const activeNotebook = notebooks.find((n) => n.id === activeNotebookId);

  return (
    <div className="flex h-full flex-col font-[family-name:var(--font-ui)]" data-testid="notebook-drawer">
      <div className="flex items-center justify-between px-4 py-4">
        <span className="text-[10px] tracking-[0.2em] text-[var(--muted-light)] uppercase">
          {t("notebooks")}
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label={t("closeNotebooks")}
          className="flex min-h-11 min-w-11 items-center justify-center rounded-full p-1.5 text-[var(--muted)] transition-all duration-300 hover:bg-[var(--surface-raised)]/60 md:min-h-0 md:min-w-0"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex gap-2 px-4 pb-3">
        <button
          type="button"
          onClick={onCreateNotebook}
          className="zen-pill flex min-h-11 flex-1 items-center justify-center gap-1 rounded-full bg-[var(--surface-raised)]/50 py-2 text-[10px] text-[var(--muted)] hover:text-[var(--text)] md:min-h-0"
        >
          <Plus className="h-3 w-3" />
          {t("notebook")}
        </button>
        <button
          type="button"
          onClick={onCreatePoem}
          className="zen-pill flex min-h-11 flex-1 items-center justify-center gap-1 rounded-full bg-[var(--surface-raised)]/50 py-2 text-[10px] text-[var(--muted)] hover:text-[var(--text)] md:min-h-0"
        >
          <Plus className="h-3 w-3" />
          {t("poem")}
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 pb-4">
        {notebooks.map((nb) => (
          <div key={nb.id} className="mb-4">
            <p className="mb-1.5 px-2 text-[10px] font-medium tracking-wide text-[var(--muted)] uppercase">
              {nb.name === "Drafts" ? t("drafts") : nb.name}
            </p>
            {nb.poems.map((poem) => (
              <button
                key={poem.id}
                type="button"
                onClick={() => onSelectPoem(nb.id, poem.id)}
                className={`zen-pill mb-1 flex min-h-11 w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-xs transition-all duration-300 md:min-h-0 ${
                  poem.id === activePoemId && nb.id === activeNotebookId
                    ? "zen-pill-active bg-[var(--text)] text-[var(--bg)] ring-2 ring-[var(--glow-active)]"
                    : "text-[var(--muted)] hover:bg-[var(--surface-raised)]/60 hover:text-[var(--text)]"
                }`}
              >
                <FileText className="h-3 w-3 shrink-0" strokeWidth={1.5} />
                <span className="truncate">{poem.title || t("untitled")}</span>
              </button>
            ))}
          </div>
        ))}
      </div>

      {activePoemId && activeNotebook && activeNotebook.poems.length > 1 && (
        <div className="border-t border-[var(--divider)] p-4">
          <button
            type="button"
            onClick={() => onDeletePoem(activePoemId)}
            className="flex min-h-11 w-full items-center justify-center gap-1 rounded-full py-2 text-[10px] text-[var(--muted)] hover:bg-[var(--surface-raised)]/60 md:min-h-0"
          >
            <Trash2 className="h-3 w-3" />
            {t("deletePoem")}
          </button>
        </div>
      )}
    </div>
  );
}
