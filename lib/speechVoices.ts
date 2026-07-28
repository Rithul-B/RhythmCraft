import type { AppLanguage } from "./i18n/languages";

export interface SpeechVoiceOption {
  name: string;
  lang: string;
  voiceURI: string;
  localService?: boolean;
}

/** Preferred utterance.lang tags for clearer TTS. */
export const SPEECH_LANG_TAGS: Record<AppLanguage, string> = {
  en: "en-US",
  es: "es-ES",
  fr: "fr-FR",
  de: "de-DE",
  it: "it-IT",
};

/** Regional variants we actively surface for each app language. */
export const SPEECH_LOCALE_PREFIXES: Record<AppLanguage, string[]> = {
  en: ["en-us", "en-gb", "en-au", "en-in", "en-ie", "en-za", "en-ca", "en"],
  es: ["es-es", "es-mx", "es-us", "es-ar", "es-co", "es-cl", "es-pe", "es-ve", "es-uy", "es"],
  fr: ["fr-fr", "fr-ca", "fr-be", "fr-ch", "fr"],
  de: ["de-de", "de-at", "de-ch", "de"],
  it: ["it-it", "it-ch", "it"],
};

const QUALITY_BOOST = [
  "premium",
  "enhanced",
  "neural",
  "natural",
  "online",
  "google",
  "microsoft",
  "siri",
  "eloquence",
];

function normalizeLang(lang: string): string {
  return lang.toLowerCase().replace(/_/g, "-");
}

export function voiceMatchesLanguage(voiceLang: string, appLang: AppLanguage): boolean {
  const normalized = normalizeLang(voiceLang);
  const prefixes = SPEECH_LOCALE_PREFIXES[appLang];
  return prefixes.some(
    (prefix) => normalized === prefix || normalized.startsWith(`${prefix}-`) || normalized.startsWith(prefix)
  );
}

function qualityScore(voice: SpeechVoiceOption): number {
  const hay = `${voice.name} ${voice.lang}`.toLowerCase();
  let score = 0;
  for (const token of QUALITY_BOOST) {
    if (hay.includes(token)) score += 8;
  }
  // Prefer exact regional tags over bare "es" / "fr".
  if (normalizeLang(voice.lang).includes("-")) score += 3;
  if (voice.localService === false) score += 2; // often cloud/neural on Chromium
  // Mild preference for female/male variety is not needed; keep stable.
  return score;
}

function localeRank(voiceLang: string, appLang: AppLanguage): number {
  const normalized = normalizeLang(voiceLang);
  const prefixes = SPEECH_LOCALE_PREFIXES[appLang];
  const idx = prefixes.findIndex(
    (prefix) => normalized === prefix || normalized.startsWith(`${prefix}-`) || normalized.startsWith(prefix)
  );
  return idx === -1 ? 99 : idx;
}

/** Rank voices for a language: preferred regions + quality first. */
export function rankVoicesForLanguage(
  voices: SpeechVoiceOption[],
  appLang: AppLanguage
): SpeechVoiceOption[] {
  return [...voices]
    .filter((v) => voiceMatchesLanguage(v.lang, appLang))
    .sort((a, b) => {
      const localeDiff = localeRank(a.lang, appLang) - localeRank(b.lang, appLang);
      if (localeDiff !== 0) return localeDiff;
      const qualityDiff = qualityScore(b) - qualityScore(a);
      if (qualityDiff !== 0) return qualityDiff;
      return a.name.localeCompare(b.name);
    });
}

export function pickBestVoice(
  voices: SpeechVoiceOption[],
  appLang: AppLanguage
): SpeechVoiceOption | null {
  return rankVoicesForLanguage(voices, appLang)[0] ?? null;
}

export interface VoiceGroup {
  id: string;
  labelKey: "voicesForLanguage" | "otherVoices";
  voices: SpeechVoiceOption[];
}

/**
 * For non-English: show every matching regional voice first (more options),
 * then other system voices. English keeps a compact primary list.
 */
export function groupVoicesForLanguage(
  allVoices: SpeechVoiceOption[],
  appLang: AppLanguage
): VoiceGroup[] {
  const primary = rankVoicesForLanguage(allVoices, appLang);
  const primaryUris = new Set(primary.map((v) => v.voiceURI));

  if (appLang === "en") {
    // Keep English list focused; still include strong regional accents.
    const compact = primary.slice(0, 12);
    const rest = allVoices
      .filter((v) => !compact.some((c) => c.voiceURI === v.voiceURI))
      .sort((a, b) => a.name.localeCompare(b.name));
    return [
      { id: "primary", labelKey: "voicesForLanguage", voices: compact },
      ...(rest.length ? [{ id: "other", labelKey: "otherVoices" as const, voices: rest }] : []),
    ];
  }

  // Non-English: surface ALL matching locale voices (es-MX, es-AR, fr-CA, …).
  const other = allVoices
    .filter((v) => !primaryUris.has(v.voiceURI))
    .sort((a, b) => a.name.localeCompare(b.name));

  return [
    { id: "primary", labelKey: "voicesForLanguage", voices: primary },
    ...(other.length ? [{ id: "other", labelKey: "otherVoices" as const, voices: other }] : []),
  ];
}

export function displayVoiceLabel(voice: SpeechVoiceOption): string {
  const region = voice.lang?.replace("_", "-") ?? "";
  return region ? `${voice.name} · ${region}` : voice.name;
}

export function mapSpeechSynthesisVoices(
  list: SpeechSynthesisVoice[]
): SpeechVoiceOption[] {
  return list.map((v) => ({
    name: v.name,
    lang: v.lang,
    voiceURI: v.voiceURI,
    localService: v.localService,
  }));
}
