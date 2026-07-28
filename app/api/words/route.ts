import { NextRequest, NextResponse } from "next/server";
import {
  buildDatamuseUrls,
  dedupeWords,
  normalizeWordResults,
  type DatamuseWord,
} from "@/lib/datamuse";
import { getMockWords } from "@/lib/mockWords";
import { getToneMlHints, type TonePreset } from "@/lib/toneLexicon";
import type { AppLanguage } from "@/lib/i18n/languages";

const FETCH_TIMEOUT_MS = 5000;

async function fetchWithTimeout(url: string): Promise<DatamuseWord[]> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const res = await fetch(url, { signal: controller.signal, next: { revalidate: 3600 } });
    if (!res.ok) throw new Error(`Datamuse returned ${res.status}`);
    return (await res.json()) as DatamuseWord[];
  } finally {
    clearTimeout(timeout);
  }
}

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim() ?? "";
  const tone = (request.nextUrl.searchParams.get("tone") ?? "none") as TonePreset;
  const max = Math.min(Number(request.nextUrl.searchParams.get("max") ?? 80), 100);
  const langParam = (request.nextUrl.searchParams.get("lang") ?? "en") as AppLanguage;
  const lang: "en" | "es" = langParam === "es" ? "es" : "en";

  if (!q) {
    return NextResponse.json({ words: [], source: "datamuse" });
  }

  try {
    const toneMl = lang === "en" ? getToneMlHints(tone) : null;
    const urls = buildDatamuseUrls(q, max, toneMl, lang);
    const batches = await Promise.all(urls.map((url) => fetchWithTimeout(url)));
    const merged = dedupeWords(batches.flat()).filter(
      (w) => w.word.toLowerCase() !== q.toLowerCase()
    );

    return NextResponse.json({
      words: normalizeWordResults(merged, "datamuse"),
      source: "datamuse",
    });
  } catch {
    const mockWords = getMockWords(q, tone);
    return NextResponse.json({
      words: normalizeWordResults(mockWords, "mock"),
      source: "mock",
    });
  }
}
