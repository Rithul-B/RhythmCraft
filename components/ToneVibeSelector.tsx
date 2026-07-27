"use client";

import { TONE_DEFINITIONS, type TonePreset } from "@/lib/toneLexicon";

interface ToneVibeSelectorProps {
  tone: TonePreset;
  onToneChange: (tone: TonePreset) => void;
}

export function ToneVibeSelector({ tone, onToneChange }: ToneVibeSelectorProps) {
  return (
    <div>
      <p className="mb-2.5 text-[10px] tracking-[0.2em] text-[var(--muted-light)] uppercase">
        Tone & Vibe
      </p>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onToneChange("none")}
          className={`zen-pill rounded-full px-3 py-1.5 text-xs transition-all duration-300 ease-in-out ${
            tone === "none"
              ? "zen-pill-active bg-[var(--text)] text-[var(--bg)] ring-2 ring-[var(--glow-active)] shadow-[0_0_12px_var(--accent-soft)]"
              : "bg-[var(--surface-raised)]/50 text-[var(--muted)] hover:-translate-y-0.5 hover:text-[var(--text)] hover:shadow-md"
          }`}
        >
          None
        </button>
        {TONE_DEFINITIONS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => onToneChange(t.id)}
            className={`zen-pill rounded-full px-3 py-1.5 text-xs transition-all duration-300 ease-in-out ${
              tone === t.id
                ? "zen-pill-active bg-[var(--text)] text-[var(--bg)] ring-2 ring-[var(--glow-active)] shadow-[0_0_12px_var(--accent-soft)]"
                : "bg-[var(--surface-raised)]/50 text-[var(--muted)] hover:-translate-y-0.5 hover:text-[var(--text)] hover:shadow-md"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );
}
