"use client";

import type { TonePreset } from "@/lib/toneLexicon";
import type { TranslationKey } from "@/lib/i18n/translations";

interface ToneVibeSelectorProps {
  tone: TonePreset;
  onToneChange: (tone: TonePreset) => void;
  t: (key: TranslationKey) => string;
}

const TONE_KEYS: { id: TonePreset; key: TranslationKey }[] = [
  { id: "none", key: "toneNone" },
  { id: "melancholic", key: "toneMelancholic" },
  { id: "ethereal", key: "toneEthereal" },
  { id: "gothic", key: "toneGothic" },
  { id: "uplifting", key: "toneUplifting" },
  { id: "archaic", key: "toneArchaic" },
  { id: "modern", key: "toneModern" },
  { id: "slang", key: "toneSlang" },
];

export function ToneVibeSelector({ tone, onToneChange, t }: ToneVibeSelectorProps) {
  return (
    <div>
      <p className="mb-2.5 text-[10px] tracking-[0.2em] text-[var(--muted-light)] uppercase">
        {t("toneVibe")}
      </p>
      <div className="flex flex-wrap gap-2">
        {TONE_KEYS.map(({ id, key }) => (
          <button
            key={id}
            type="button"
            onClick={() => onToneChange(id)}
            className={`zen-pill min-h-11 rounded-full px-3 py-1.5 text-xs transition-all duration-300 ease-in-out md:min-h-0 ${
              tone === id
                ? "zen-pill-active bg-[var(--text)] text-[var(--bg)] ring-2 ring-[var(--glow-active)] shadow-[0_0_12px_var(--accent-soft)]"
                : "bg-[var(--surface-raised)]/50 text-[var(--muted)] hover:-translate-y-0.5 hover:text-[var(--text)] hover:shadow-md"
            }`}
          >
            {t(key)}
          </button>
        ))}
      </div>
    </div>
  );
}
