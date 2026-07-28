import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { bpmToSpeechRate } from "@/lib/cadence";
import { getWordStressPattern } from "@/lib/stress";

const subscribeToNothing = () => () => {};

export interface SpeechVoiceOption {
  name: string;
  lang: string;
  voiceURI: string;
}

function splitPoeticChunks(text: string): string[] {
  return text
    .split(/\n\s*\n+/)
    .flatMap((stanza) =>
      stanza
        .split(/(?<=[.!?;:—–-])\s+|\n/)
        .map((s) => s.trim())
        .filter(Boolean)
    )
    .filter(Boolean);
}

function wordPitch(word: string, basePitch: number): number {
  const stress = getWordStressPattern(word.replace(/[^a-zA-Z']/g, ""));
  if (stress.includes("/")) return Math.min(2, basePitch + 0.12);
  return Math.max(0.5, basePitch - 0.04);
}

export function useCadenceReader() {
  const [bpm, setBpm] = useState(100);
  const [pitch, setPitch] = useState(1);
  const [poeticPacing, setPoeticPacing] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [voices, setVoices] = useState<SpeechVoiceOption[]>([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string>("");
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const cancelRef = useRef(false);

  const isSupported = useSyncExternalStore(
    subscribeToNothing,
    () => "speechSynthesis" in window,
    () => true
  );

  useEffect(() => {
    if (!isSupported || typeof window === "undefined") return;

    function loadVoices() {
      const list = window.speechSynthesis.getVoices();
      const mapped = list.map((v) => ({
        name: v.name,
        lang: v.lang,
        voiceURI: v.voiceURI,
      }));
      setVoices(mapped);
      setSelectedVoiceURI((prev) => {
        if (prev && mapped.some((v) => v.voiceURI === prev)) return prev;
        return mapped[0]?.voiceURI ?? "";
      });
    }

    loadVoices();
    window.speechSynthesis.addEventListener("voiceschanged", loadVoices);
    return () => window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
  }, [isSupported]);

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

      const rate = bpmToSpeechRate(bpm);
      const voice =
        window.speechSynthesis.getVoices().find((v) => v.voiceURI === selectedVoiceURI) ??
        null;

      const finish = () => {
        if (!cancelRef.current) setIsPlaying(false);
        utteranceRef.current = null;
      };

      if (!poeticPacing) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = rate;
        utterance.pitch = pitch;
        if (voice) utterance.voice = voice;
        utterance.onend = finish;
        utterance.onerror = finish;
        utteranceRef.current = utterance;
        window.speechSynthesis.speak(utterance);
        return;
      }

      const chunks = splitPoeticChunks(text);
      let index = 0;

      const speakNext = () => {
        if (cancelRef.current || index >= chunks.length) {
          finish();
          return;
        }

        const chunk = chunks[index++];
        const words = chunk.split(/\s+/).filter(Boolean);

        // Prefer word-level pitch variation when the chunk is short enough.
        if (words.length <= 8) {
          let wordIndex = 0;
          const speakWord = () => {
            if (cancelRef.current) {
              finish();
              return;
            }
            if (wordIndex >= words.length) {
              const gap = /[.!?]$/.test(chunk) ? 280 : /[,;:—–-]$/.test(chunk) ? 160 : 90;
              setTimeout(speakNext, gap);
              return;
            }
            const word = words[wordIndex++];
            const utterance = new SpeechSynthesisUtterance(word);
            utterance.rate = rate;
            utterance.pitch = wordPitch(word, pitch);
            if (voice) utterance.voice = voice;
            utterance.onend = () => setTimeout(speakWord, 40);
            utterance.onerror = finish;
            utteranceRef.current = utterance;
            window.speechSynthesis.speak(utterance);
          };
          speakWord();
          return;
        }

        const utterance = new SpeechSynthesisUtterance(chunk);
        utterance.rate = rate;
        utterance.pitch = pitch;
        if (voice) utterance.voice = voice;
        utterance.onend = () => {
          const gap = /[.!?]$/.test(chunk) ? 320 : /[,;:—–-]$/.test(chunk) ? 180 : 110;
          setTimeout(speakNext, gap);
        };
        utterance.onerror = finish;
        utteranceRef.current = utterance;
        window.speechSynthesis.speak(utterance);
      };

      speakNext();
    },
    [bpm, pitch, poeticPacing, selectedVoiceURI, stop]
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
    selectedVoiceURI,
    setSelectedVoiceURI,
    isPlaying,
    isSupported,
    speak,
    stop,
  };
}
