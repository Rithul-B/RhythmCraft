"use client";

import { useState } from "react";
import { Search, BarChart3, X } from "lucide-react";
import { RhythmRhymeFinder } from "./RhythmRhymeFinder";
import { LineAnalysis } from "./LineAnalysis";
import type { LineAnalysisResult } from "@/hooks/useLineAnalysis";
import type { FootPreset } from "@/lib/stress";

type Tab = "search" | "analysis";

interface InspectorDrawerProps {
  analysis: LineAnalysisResult;
  text: string;
  footPreset: FootPreset;
  onFootPresetChange: (preset: FootPreset) => void;
  showAllMeterBreaks: boolean;
  onShowAllMeterBreaksChange: (value: boolean) => void;
  onClose: () => void;
}

export function InspectorDrawer({
  analysis,
  text,
  footPreset,
  onFootPresetChange,
  showAllMeterBreaks,
  onShowAllMeterBreaksChange,
  onClose,
}: InspectorDrawerProps) {
  const [tab, setTab] = useState<Tab>("search");

  return (
    <div className="flex h-full flex-col font-[family-name:var(--font-ui)]" data-testid="inspector-drawer">
      <div className="flex items-center justify-between px-4 py-4">
        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={() => setTab("search")}
            className={`zen-pill flex items-center gap-2 rounded-full px-4 py-2 text-xs transition-all duration-300 ${
              tab === "search"
                ? "zen-pill-active bg-[var(--text)] text-[var(--bg)] ring-2 ring-[var(--glow-active)]"
                : "text-[var(--muted)] hover:bg-[var(--surface-raised)]/60"
            }`}
          >
            <Search className="h-3.5 w-3.5" strokeWidth={1.5} />
            Search
          </button>
          <button
            type="button"
            onClick={() => setTab("analysis")}
            className={`zen-pill flex items-center gap-2 rounded-full px-4 py-2 text-xs transition-all duration-300 ${
              tab === "analysis"
                ? "zen-pill-active bg-[var(--text)] text-[var(--bg)] ring-2 ring-[var(--glow-active)]"
                : "text-[var(--muted)] hover:bg-[var(--surface-raised)]/60"
            }`}
          >
            <BarChart3 className="h-3.5 w-3.5" strokeWidth={1.5} />
            Analysis
          </button>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full p-1.5 text-[var(--muted)] transition-all duration-300 hover:bg-[var(--surface-raised)]/60"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-6">
        {tab === "search" ? (
          <RhythmRhymeFinder
            footPreset={footPreset}
            onFootPresetChange={onFootPresetChange}
          />
        ) : (
          <LineAnalysis
            analysis={analysis}
            text={text}
            showAllMeterBreaks={showAllMeterBreaks}
            onShowAllMeterBreaksChange={onShowAllMeterBreaksChange}
          />
        )}
      </div>
    </div>
  );
}
