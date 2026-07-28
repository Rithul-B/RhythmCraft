"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { RhythmRhymeFinder } from "./RhythmRhymeFinder";
import type { FootPreset } from "@/lib/stress";
import type { AppLanguage } from "@/lib/i18n/languages";
import type { TranslationKey } from "@/lib/i18n/translations";

interface CommandPaletteProps {
  open: boolean;
  initialQuery?: string;
  footPreset: FootPreset;
  onFootPresetChange: (preset: FootPreset) => void;
  onClose: () => void;
  language: AppLanguage;
  t: (key: TranslationKey) => string;
}

export function CommandPalette({
  open,
  initialQuery = "",
  footPreset,
  onFootPresetChange,
  onClose,
  language,
  t,
}: CommandPaletteProps) {
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[8vh] md:pt-[12vh]">
      <div
        className="absolute inset-0 bg-black/25 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className="relative z-10 flex max-h-[85vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-bg)] font-[family-name:var(--font-ui)] shadow-2xl backdrop-blur-xl md:max-h-[75vh]"
        style={{ boxShadow: "var(--drawer-shadow)" }}
        role="dialog"
        aria-modal
        aria-label={t("searchRhymesSynonyms")}
        data-testid="command-palette"
      >
        <div className="flex items-center justify-between border-b border-[var(--divider)] px-4 py-3">
          <span className="text-xs tracking-wide text-[var(--muted)]">
            {t("searchRhymesSynonyms")}
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label={t("closeSearch")}
            className="flex min-h-11 min-w-11 items-center justify-center rounded-full p-1.5 text-[var(--muted)] hover:bg-[var(--surface-raised)]/60 md:min-h-0 md:min-w-0"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          <RhythmRhymeFinder
            footPreset={footPreset}
            onFootPresetChange={onFootPresetChange}
            initialQuery={initialQuery}
            autoFocus
            language={language}
            t={t}
          />
        </div>
      </div>
    </div>
  );
}
