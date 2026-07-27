import { useCallback, useEffect, useState } from "react";
import type { WordResult } from "@/lib/datamuse";
import {
  matchesMeter,
  parseArpabetStress,
  type FootPreset,
} from "@/lib/stress";
import { scoreWordForTone, type TonePreset } from "@/lib/toneLexicon";

export function useWordSearch(debounceMs = 300) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [syllableFilters, setSyllableFilters] = useState<number[]>([]);
  const [footPreset, setFootPreset] = useState<FootPreset>("any");
  const [tone, setTone] = useState<TonePreset>("none");
  const [results, setResults] = useState<WordResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [isMock, setIsMock] = useState(false);
  const [copiedWord, setCopiedWord] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query.trim()), debounceMs);
    return () => clearTimeout(timer);
  }, [query, debounceMs]);

  useEffect(() => {
    if (!debouncedQuery) {
      setResults([]);
      setIsMock(false);
      return;
    }

    const controller = new AbortController();

    async function search() {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          q: debouncedQuery,
          type: "both",
          max: "80",
          tone,
        });
        const res = await fetch(`/api/words?${params}`, {
          signal: controller.signal,
        });
        const data = (await res.json()) as {
          words: WordResult[];
          source: "datamuse" | "mock";
        };

        let filtered = data.words ?? [];

        if (syllableFilters.length > 0) {
          filtered = filtered.filter((w) =>
            syllableFilters.includes(w.numSyllables)
          );
        }

        if (footPreset !== "any") {
          filtered = filtered.filter((w) => {
            const stress = parseArpabetStress(w.tags);
            if (stress.length === 0) return true;
            return matchesMeter(stress, footPreset);
          });
        }

        const ranked = filtered.map((w, index) => ({
          word: w,
          toneScore: scoreWordForTone(w.word, tone),
          originalIndex: index,
        }));

        ranked.sort((a, b) => {
          if (tone !== "none" && b.toneScore !== a.toneScore) {
            return b.toneScore - a.toneScore;
          }
          return a.originalIndex - b.originalIndex;
        });

        setResults(
          ranked.map((r) => ({ ...r.word, toneScore: r.toneScore }))
        );
        setIsMock(data.source === "mock");
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setResults([]);
        }
      } finally {
        setLoading(false);
      }
    }

    search();
    return () => controller.abort();
  }, [debouncedQuery, syllableFilters, footPreset, tone]);

  const toggleSyllableFilter = useCallback((count: number) => {
    setSyllableFilters((prev) =>
      prev.includes(count) ? prev.filter((n) => n !== count) : [...prev, count]
    );
  }, []);

  const copyWord = useCallback(async (word: string) => {
    try {
      await navigator.clipboard.writeText(word);
      setCopiedWord(word);
      setTimeout(() => setCopiedWord(null), 1500);
    } catch {
      // clipboard unavailable
    }
  }, []);

  return {
    query,
    setQuery,
    syllableFilters,
    toggleSyllableFilter,
    footPreset,
    setFootPreset,
    tone,
    setTone,
    results,
    loading,
    isMock,
    copiedWord,
    copyWord,
  };
}
