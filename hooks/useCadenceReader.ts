import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { bpmToSpeechRate } from "@/lib/cadence";
import { normalizeTextForSpeech } from "@/lib/speechNormalize";
import {
  SPEECH_LANG_TAGS,
  displayVoiceLabel,
  groupVoicesForLanguage,
  mapSpeechSynthesisVoices,
  pickBestVoice,
  voiceMatchesLanguage,
  type SpeechVoiceOption,
  type VoiceGroup,
} from "@/lib/speechVoices";
import { getWordStressPattern } from "@/lib/stress";
import type { AppLanguage } from "@/lib/i18n/languages";

export type { SpeechVoiceOption, VoiceGroup };

const subscribeToNothing = () => () => {};
const VOICE_PREF_KEY = "rhythmcraft-voice-by-lang";

function readVoicePrefs(): Partial<Record<AppLanguage, string>> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(VOICE_PREF_KEY);
    return raw ? (JSON.parse(raw) as Partial<Record<AppLanguage, string>>) : {};
  } catch {
    return {};
  }
}

function writeVoicePref(lang: AppLanguage, voiceURI: string) {
  if (typeof window === "undefined") return;
  const next = { ...readVoicePrefs(), [lang]: voiceURI };
  localStorage.setItem(VOICE_PREF_KEY, JSON.stringify(next));
}

function splitPoeticChunks(text: string, language: AppLanguage): string[] {
  // Romance/German punctuation-aware split; keep short lines together when possible.
  const clauseSplit =
    language === "de"
      ? /(?<=[.!?;:—–-])\s+|\n/
      : /(?<=[.!?;:…—–-])\s+|\n/;

  return text
    .split(/\n\s*\n+/)
    .flatMap((stanza) =>
      stanza
        .split(clauseSplit)
        .map((s) => s.trim())
        .filter(Boolean)
    )
    .filter(Boolean);
}

function wordPitch(word: string, basePitch: number, language: AppLanguage): number {
  // Stress heuristic is English-oriented; only nudge pitch for English.
  if (language !== "en") return basePitch;
  const stress = getWordStressPattern(word.replace(/[^\p{L}']/gu, ""));
  if (stress.includes("/")) return Math.min(2, basePitch + 0.1);
  return Math.max(0.5, basePitch - 0.03);
}

function pauseAfterChunk(chunk: string, language: AppLanguage): number {
  if (/[.!?…]$/.test(chunk)) return language === "en" ? 300 : 340;
  if (/[,;:—–-]$/.test(chunk)) return language === "en" ? 160 : 200;
  return language === "en" ? 100 : 130;
}

export function useCadenceReader(language: AppLanguage = "en") {
  const [bpm, setBpm] = useState(100);
  const [pitch, setPitch] = useState(1);
  const [poeticPacing, setPoeticPacing] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [allVoices, setAllVoices] = useState<SpeechVoiceOption[]>([]);
  const [selectedVoiceURI, setSelectedVoiceURIState] = useState<string>("");
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const cancelRef = useRef(false);

  const isSupported = useSyncExternalStore(
    subscribeToNothing,
    () => "speechSynthesis" in window,
    () => true
  );

  const voiceGroups: VoiceGroup[] = useMemo(
    () => groupVoicesForLanguage(allVoices, language),
    [allVoices, language]
  );

  const voices = useMemo(
    () => voiceGroups.flatMap((g) => g.voices),
    [voiceGroups]
  );

  const setSelectedVoiceURI = useCallback(
    (voiceURI: string) => {
      setSelectedVoiceURIState(voiceURI);
      if (voiceURI) writeVoicePref(language, voiceURI);
    },
    [language]
  );

  useEffect(() => {
    if (!isSupported || typeof window === "undefined") return;

    function applyVoices(list: SpeechVoiceOption[]) {
      setAllVoices(list);
      const prefs = readVoicePrefs();
      const preferred = prefs[language];
      const preferredStillThere = preferred && list.some((v) => v.voiceURI === preferred);
      const best = pickBestVoice(list, language);

      setSelectedVoiceURIState((prev) => {
        if (preferredStillThere) return preferred!;
        if (prev && list.some((v) => v.voiceURI === prev) && voiceMatchesPrev(prev, list, language)) {
          return prev;
        }
        return best?.voiceURI ?? list[0]?.voiceURI ?? "";
      });
    }

    function loadVoices() {
      applyVoices(mapSpeechSynthesisVoices(window.speechSynthesis.getVoices()));
    }

    loadVoices();
    window.speechSynthesis.addEventListener("voiceschanged", loadVoices);
    return () => window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
  }, [isSupported, language]);

  const stop = useCallback(() => {
    cancelRef.current = true;
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    utteranceRef.current = null;
  }, []);

  const speak = useCallback(
    (text: string) => {
      if (!text.trim() || typeof window === "undefined" || !window.speechSynthesis) {
        return;
      }

      stop();
      cancelRef.current = false;
      setIsPlaying(true);

      const lang = language;
      const prepared = normalizeTextForSpeech(text, lang);
      const rate = bpmToSpeechRate(bpm);
      // Slightly slower for non-English so regional voices articulate better.
      const langRate = lang === "en" ? rate : Math.max(0.55, rate * 0.92);
      const langTag = SPEECH_LANG_TAGS[lang];
      const voice =
        window.speechSynthesis.getVoices().find((v) => v.voiceURI === selectedVoiceURI) ??
        null;

      const finish = () => {
        if (!cancelRef.current) setIsPlaying(false);
        utteranceRef.current = null;
      };

      const configure = (utterance: SpeechSynthesisUtterance, pitchValue: number) => {
        utterance.rate = langRate;
        utterance.pitch = pitchValue;
        utterance.lang = voice?.lang || langTag;
        if (voice) utterance.voice = voice;
      };

      if (!poeticPacing) {
        const utterance = new SpeechSynthesisUtterance(prepared);
        configure(utterance, pitch);
        utterance.onend = finish;
        utterance.onerror = finish;
        utteranceRef.current = utterance;
        window.speechSynthesis.speak(utterance);
        return;
      }

      const chunks = splitPoeticChunks(prepared, lang);
      let index = 0;

      const speakNext = () => {
        if (cancelRef.current || index >= chunks.length) {
          finish();
          return;
        }

        const chunk = chunks[index++];
        const words = chunk.split(/\s+/).filter(Boolean);

        // Word-level pitch only helps English; other langs sound better as phrases.
        if (lang === "en" && words.length <= 8) {
          let wordIndex = 0;
          const speakWord = () => {
            if (cancelRef.current) {
              finish();
              return;
            }
            if (wordIndex >= words.length) {
              setTimeout(speakNext, pauseAfterChunk(chunk, lang));
              return;
            }
            const word = words[wordIndex++];
            const utterance = new SpeechSynthesisUtterance(word);
            configure(utterance, wordPitch(word, pitch, lang));
            utterance.onend = () => setTimeout(speakWord, 35);
            utterance.onerror = finish;
            utteranceRef.current = utterance;
            window.speechSynthesis.speak(utterance);
          };
          speakWord();
          return;
        }

        const utterance = new SpeechSynthesisUtterance(chunk);
        configure(utterance, pitch);
        utterance.onend = () => setTimeout(speakNext, pauseAfterChunk(chunk, lang));
        utterance.onerror = finish;
        utteranceRef.current = utterance;
        window.speechSynthesis.speak(utterance);
      };

      speakNext();
    },
    [bpm, language, pitch, poeticPacing, selectedVoiceURI, stop]
  );

  useEffect(() => {
    return () => stop();
  }, [stop]);

  return {
    bpm,
    setBpm,
    pitch,
    setPitch,
    poeticPacing,
    setPoeticPacing,
    voices,
    voiceGroups,
    selectedVoiceURI,
    setSelectedVoiceURI,
    displayVoiceLabel,
    isPlaying,
    isSupported,
    speak,
    stop,
    speechLangTag: SPEECH_LANG_TAGS[language],
  };
}

function voiceMatchesPrev(
  voiceURI: string,
  list: SpeechVoiceOption[],
  language: AppLanguage
): boolean {
  const voice = list.find((v) => v.voiceURI === voiceURI);
  if (!voice) return false;
  return voiceMatchesLanguage(voice.lang, language);
}
