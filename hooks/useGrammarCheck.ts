"use client";

import { useEffect, useState } from "react";
import type { AppLanguage } from "@/lib/i18n/languages";
import type { GrammarCheckResult, GrammarMatch } from "@/lib/grammarCheck";

const EMPTY: GrammarMatch[] = [];

export function useGrammarCheck(
  text: string,
  language: AppLanguage,
  enabled: boolean,
  debounceMs = 1200
) {
  const [fetched, setFetched] = useState<{
    text: string;
    language: AppLanguage;
    matches: GrammarMatch[];
  } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!enabled || !text.trim()) return;

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/grammar", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, lang: language }),
          signal: controller.signal,
        });
        const data = (await res.json()) as GrammarCheckResult;
        if (!controller.signal.aborted) {
          setFetched({ text, language, matches: data.matches ?? EMPTY });
        }
      } catch (err) {
        if ((err as Error).name !== "AbortError" && !controller.signal.aborted) {
          setFetched({ text, language, matches: EMPTY });
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, debounceMs);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [text, language, enabled, debounceMs]);

  const matches =
    enabled && fetched && fetched.text === text && fetched.language === language
      ? fetched.matches
      : EMPTY;

  return { matches, loading: enabled && loading };
}
