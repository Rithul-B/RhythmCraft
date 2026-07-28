"use client";

import { Search, BarChart3, X } from "lucide-react";
import { RhythmRhymeFinder } from "./RhythmRhymeFinder";
import { LineAnalysis } from "./LineAnalysis";
import type { LineAnalysisResult } from "@/hooks/useLineAnalysis";
import type { FootPreset } from "@/lib/stress";
import type { AppLanguage } from "@/lib/i18n/languages";
import type { TranslationKey } from "@/lib/i18n/translations";

type Tab = "search" | "analysis";

interface InspectorDrawerProps {
  analysis: LineAnalysisResult;
  text: string;
  footPreset: FootPreset;
  onFootPresetChange: (preset: FootPreset) => void;
  showAllMeterBreaks: boolean;
  onShowAllMeterBreaksChange: (value: boolean) => void;
  onClose: () => void;
  language: AppLanguage;
  t: (key: TranslationKey) => string;
  tab: Tab;
  onTabChange: (tab: Tab) => void;
  grammarCheckEnabled: boolean;
  onGrammarCheckEnabledChange: (value: boolean) => void;
  grammarLoading?: boolean;
  grammarError?: boolean;
  grammarIssueCount?: number;
}

export function InspectorDrawer({
  analysis,
  text,
  footPreset,
  onFootPresetChange,
  showAllMeterBreaks,
  onShowAllMeterBreaksChange,
  onClose,
  language,
  t,
  tab,
  onTabChange,
  grammarCheckEnabled,
  onGrammarCheckEnabledChange,
  grammarLoading = false,
  grammarError = false,
  grammarIssueCount = 0,
}: InspectorDrawerProps) {
  return (
    <div className="flex h-full flex-col font-[family-name:var(--font-ui)]" data-testid="inspector-drawer">
      <div className="flex items-center justify-between px-4 py-4">
        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={() => onTabChange("search")}
            className={`zen-pill flex min-h-11 items-center gap-2 rounded-full px-4 py-2 text-xs transition-all duration-300 md:min-h-0 ${
              tab === "search"
                ? "zen-pill-active bg-[var(--text)] text-[var(--bg)] ring-2 ring-[var(--glow-active)]"
                : "text-[var(--muted)] hover:bg-[var(--surface-raised)]/60"
            }`}
          >
            <Search className="h-3.5 w-3.5" strokeWidth={1.5} />
            {t("search")}
          </button>
          <button
            type="button"
            onClick={() => onTabChange("analysis")}
            className={`zen-pill flex min-h-11 items-center gap-2 rounded-full px-4 py-2 text-xs transition-all duration-300 md:min-h-0 ${
              tab === "analysis"
                ? "zen-pill-active bg-[var(--text)] text-[var(--bg)] ring-2 ring-[var(--glow-active)]"
                : "text-[var(--muted)] hover:bg-[var(--surface-raised)]/60"
            }`}
          >
            <BarChart3 className="h-3.5 w-3.5" strokeWidth={1.5} />
            {t("analysis")}
          </button>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label={t("closeInspector")}
          className="flex min-h-11 min-w-11 items-center justify-center rounded-full p-1.5 text-[var(--muted)] transition-all duration-300 hover:bg-[var(--surface-raised)]/60 md:min-h-0 md:min-w-0"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-6">
        {tab === "search" ? (
          <RhythmRhymeFinder
            footPreset={footPreset}
            onFootPresetChange={onFootPresetChange}
            language={language}
            t={t}
          />
        ) : (
          <div className="space-y-6">
            <div className="rounded-2xl bg-[var(--surface-raised)]/60 p-4 shadow-sm">
              <label className="flex min-h-11 cursor-pointer items-start gap-3 text-xs text-[var(--text)] md:min-h-0">
                <input
                  type="checkbox"
                  checked={grammarCheckEnabled}
                  onChange={(e) => onGrammarCheckEnabledChange(e.target.checked)}
                  className="mt-0.5 accent-[var(--accent)]"
                  data-testid="grammar-check-toggle"
                />
                <span>
                  <span className="block font-medium">{t("grammarCheck")}</span>
                  <span className="mt-1 block text-[10px] text-[var(--muted)]">
                    {t("grammarCheckHint")}
                  </span>
                  {grammarCheckEnabled && (
                    <span className="mt-2 block text-[10px] text-[var(--muted)]">
                      {grammarLoading
                        ? t("grammarChecking")
                        : grammarError
                          ? t("grammarError")
                          : grammarIssueCount > 0
                            ? `${grammarIssueCount} ${t("grammarIssues")}`
                            : null}
                    </span>
                  )}
                </span>
              </label>
            </div>
            <LineAnalysis
              analysis={analysis}
              text={text}
              showAllMeterBreaks={showAllMeterBreaks}
              onShowAllMeterBreaksChange={onShowAllMeterBreaksChange}
              t={t}
            />
          </div>
        )}
      </div>
    </div>
  );
}
