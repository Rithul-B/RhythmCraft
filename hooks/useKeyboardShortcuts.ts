"use client";

import { useEffect } from "react";

interface KeyboardShortcutHandlers {
  onCommandPalette: () => void;
  onToggleNotebook: () => void;
  onToggleInspector: () => void;
  onEscape: () => void;
}

export function useKeyboardShortcuts(handlers: KeyboardShortcutHandlers, enabled = true) {
  useEffect(() => {
    if (!enabled) return;

    function handleKeyDown(e: KeyboardEvent) {
      const mod = e.metaKey || e.ctrlKey;

      if (e.key === "Escape") {
        handlers.onEscape();
        return;
      }

      if (!mod) return;

      if (e.key === "k" || e.key === "K") {
        e.preventDefault();
        handlers.onCommandPalette();
      } else if (e.key === "\\") {
        e.preventDefault();
        handlers.onToggleNotebook();
      } else if (e.key === "i" || e.key === "I") {
        e.preventDefault();
        handlers.onToggleInspector();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlers, enabled]);
}
