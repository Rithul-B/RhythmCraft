"use client";

import { useState, useRef, useEffect } from "react";
import { Download } from "lucide-react";
import { downloadTextFile, exportPdf, exportPlainText } from "@/lib/export";
import type { RhymeSchemeResult } from "@/lib/rhymeScheme";

interface ExportMenuProps {
  text: string;
  title: string;
  rhymeScheme: RhymeSchemeResult;
  exportLabel?: string;
}

export function ExportMenu({ text, title, rhymeScheme, exportLabel = "Export" }: ExportMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const options = {
    title,
    includeLineNumbers: true,
    includeRhymeLabels: true,
    rhymeScheme,
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex min-h-11 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs text-[var(--muted)] hover:bg-[var(--surface-raised)]/60 md:min-h-0"
      >
        <Download className="h-3.5 w-3.5" strokeWidth={1.5} />
        {exportLabel}
      </button>

      {open && (
        <div
          className="absolute right-0 top-full z-50 mt-1 min-w-[140px] rounded-2xl bg-[var(--surface-raised)] p-2 shadow-lg"
          style={{ boxShadow: "var(--shadow-soft)" }}
        >
          <button
            type="button"
            onClick={() => {
              const content = exportPlainText(text, options);
              const safeName = (title || "poem").replace(/[^a-z0-9]/gi, "_").toLowerCase();
              downloadTextFile(content, `${safeName}.txt`);
              setOpen(false);
            }}
            className="block w-full rounded-xl px-3 py-2 text-left text-xs text-[var(--muted)] hover:bg-[var(--surface)]"
          >
            Download .txt
          </button>
          <button
            type="button"
            onClick={async () => {
              await exportPdf(text, options);
              setOpen(false);
            }}
            className="block w-full rounded-xl px-3 py-2 text-left text-xs text-[var(--muted)] hover:bg-[var(--surface)]"
          >
            Download .pdf
          </button>
        </div>
      )}
    </div>
  );
}
