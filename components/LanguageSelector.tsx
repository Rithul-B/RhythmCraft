"use client";

import { useEffect, useRef, useState } from "react";
import { Languages } from "lucide-react";
import { APP_LANGUAGES, type AppLanguage } from "@/lib/i18n/languages";

interface LanguageSelectorProps {
  language: AppLanguage;
  onLanguageChange: (language: AppLanguage) => void;
  label: string;
}

export function LanguageSelector({
  language,
  onLanguageChange,
  label,
}: LanguageSelectorProps) {
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

  const current = APP_LANGUAGES.find((l) => l.id === language) ?? APP_LANGUAGES[0];

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex min-h-11 min-w-11 items-center justify-center rounded-full p-2 text-[var(--muted)] transition-all duration-300 hover:bg-[var(--surface-raised)]/60 hover:text-[var(--text)] md:min-h-0 md:min-w-0"
        title={label}
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={open}
        data-testid="language-selector"
      >
        <Languages className="h-4 w-4" strokeWidth={1.5} />
      </button>

      {open && (
        <div
          className="absolute right-0 top-full z-50 mt-1 min-w-[180px] rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-bg)] p-2 backdrop-blur-xl"
          style={{ boxShadow: "var(--shadow-soft)" }}
          role="listbox"
          aria-label={label}
        >
          {APP_LANGUAGES.map((l) => (
            <button
              key={l.id}
              type="button"
              role="option"
              aria-selected={language === l.id}
              onClick={() => {
                onLanguageChange(l.id);
                setOpen(false);
              }}
              className={`zen-pill flex min-h-11 w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs transition-all duration-300 md:min-h-0 ${
                language === l.id
                  ? "zen-pill-active bg-[var(--text)] text-[var(--bg)] ring-2 ring-[var(--glow-active)]"
                  : "text-[var(--muted)] hover:bg-[var(--surface)]"
              }`}
            >
              <span className="font-medium">{l.nativeLabel}</span>
              <span className="text-[10px] opacity-70">{l.label}</span>
            </button>
          ))}
          <p className="mt-1 px-3 py-1 text-[10px] text-[var(--muted-light)]">
            {current.nativeLabel}
          </p>
        </div>
      )}
    </div>
  );
}
