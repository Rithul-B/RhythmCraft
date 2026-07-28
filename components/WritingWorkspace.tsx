"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { PoetryEditor } from "@/components/PoetryEditor";
import { EditorHeader } from "@/components/EditorHeader";
import { SlideDrawer } from "@/components/SlideDrawer";
import { NotebookPanel } from "@/components/NotebookPanel";
import { InspectorDrawer } from "@/components/InspectorDrawer";
import { CommandPalette } from "@/components/CommandPalette";
import { SelectionPopover } from "@/components/SelectionPopover";
import { GrammarTooltip } from "@/components/GrammarTooltip";
import { BottomToolbar } from "@/components/BottomToolbar";
import { useLineAnalysis } from "@/hooks/useLineAnalysis";
import { useWorkspaceStore } from "@/hooks/useWorkspaceStore";
import { useWorkspaceUI } from "@/hooks/useWorkspaceUI";
import { useTheme } from "@/hooks/useTheme";
import { useLanguage } from "@/hooks/useLanguage";
import { useGrammarCheck } from "@/hooks/useGrammarCheck";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { getSelectedWord, getSelectionAnchor } from "@/lib/selection";
import type { FootPreset } from "@/lib/stress";
import type { GrammarMatch } from "@/lib/grammarCheck";

export function WritingWorkspace() {
  const [footPreset, setFootPreset] = useState<FootPreset>("any");
  const [showAllMeterBreaks, setShowAllMeterBreaks] = useState(false);
  const [toolbarVisible, setToolbarVisible] = useState(true);
  const [grammarCheckEnabled, setGrammarCheckEnabled] = useState(false);
  const [activeGrammarMatch, setActiveGrammarMatch] = useState<GrammarMatch | null>(null);
  const [grammarAnchor, setGrammarAnchor] = useState<{ top: number; left: number } | null>(null);
  const [textareaEl, setTextareaEl] = useState<HTMLTextAreaElement | null>(null);
  const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
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
  const poemTitle = activePoem?.title ?? t("untitled");
  const selectionStart = ui.selectionRange.start;

  const analysis = useLineAnalysis(text, selectionStart, footPreset);
  const { matches: grammarMatches } = useGrammarCheck(
    text,
    language,
    grammarCheckEnabled
  );

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

  const handleGrammarReplace = useCallback(
    (replacement: string) => {
      if (!activeGrammarMatch) return;
      const { offset, length } = activeGrammarMatch;
      const next = text.slice(0, offset) + replacement + text.slice(offset + length);
      updatePoemText(next);
      setActiveGrammarMatch(null);
      setGrammarAnchor(null);
    },
    [activeGrammarMatch, text, updatePoemText]
  );

  useKeyboardShortcuts(
    {
      onCommandPalette: () => ui.openCommandPalette(),
      onToggleNotebook: ui.toggleNotebook,
      onToggleInspector: ui.toggleInspector,
      onEscape: () => {
        setActiveGrammarMatch(null);
        setGrammarAnchor(null);
        ui.closeAllOverlays();
      },
    },
    hydrated
  );

  if (!hydrated) {
    return (
      <div className="flex h-screen items-center justify-center bg-[var(--bg)] text-[var(--muted)]">
        {t("loading")}
      </div>
    );
  }

  return (
    <div
      className="relative flex h-screen flex-col overflow-hidden"
      style={{
        ["--editor-font-size" as string]: "clamp(1.05rem, 2.5vw, 1.25rem)",
        ["--editor-padding-y" as string]: "clamp(1.5rem, 4vw, 3rem)",
        ["--editor-padding-x" as string]: "clamp(1rem, 3vw, 2rem)",
      }}
    >
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
        language={language}
        onLanguageChange={setLanguage}
        t={t}
      />

      <main className="flex min-h-0 flex-1 justify-center overflow-y-auto px-3 py-4 md:px-8 md:py-10">
        <PoetryEditor
          text={text}
          onTextChange={updatePoemText}
          onSelectionChange={ui.setSelectionRange}
          onTextareaRef={setTextareaEl}
          analysis={analysis}
          onTyping={handleTyping}
          onBlur={handleBlur}
          placeholder={t("beginWriting")}
          grammarMatches={grammarMatches}
          onGrammarMatchSelect={(match, rect) => {
            setActiveGrammarMatch(match);
            setGrammarAnchor({ top: rect.bottom, left: rect.left });
          }}
        />
      </main>

      <SlideDrawer
        side="left"
        open={ui.notebookOpen}
        onClose={() => ui.setNotebookOpen(false)}
        label={t("notebooks")}
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
          t={t}
        />
      </SlideDrawer>

      <SlideDrawer
        side="right"
        open={ui.inspectorOpen}
        onClose={() => ui.setInspectorOpen(false)}
        width="360px"
        label={t("analysis")}
      >
        <InspectorDrawer
          analysis={analysis}
          text={text}
          footPreset={footPreset}
          onFootPresetChange={setFootPreset}
          showAllMeterBreaks={showAllMeterBreaks}
          onShowAllMeterBreaksChange={setShowAllMeterBreaks}
          onClose={() => ui.setInspectorOpen(false)}
          language={language}
          t={t}
          grammarCheckEnabled={grammarCheckEnabled}
          onGrammarCheckEnabledChange={setGrammarCheckEnabled}
        />
      </SlideDrawer>

      <CommandPalette
        open={ui.commandOpen}
        initialQuery={ui.commandInitialQuery}
        footPreset={footPreset}
        onFootPresetChange={setFootPreset}
        onClose={ui.closeCommandPalette}
        language={language}
        t={t}
      />

      <SelectionPopover
        word={selectedWord}
        anchor={selectionAnchor}
        onSearchMore={(w) => ui.openCommandPalette(w)}
        onClose={() =>
          ui.setSelectionRange({ start: selectionStart, end: selectionStart })
        }
        labels={{
          searchMore: t("searchMore"),
          noQuickMatches: t("noQuickMatches"),
          findingRhymes: t("findingRhymes"),
        }}
      />

      <GrammarTooltip
        match={activeGrammarMatch}
        anchor={grammarAnchor}
        replaceLabel={t("grammarReplace")}
        onReplace={handleGrammarReplace}
        onClose={() => {
          setActiveGrammarMatch(null);
          setGrammarAnchor(null);
        }}
      />

      <BottomToolbar
        visible={toolbarVisible && !ui.anyOverlayOpen && !selectedWord && !activeGrammarMatch}
        onOpenCommand={() => ui.openCommandPalette()}
        onOpenInspector={ui.toggleInspector}
        searchLabel={t("search")}
      />
    </div>
  );
}
