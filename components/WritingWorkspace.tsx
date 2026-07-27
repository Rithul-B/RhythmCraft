"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { PoetryEditor } from "@/components/PoetryEditor";
import { EditorHeader } from "@/components/EditorHeader";
import { SlideDrawer } from "@/components/SlideDrawer";
import { NotebookPanel } from "@/components/NotebookPanel";
import { InspectorDrawer } from "@/components/InspectorDrawer";
import { CommandPalette } from "@/components/CommandPalette";
import { SelectionPopover } from "@/components/SelectionPopover";
import { BottomToolbar } from "@/components/BottomToolbar";
import { useLineAnalysis } from "@/hooks/useLineAnalysis";
import { useWorkspaceStore } from "@/hooks/useWorkspaceStore";
import { useWorkspaceUI } from "@/hooks/useWorkspaceUI";
import { useTheme } from "@/hooks/useTheme";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { getSelectedWord, getSelectionAnchor } from "@/lib/selection";
import type { FootPreset } from "@/lib/stress";

export function WritingWorkspace() {
  const [footPreset, setFootPreset] = useState<FootPreset>("any");
  const [showAllMeterBreaks, setShowAllMeterBreaks] = useState(false);
  const [toolbarVisible, setToolbarVisible] = useState(true);
  // Held in state, not a ref: the popover anchor is derived during render and must
  // recompute once the textarea actually mounts.
  const [textareaEl, setTextareaEl] = useState<HTMLTextAreaElement | null>(null);
  const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { theme, setTheme } = useTheme();
  const ui = useWorkspaceUI();
  const {
    hydrated,
    notebooks,
    activePoem,
    activeNotebookId,
    updatePoemText,
    updatePoemTitle,
    selectPoem,
    createNotebook,
    createPoem,
    deletePoem,
  } = useWorkspaceStore();

  const text = activePoem?.text ?? "";
  const poemTitle = activePoem?.title ?? "Untitled";
  const selectionStart = ui.selectionRange.start;

  const analysis = useLineAnalysis(text, selectionStart, footPreset);

  const selectedWord = useMemo(
    () =>
      getSelectedWord(text, ui.selectionRange.start, ui.selectionRange.end),
    [text, ui.selectionRange]
  );

  const selectionAnchor = useMemo(() => {
    if (!selectedWord || !textareaEl) return null;
    return getSelectionAnchor(textareaEl, ui.selectionRange.end);
  }, [selectedWord, textareaEl, ui.selectionRange.end]);

  const handleTyping = useCallback(() => {
    ui.setIsTyping(true);
    setToolbarVisible(false);
    if (typingTimer.current) clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => {
      ui.setIsTyping(false);
      setToolbarVisible(true);
    }, 2000);
  }, [ui]);

  const handleBlur = useCallback(() => {
    ui.setIsTyping(false);
    setToolbarVisible(true);
  }, [ui]);

  useKeyboardShortcuts(
    {
      onCommandPalette: () => ui.openCommandPalette(),
      onToggleNotebook: ui.toggleNotebook,
      onToggleInspector: ui.toggleInspector,
      onEscape: ui.closeAllOverlays,
    },
    hydrated
  );

  if (!hydrated) {
    return (
      <div className="flex h-screen items-center justify-center bg-[var(--bg)] text-[var(--muted)]">
        Loading...
      </div>
    );
  }

  return (
    <div className="relative flex h-screen flex-col overflow-hidden">
      <EditorHeader
        poemTitle={poemTitle}
        onTitleChange={updatePoemTitle}
        lineCount={analysis.stanzaLineCount}
        onToggleNotebook={ui.toggleNotebook}
        onToggleInspector={ui.toggleInspector}
        theme={theme}
        onThemeChange={setTheme}
        text={text}
        rhymeScheme={analysis.rhymeScheme}
      />

      <main className="flex min-h-0 flex-1 justify-center overflow-y-auto px-4 py-6 md:px-8 md:py-10">
        <PoetryEditor
          text={text}
          onTextChange={updatePoemText}
          onSelectionChange={ui.setSelectionRange}
          onTextareaRef={setTextareaEl}
          analysis={analysis}
          onTyping={handleTyping}
          onBlur={handleBlur}
        />
      </main>

      <SlideDrawer
        side="left"
        open={ui.notebookOpen}
        onClose={() => ui.setNotebookOpen(false)}
        label="Notebooks"
      >
        <NotebookPanel
          notebooks={notebooks}
          activeNotebookId={activeNotebookId}
          activePoemId={activePoem?.id ?? null}
          onSelectPoem={(nbId, poemId) => {
            selectPoem(nbId, poemId);
            ui.setNotebookOpen(false);
          }}
          onCreateNotebook={createNotebook}
          onCreatePoem={createPoem}
          onDeletePoem={deletePoem}
          onClose={() => ui.setNotebookOpen(false)}
        />
      </SlideDrawer>

      <SlideDrawer
        side="right"
        open={ui.inspectorOpen}
        onClose={() => ui.setInspectorOpen(false)}
        width="360px"
        label="Inspector"
      >
        <InspectorDrawer
          analysis={analysis}
          text={text}
          footPreset={footPreset}
          onFootPresetChange={setFootPreset}
          showAllMeterBreaks={showAllMeterBreaks}
          onShowAllMeterBreaksChange={setShowAllMeterBreaks}
          onClose={() => ui.setInspectorOpen(false)}
        />
      </SlideDrawer>

      <CommandPalette
        open={ui.commandOpen}
        initialQuery={ui.commandInitialQuery}
        footPreset={footPreset}
        onFootPresetChange={setFootPreset}
        onClose={ui.closeCommandPalette}
      />

      <SelectionPopover
        word={selectedWord}
        anchor={selectionAnchor}
        onSearchMore={(w) => ui.openCommandPalette(w)}
        onClose={() =>
          ui.setSelectionRange({ start: selectionStart, end: selectionStart })
        }
      />

      <BottomToolbar
        visible={toolbarVisible && !ui.anyOverlayOpen && !selectedWord}
        onOpenCommand={() => ui.openCommandPalette()}
        onOpenInspector={ui.toggleInspector}
      />
    </div>
  );
}
