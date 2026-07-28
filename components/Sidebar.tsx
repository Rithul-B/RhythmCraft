"use client";

import { useState } from "react";
import { Search, BarChart3 } from "lucide-react";
import { RhythmRhymeFinder } from "./RhythmRhymeFinder";
import { LineAnalysis } from "./LineAnalysis";
import type { LineAnalysisResult } from "@/hooks/useLineAnalysis";
import type { FootPreset } from "@/lib/stress";
import { t as translate } from "@/lib/i18n/translations";

type Tab = "search" | "analysis";

interface SidebarProps {
  analysis: LineAnalysisResult;
  text: string;
  footPreset: FootPreset;
  onFootPresetChange: (preset: FootPreset) => void;
  showAllMeterBreaks: boolean;
  onShowAllMeterBreaksChange: (value: boolean) => void;
}

/** Legacy sidebar kept for compatibility; WritingWorkspace uses InspectorDrawer. */
export function Sidebar({
  analysis,
  text,
  footPreset,
  onFootPresetChange,
  showAllMeterBreaks,
  onShowAllMeterBreaksChange,
}: SidebarProps) {
  const [tab, setTab] = useState<Tab>("search");
  const t = (key: Parameters<typeof translate>[1]) => translate("en", key);

  return (
    <div className="flex h-full flex-col">
      <div className="flex gap-1.5 p-4 pb-0">
        <button
          type="button"
          onClick={() => setTab("search")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2.5 text-xs tracking-wide transition-all duration-200 ${
            tab === "search"
              ? "bg-[var(--text)] text-[var(--bg)] shadow-sm"
              : "text-[var(--muted)] hover:bg-[var(--surface-raised)]/60 hover:text-[var(--text)]"
          }`}
        >
          <Search className="h-3.5 w-3.5" strokeWidth={1.5} />
          Search & Vibe
        </button>
        <button
          type="button"
          onClick={() => setTab("analysis")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2.5 text-xs tracking-wide transition-all duration-200 ${
            tab === "analysis"
              ? "bg-[var(--text)] text-[var(--bg)] shadow-sm"
              : "text-[var(--muted)] hover:bg-[var(--surface-raised)]/60 hover:text-[var(--text)]"
          }`}
        >
          <BarChart3 className="h-3.5 w-3.5" strokeWidth={1.5} />
          Line Analysis
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-5 pt-4">
        {tab === "search" ? (
          <RhythmRhymeFinder
            footPreset={footPreset}
            onFootPresetChange={onFootPresetChange}
            language="en"
            t={t}
          />
        ) : (
          <LineAnalysis
            analysis={analysis}
            text={text}
            showAllMeterBreaks={showAllMeterBreaks}
            onShowAllMeterBreaksChange={onShowAllMeterBreaksChange}
            t={t}
          />
        )}
      </div>
    </div>
  );
}
