"use client";

import type { GrammarMatch } from "@/lib/grammarCheck";
import { editorTextStyles } from "./editorStyles";

interface GrammarBackdropProps {
  text: string;
  matches: GrammarMatch[];
}

function categoryClass(category: GrammarMatch["category"]): string {
  if (category === "spelling") {
    return "decoration-wavy decoration-red-400/80 underline decoration-2 underline-offset-[5px]";
  }
  if (category === "grammar") {
    return "decoration-wavy decoration-amber-500/80 underline decoration-2 underline-offset-[5px]";
  }
  return "decoration-wavy decoration-sky-400/70 underline decoration-2 underline-offset-[5px]";
}

/**
 * Visual-only overlay. Clicks are handled by PoetryEditor via caret hit-testing
 * because the textarea must stay on top for typing.
 */
export function GrammarBackdrop({ text, matches }: GrammarBackdropProps) {
  if (!text || matches.length === 0) {
    return (
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden whitespace-pre-wrap break-words font-[family-name:var(--font-editor)] text-transparent"
        style={editorTextStyles}
        aria-hidden
      >
        {text || "\u00a0"}
      </div>
    );
  }

  const sorted = [...matches].sort((a, b) => a.offset - b.offset);
  const segments: { text: string; match?: GrammarMatch }[] = [];
  let cursor = 0;

  for (const match of sorted) {
    const start = Math.max(0, Math.min(text.length, match.offset));
    const end = Math.max(start, Math.min(text.length, match.offset + match.length));
    if (start < cursor) continue;
    if (start > cursor) {
      segments.push({ text: text.slice(cursor, start) });
    }
    segments.push({ text: text.slice(start, end), match });
    cursor = end;
  }
  if (cursor < text.length) {
    segments.push({ text: text.slice(cursor) });
  }

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden whitespace-pre-wrap break-words font-[family-name:var(--font-editor)]"
      style={editorTextStyles}
      aria-hidden
    >
      {segments.map((segment, index) => {
        if (!segment.match) {
          return (
            <span key={index} className="text-transparent">
              {segment.text}
            </span>
          );
        }

        return (
          <span
            key={index}
            data-grammar-match={segment.match.category}
            className={`text-transparent ${categoryClass(segment.match.category)}`}
            title={segment.match.shortMessage}
          >
            {segment.text}
          </span>
        );
      })}
    </div>
  );
}
