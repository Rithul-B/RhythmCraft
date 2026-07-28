import { NextRequest, NextResponse } from "next/server";
import {
  categorizeRule,
  toLanguageToolCode,
  type GrammarCheckResult,
  type GrammarMatch,
} from "@/lib/grammarCheck";
import type { AppLanguage } from "@/lib/i18n/languages";

const FETCH_TIMEOUT_MS = 8000;
const MAX_TEXT_CHARS = 12_000;

interface LanguageToolMatch {
  offset: number;
  length: number;
  message: string;
  shortMessage?: string;
  replacements?: { value: string }[];
  rule?: {
    category?: { id?: string; name?: string };
    issueType?: string;
  };
}

interface LanguageToolResponse {
  matches?: LanguageToolMatch[];
}

export async function POST(request: NextRequest) {
  let body: { text?: string; lang?: string };
  try {
    body = (await request.json()) as { text?: string; lang?: string };
  } catch {
    return NextResponse.json(
      { matches: [], source: "error" } satisfies GrammarCheckResult,
      { status: 400 }
    );
  }

  const text = (body.text ?? "").slice(0, MAX_TEXT_CHARS);
  const lang = (body.lang ?? "en") as AppLanguage;

  if (!text.trim()) {
    return NextResponse.json({ matches: [], source: "languagetool" } satisfies GrammarCheckResult);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const form = new URLSearchParams();
    form.set("text", text);
    form.set("language", toLanguageToolCode(lang));
    form.set("enabledOnly", "false");

    const res = await fetch("https://api.languagetool.org/v2/check", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: form.toString(),
      signal: controller.signal,
    });

    if (!res.ok) {
      throw new Error(`LanguageTool returned ${res.status}`);
    }

    const data = (await res.json()) as LanguageToolResponse;
    const matches: GrammarMatch[] = (data.matches ?? []).slice(0, 40).map((m) => ({
      offset: m.offset,
      length: m.length,
      message: m.message,
      shortMessage: m.shortMessage || m.message,
      replacements: (m.replacements ?? []).slice(0, 5).map((r) => r.value),
      category: categorizeRule(m.rule?.category?.id, m.rule?.issueType),
    }));

    return NextResponse.json({ matches, source: "languagetool" } satisfies GrammarCheckResult);
  } catch {
    return NextResponse.json({ matches: [], source: "error" } satisfies GrammarCheckResult);
  } finally {
    clearTimeout(timeout);
  }
}
