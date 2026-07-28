"use client";

import { FolderOpen, PanelRight } from "lucide-react";
import { ExportMenu } from "./ExportMenu";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { LanguageSelector } from "./LanguageSelector";
import type { ThemeId } from "@/hooks/useTheme";
import type { RhymeSchemeResult } from "@/lib/rhymeScheme";
import type { AppLanguage } from "@/lib/i18n/languages";
import type { TranslationKey } from "@/lib/i18n/translations";

interface EditorHeaderProps {
  poemTitle: string;
  onTitleChange: (title: string) => void;
  lineCount: number;
  onToggleNotebook: () => void;
  onToggleInspector: () => void;
  theme: ThemeId;
  onThemeChange: (theme: ThemeId) => void;
  text: string;
  rhymeScheme: RhymeSchemeResult;
  language: AppLanguage;
  onLanguageChange: (language: AppLanguage) => void;
  t: (key: TranslationKey) => string;
}

export function EditorHeader({
  poemTitle,
  onTitleChange,
  lineCount,
  onToggleNotebook,
  onToggleInspector,
  theme,
  onThemeChange,
  text,
  rhymeScheme,
  language,
  onLanguageChange,
  t,
}: EditorHeaderProps) {
  return (
    <header className="relative z-10 flex h-14 shrink-0 items-center gap-1 px-2 pt-[env(safe-area-inset-top,0px)] sm:px-3 lg:h-12 lg:px-6">
      <div className="flex min-w-0 flex-1 items-center gap-1 sm:gap-2">
        <button
          type="button"
          onClick={onToggleNotebook}
          className="flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-full p-2 text-[var(--muted)] transition-all duration-300 ease-in-out hover:bg-[var(--surface-raised)]/60 hover:text-[var(--text)]"
          title={`${t("notebooks")} (⌘\\)`}
        >
          <FolderOpen className="h-4 w-4" strokeWidth={1.5} />
        </button>
        <input
          type="text"
          value={poemTitle}
          onChange={(e) => onTitleChange(e.target.value)}
          className="min-h-11 min-w-0 max-w-[40vw] truncate bg-transparent font-[family-name:var(--font-ui)] text-base text-[var(--muted)] placeholder:text-[var(--muted-light)] focus:text-[var(--text)] focus:outline-none sm:max-w-[160px] lg:max-w-[200px] lg:text-sm"
          placeholder={t("untitled")}
          enterKeyHint="done"
        />
      </div>

      <h1 className="pointer-events-none absolute left-1/2 hidden -translate-x-1/2 font-[family-name:var(--font-editor)] text-sm font-bold tracking-[0.15em] text-[var(--text)] uppercase sm:block">
        RhythmCraft
      </h1>

      <div className="flex shrink-0 items-center gap-0.5">
        <span className="mr-1 hidden font-mono text-[10px] text-[var(--muted-light)] lg:inline">
          {lineCount} {lineCount === 1 ? t("line") : t("lines")}
        </span>
        <button
          type="button"
          onClick={onToggleInspector}
          className="flex min-h-11 min-w-11 items-center justify-center rounded-full p-2 text-[var(--muted)] transition-all duration-300 ease-in-out hover:bg-[var(--surface-raised)]/60 hover:text-[var(--text)]"
          title={`${t("analysis")} (⌘I)`}
        >
          <PanelRight className="h-4 w-4" strokeWidth={1.5} />
        </button>
        <ExportMenu
          text={text}
          title={poemTitle}
          rhymeScheme={rhymeScheme}
          exportLabel={t("export")}
          downloadTxtLabel={t("downloadTxt")}
          downloadPdfLabel={t("downloadPdf")}
          iconOnlyOnMobile
        />
        <LanguageSelector
          language={language}
          onLanguageChange={onLanguageChange}
          label={t("language")}
        />
        <ThemeSwitcher
          theme={theme}
          onThemeChange={onThemeChange}
          changeThemeLabel={t("changeTheme")}
          parchmentLabel={t("themeParchment")}
          midnightLabel={t("themeMidnight")}
        />
      </div>
    </header>
  );
}
