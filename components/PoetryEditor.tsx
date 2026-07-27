"use client";

import { useCallback, useRef } from "react";
import { MeterBackdrop } from "./MeterBackdrop";
import { editorTextStyles } from "./editorStyles";
import type { LineAnalysisResult } from "@/hooks/useLineAnalysis";
import type { SelectionRange } from "@/lib/selection";

interface PoetryEditorProps {
  text: string;
  onTextChange: (text: string) => void;
  onSelectionChange: (range: SelectionRange) => void;
  onTextareaRef?: (el: HTMLTextAreaElement | null) => void;
  analysis: LineAnalysisResult;
  onTyping?: () => void;
  onBlur?: () => void;
}

export function PoetryEditor({
  text,
  onTextChange,
  onSelectionChange,
  onTextareaRef,
  analysis,
  onTyping,
  onBlur,
}: PoetryEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { activeLineIndex, lines, meterDiagnostics } = analysis;

  const updateSelection = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    onSelectionChange({ start: el.selectionStart, end: el.selectionEnd });
  }, [onSelectionChange]);

  const setRef = useCallback(
    (el: HTMLTextAreaElement | null) => {
      (textareaRef as React.MutableRefObject<HTMLTextAreaElement | null>).current = el;
      onTextareaRef?.(el);
    },
    [onTextareaRef]
  );

  return (
    <div className="relative mx-auto w-full max-w-2xl">
      <div className="relative min-h-[60vh]">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <MeterBackdrop
            lines={lines}
            meterDiagnostics={meterDiagnostics}
            activeLineIndex={activeLineIndex}
            showAllBreaks={false}
          />
        </div>
        <textarea
          ref={setRef}
          value={text}
          onChange={(e) => {
            onTextChange(e.target.value);
            onSelectionChange({
              start: e.target.selectionStart,
              end: e.target.selectionEnd,
            });
            onTyping?.();
          }}
          onSelect={updateSelection}
          onKeyUp={updateSelection}
          onMouseUp={updateSelection}
          onBlur={onBlur}
          placeholder="Begin writing your verse..."
          spellCheck={false}
          data-testid="poetry-editor"
          className="relative z-10 min-h-[60vh] w-full resize-none border-0 bg-transparent font-[family-name:var(--font-editor)] text-[var(--text)] caret-[var(--accent)] placeholder:text-[var(--muted-light)] focus:outline-none focus:ring-0"
          style={editorTextStyles}
        />
      </div>
    </div>
  );
}
