import { useCallback, useEffect, useRef, useState } from "react";
import { bpmToSpeechRate } from "@/lib/cadence";

export function useCadenceReader() {
  const [bpm, setBpm] = useState(100);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    setIsSupported(typeof window !== "undefined" && "speechSynthesis" in window);
  }, []);

  const stop = useCallback(() => {
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

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = bpmToSpeechRate(bpm);
      utterance.pitch = 1;
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
    },
    [bpm, stop]
  );

  useEffect(() => {
    return () => stop();
  }, [stop]);

  return { bpm, setBpm, isPlaying, isSupported, speak, stop };
}
