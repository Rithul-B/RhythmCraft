"use client";

import { useCallback, useState } from "react";
import type { SelectionRange } from "@/lib/selection";

export function useWorkspaceUI() {
  const [notebookOpen, setNotebookOpen] = useState(false);
  const [inspectorOpen, setInspectorOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [commandInitialQuery, setCommandInitialQuery] = useState("");
  const [selectionRange, setSelectionRange] = useState<SelectionRange>({ start: 0, end: 0 });
  const [isTyping, setIsTyping] = useState(false);

  const toggleNotebook = useCallback(() => {
    setNotebookOpen((v) => !v);
    setInspectorOpen(false);
    setCommandOpen(false);
  }, []);

  const toggleInspector = useCallback(() => {
    setInspectorOpen((v) => !v);
    setNotebookOpen(false);
    setCommandOpen(false);
  }, []);

  const openCommandPalette = useCallback((query = "") => {
    setCommandInitialQuery(query);
    setCommandOpen(true);
    setNotebookOpen(false);
    setInspectorOpen(false);
  }, []);

  const closeCommandPalette = useCallback(() => {
    setCommandOpen(false);
    setCommandInitialQuery("");
  }, []);

  const closeAllOverlays = useCallback(() => {
    setNotebookOpen(false);
    setInspectorOpen(false);
    setCommandOpen(false);
    setCommandInitialQuery("");
  }, []);

  const anyOverlayOpen = notebookOpen || inspectorOpen || commandOpen;

  return {
    notebookOpen,
    inspectorOpen,
    commandOpen,
    commandInitialQuery,
    selectionRange,
    setSelectionRange,
    isTyping,
    setIsTyping,
    toggleNotebook,
    toggleInspector,
    openCommandPalette,
    closeCommandPalette,
    closeAllOverlays,
    anyOverlayOpen,
    setNotebookOpen,
    setInspectorOpen,
  };
}
