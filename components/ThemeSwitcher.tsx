"use client";

import { useState, useRef, useEffect } from "react";
import type { ThemeId } from "@/hooks/useTheme";

interface ThemeSwitcherProps {
  theme: ThemeId;
  onThemeChange: (theme: ThemeId) => void;
  changeThemeLabel?: string;
  parchmentLabel?: string;
  midnightLabel?: string;
}

export function ThemeSwitcher({
  theme,
  onThemeChange,
  changeThemeLabel = "Change theme",
  parchmentLabel = "Cream Parchment",
  midnightLabel = "Obsidian Dark",
}: ThemeSwitcherProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const themes: { id: ThemeId; label: string; swatch: string }[] = [
    { id: "parchment", label: parchmentLabel, swatch: "#F7F5F0" },
    { id: "midnight", label: midnightLabel, swatch: "#121214" },
  ];

  useEffect(() => {
    function handleClick(e: Event) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("pointerdown", handleClick);
    return () => document.removeEventListener("pointerdown", handleClick);
  }, []);

  const current = themes.find((t) => t.id === theme) ?? themes[0];

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex min-h-11 min-w-11 items-center justify-center rounded-full p-2 text-[var(--muted)] transition-all duration-300 hover:bg-[var(--surface-raised)]/60 hover:text-[var(--text)] md:min-h-0 md:min-w-0"
        title={changeThemeLabel}
        aria-label={changeThemeLabel}
      >
        <span
          className="block h-3.5 w-3.5 rounded-full border border-[var(--divider)]"
          style={{ background: current.swatch }}
        />
      </button>

      {open && (
        <div
          className="absolute right-0 top-full z-50 mt-1 min-w-[160px] rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-bg)] p-2 backdrop-blur-xl"
          style={{ boxShadow: "var(--shadow-soft)" }}
        >
          {themes.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => {
                onThemeChange(t.id);
                setOpen(false);
              }}
              className={`zen-pill flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs transition-all duration-300 ${
                theme === t.id
                  ? "zen-pill-active bg-[var(--text)] text-[var(--bg)] ring-2 ring-[var(--glow-active)]"
                  : "text-[var(--muted)] hover:bg-[var(--surface)]"
              }`}
            >
              <span
                className="h-3 w-3 rounded-full border border-[var(--divider)]"
                style={{ background: t.swatch }}
              />
              {t.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
