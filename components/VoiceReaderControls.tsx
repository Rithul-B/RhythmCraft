"use client";

import type { SpeechVoiceOption, VoiceGroup } from "@/hooks/useCadenceReader";
import { displayVoiceLabel } from "@/lib/speechVoices";

interface VoiceReaderControlsProps {
  voiceGroups: VoiceGroup[];
  selectedVoiceURI: string;
  onVoiceChange: (voiceURI: string) => void;
  pitch: number;
  onPitchChange: (pitch: number) => void;
  poeticPacing: boolean;
  onPoeticPacingChange: (value: boolean) => void;
  labels: {
    voice: string;
    pitch: string;
    poeticPacing: string;
    defaultVoice?: string;
    voicesForLanguage?: string;
    otherVoices?: string;
    noVoicesHint?: string;
  };
}

export function VoiceReaderControls({
  voiceGroups,
  selectedVoiceURI,
  onVoiceChange,
  pitch,
  onPitchChange,
  poeticPacing,
  onPoeticPacingChange,
  labels,
}: VoiceReaderControlsProps) {
  const flatCount = voiceGroups.reduce((n, g) => n + g.voices.length, 0);

  return (
    <div className="mt-4 space-y-3">
      <label className="block">
        <span className="mb-1 block text-[10px] text-[var(--muted-light)] uppercase">
          {labels.voice}
        </span>
        <select
          value={selectedVoiceURI}
          onChange={(e) => onVoiceChange(e.target.value)}
          className="min-h-11 w-full rounded-xl border border-[var(--glass-border)] bg-[var(--surface)] px-3 py-2 text-base text-[var(--text)] lg:text-xs"
          data-testid="voice-select"
        >
          {flatCount === 0 ? (
            <option value="">{labels.defaultVoice ?? "Default"}</option>
          ) : (
            voiceGroups.map((group) => {
              if (group.voices.length === 0) return null;
              const groupLabel =
                group.labelKey === "voicesForLanguage"
                  ? labels.voicesForLanguage ?? "Voices for this language"
                  : labels.otherVoices ?? "Other voices";
              return (
                <optgroup key={group.id} label={groupLabel}>
                  {group.voices.map((v: SpeechVoiceOption) => (
                    <option key={v.voiceURI} value={v.voiceURI}>
                      {displayVoiceLabel(v)}
                    </option>
                  ))}
                </optgroup>
              );
            })
          )}
        </select>
        {flatCount === 0 && labels.noVoicesHint && (
          <p className="mt-1 text-[10px] text-[var(--muted)]">{labels.noVoicesHint}</p>
        )}
      </label>

      <label className="block">
        <span className="mb-1 block text-[10px] text-[var(--muted-light)] uppercase">
          {labels.pitch} — {pitch.toFixed(1)}
        </span>
        <input
          type="range"
          min={0.5}
          max={1.8}
          step={0.1}
          value={pitch}
          onChange={(e) => onPitchChange(Number(e.target.value))}
          className="w-full accent-[var(--accent)]"
        />
      </label>

      <label className="flex min-h-11 items-center gap-2 text-xs text-[var(--muted)] md:min-h-0">
        <input
          type="checkbox"
          checked={poeticPacing}
          onChange={(e) => onPoeticPacingChange(e.target.checked)}
          className="accent-[var(--accent)]"
        />
        {labels.poeticPacing}
      </label>
    </div>
  );
}
