"use client";

import { Play, Square } from "lucide-react";
import { useCadenceReader } from "@/hooks/useCadenceReader";
import {
  estimateReadingTimeMs,
  formatReadingTime,
  getPacingLabel,
  getStanzaCadences,
} from "@/lib/cadence";
import type { AppLanguage } from "@/lib/i18n/languages";
import { VoiceReaderControls } from "./VoiceReaderControls";

interface CadenceReaderProps {
  text: string;
  language: AppLanguage;
  labels?: {
    title?: string;
    readAloud?: string;
    stop?: string;
    tempo?: string;
    voice?: string;
    pitch?: string;
    poeticPacing?: string;
    unavailable?: string;
    stanza?: string;
    defaultVoice?: string;
    voicesForLanguage?: string;
    otherVoices?: string;
    noVoicesHint?: string;
  };
}

export function CadenceReader({ text, language, labels = {} }: CadenceReaderProps) {
  const {
    bpm,
    setBpm,
    pitch,
    setPitch,
    poeticPacing,
    setPoeticPacing,
    voiceGroups,
    selectedVoiceURI,
    setSelectedVoiceURI,
    isPlaying,
    isSupported,
    speak,
    stop,
  } = useCadenceReader(language);

  const readingTime = formatReadingTime(estimateReadingTimeMs(text, bpm));
  const pacingLabel = getPacingLabel(bpm);
  const stanzas = getStanzaCadences(text, bpm);

  if (!isSupported) {
    return (
      <p className="text-xs text-[var(--muted)]">
        {labels.unavailable ?? "Speech synthesis is not available in this browser."}
      </p>
    );
  }

  return (
    <div>
      <p className="mb-2 text-[10px] tracking-[0.2em] text-[var(--muted-light)] uppercase">
        {labels.title ?? "Cadence reader"}
      </p>
      <div className="rounded-2xl bg-[var(--surface-raised)]/60 p-4 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <button
            type="button"
            onClick={() => (isPlaying ? stop() : speak(text))}
            disabled={!text.trim()}
            className="flex min-h-11 items-center gap-2 rounded-full bg-[var(--text)] px-4 py-2 text-xs text-[var(--bg)] transition-opacity hover:opacity-90 disabled:opacity-40"
            data-testid="cadence-play"
          >
            {isPlaying ? (
              <>
                <Square className="h-3 w-3" fill="currentColor" />
                {labels.stop ?? "Stop"}
              </>
            ) : (
              <>
                <Play className="h-3 w-3" />
                {labels.readAloud ?? "Read aloud"}
              </>
            )}
          </button>
          <span className="text-xs text-[var(--muted)]">
            {readingTime} · {pacingLabel}
          </span>
        </div>

        <label className="block">
          <span className="mb-1 block text-[10px] text-[var(--muted-light)] uppercase">
            {labels.tempo ?? "Tempo"} — {bpm} BPM
          </span>
          <input
            type="range"
            min={60}
            max={180}
            value={bpm}
            onChange={(e) => setBpm(Number(e.target.value))}
            className="w-full accent-[var(--accent)]"
          />
        </label>

        <VoiceReaderControls
          voiceGroups={voiceGroups}
          selectedVoiceURI={selectedVoiceURI}
          onVoiceChange={setSelectedVoiceURI}
          pitch={pitch}
          onPitchChange={setPitch}
          poeticPacing={poeticPacing}
          onPoeticPacingChange={setPoeticPacing}
          labels={{
            voice: labels.voice ?? "Voice",
            pitch: labels.pitch ?? "Pitch",
            poeticPacing: labels.poeticPacing ?? "Poetic pacing",
            defaultVoice: labels.defaultVoice ?? "Default",
            voicesForLanguage: labels.voicesForLanguage,
            otherVoices: labels.otherVoices,
            noVoicesHint: labels.noVoicesHint,
          }}
        />

        {stanzas.length > 1 && (
          <div className="mt-3 space-y-1">
            {stanzas.map((s) => (
              <p key={s.index} className="text-[10px] text-[var(--muted)]">
                {labels.stanza ?? "Stanza"} {s.index}: {s.lineCount} ·{" "}
                {formatReadingTime(s.readingTimeMs)}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
