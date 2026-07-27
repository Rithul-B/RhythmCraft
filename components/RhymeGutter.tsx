"use client";

import { useEffect, useRef } from "react";
import { editorTextStyles } from "./editorStyles";

interface RhymeGutterProps {
  rhymeLabels: string[];
  activeLineIndex: number;
  scrollTop: number;
  onScroll: (scrollTop: number) => void;
}

export function RhymeGutter({
  rhymeLabels,
  activeLineIndex,
  scrollTop,
  onScroll,
}: RhymeGutterProps) {
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
      className="w-10 shrink-0 overflow-y-auto overflow-x-hidden select-none text-center [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      aria-hidden
    >
      <div style={editorTextStyles} className="px-1">
        {rhymeLabels.map((label, i) => (
          <div
            key={i}
            className={`font-mono text-[10px] transition-colors duration-200 ${
              i === activeLineIndex ? "text-[var(--accent)]" : "text-[var(--muted-light)]"
            }`}
          >
            {label || ""}
          </div>
        ))}
      </div>
    </div>
  );
}
