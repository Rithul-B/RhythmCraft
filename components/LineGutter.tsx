"use client";

import { useEffect, useRef } from "react";
import { editorTextStyles } from "./editorStyles";

interface LineGutterProps {
  syllableCounts: number[];
  activeLineIndex: number;
  scrollTop: number;
  onScroll: (scrollTop: number) => void;
}

export function LineGutter({
  syllableCounts,
  activeLineIndex,
  scrollTop,
  onScroll,
}: LineGutterProps) {
  const gutterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (gutterRef.current && gutterRef.current.scrollTop !== scrollTop) {
      gutterRef.current.scrollTop = scrollTop;
    }
  }, [scrollTop]);

  return (
    <div
      ref={gutterRef}
      onScroll={(e) => onScroll(e.currentTarget.scrollTop)}
      className="w-14 shrink-0 overflow-y-auto overflow-x-hidden select-none text-right [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      aria-hidden
    >
      <div style={editorTextStyles} className="pr-3 pl-2">
        {syllableCounts.map((count, i) => (
          <div
            key={i}
            className={`font-mono text-xs tabular-nums transition-colors duration-200 ${
              i === activeLineIndex ? "text-[var(--accent)]" : "text-[var(--muted-light)]"
            }`}
          >
            {count > 0 || syllableCounts.length > 1 ? count : ""}
          </div>
        ))}
      </div>
    </div>
  );
}
