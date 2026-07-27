"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { RhythmRhymeFinder } from "./RhythmRhymeFinder";
import type { FootPreset } from "@/lib/stress";

interface CommandPaletteProps {
  open: boolean;
  initialQuery?: string;
  footPreset: FootPreset;
  onFootPresetChange: (preset: FootPreset) => void;
  onClose: () => void;
}

export function CommandPalette({
  open,
  initialQuery = "",
  footPreset,
  onFootPresetChange,
  onClose,
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
    <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[12vh]">
      <div
        className="absolute inset-0 bg-black/25 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className="relative z-10 flex max-h-[75vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-bg)] font-[family-name:var(--font-ui)] shadow-2xl backdrop-blur-xl"
        style={{ boxShadow: "var(--drawer-shadow)" }}
        data-testid="command-palette"
      >
        <div className="flex items-center justify-between border-b border-[var(--divider)] px-4 py-3">
          <span className="text-xs tracking-wide text-[var(--muted)]">
            Search rhymes & synonyms
          </span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-[var(--muted)] hover:bg-[var(--surface-raised)]/60"
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
          />
        </div>
      </div>
    </div>
  );
}
