import type { AppLanguage } from "./languages";

export type TranslationKey =
  | "loading"
  | "untitled"
  | "line"
  | "lines"
  | "notebooks"
  | "notebook"
  | "poem"
  | "deletePoem"
  | "drafts"
  | "search"
  | "analysis"
  | "searchPlaceholder"
  | "syllables"
  | "metricFeet"
  | "toneVibe"
  | "toneNone"
  | "toneMelancholic"
  | "toneEthereal"
  | "toneGothic"
  | "toneUplifting"
  | "toneArchaic"
  | "toneModern"
  | "toneSlang"
  | "footAny"
  | "footIambic"
  | "footTrochaic"
  | "footAnapestic"
  | "footDactylic"
  | "enterWord"
  | "noMatches"
  | "offlineSuggestions"
  | "synonymsOnlyNote"
  | "emojis"
  | "searchMore"
  | "noQuickMatches"
  | "findingRhymes"
  | "rhymeScheme"
  | "meterSummary"
  | "prevailingMeter"
  | "softBreaks"
  | "hardBreaks"
  | "showAllMeterBreaks"
  | "cadenceReader"
  | "readAloud"
  | "stop"
  | "tempo"
  | "voice"
  | "pitch"
  | "poeticPacing"
  | "speechUnavailable"
  | "grammarCheck"
  | "grammarCheckHint"
  | "grammarReplace"
  | "grammarNoSuggestions"
  | "grammarChecking"
  | "grammarError"
  | "grammarIssues"
  | "export"
  | "downloadTxt"
  | "downloadPdf"
  | "changeTheme"
  | "themeParchment"
  | "themeMidnight"
  | "language"
  | "beginWriting"
  | "closeNotebooks"
  | "closeInspector"
  | "closeSearch"
  | "searchRhymesSynonyms"
  | "stanza"
  | "searchCmdK"
  | "placeCursor"
  | "lineN"
  | "stressPattern"
  | "stressLegend"
  | "wordBreakdown"
  | "colWord"
  | "colSyl"
  | "colStress"
  | "avgSylLine"
  | "copy"
  | "copied"
  | "defaultVoice"
  | "sylSuffix";

type Dictionary = Record<TranslationKey, string>;

const en: Dictionary = {
  loading: "Loading...",
  untitled: "Untitled",
  line: "line",
  lines: "lines",
  notebooks: "Notebooks",
  notebook: "Notebook",
  poem: "Poem",
  deletePoem: "Delete poem",
  drafts: "Drafts",
  search: "Search",
  analysis: "Analysis",
  searchPlaceholder: "Search rhymes & synonyms...",
  syllables: "Syllables",
  metricFeet: "Metric feet",
  toneVibe: "Tone & Vibe",
  toneNone: "None",
  toneMelancholic: "Melancholic",
  toneEthereal: "Ethereal",
  toneGothic: "Gothic",
  toneUplifting: "Uplifting",
  toneArchaic: "Archaic",
  toneModern: "Modern / Gritty",
  toneSlang: "Slang / Vernacular",
  footAny: "Any",
  footIambic: "Iambic",
  footTrochaic: "Trochaic",
  footAnapestic: "Anapestic",
  footDactylic: "Dactylic",
  enterWord: "Enter a word to find rhymes and synonyms.",
  noMatches: "No words match your filters.",
  offlineSuggestions: "Using offline suggestions",
  synonymsOnlyNote: "Synonyms only in this language — rhyme search is available for English and Spanish.",
  emojis: "Emojis",
  searchMore: "Search more →",
  noQuickMatches: "No quick matches",
  findingRhymes: "Finding matches...",
  rhymeScheme: "Rhyme scheme",
  meterSummary: "Meter summary",
  prevailingMeter: "Prevailing meter",
  softBreaks: "soft breaks",
  hardBreaks: "hard breaks",
  showAllMeterBreaks: "Show all meter breaks",
  cadenceReader: "Cadence reader",
  readAloud: "Read aloud",
  stop: "Stop",
  tempo: "Tempo",
  voice: "Voice",
  pitch: "Pitch",
  poeticPacing: "Poetic pacing",
  speechUnavailable: "Speech synthesis is not available in this browser.",
  grammarCheck: "Spelling & grammar",
  grammarCheckHint: "Sends your poem text to LanguageTool while enabled. Click a wavy underline to fix.",
  grammarReplace: "Replace",
  grammarNoSuggestions: "No suggestions",
  grammarChecking: "Checking spelling & grammar…",
  grammarError: "Couldn’t reach LanguageTool. Try again in a moment.",
  grammarIssues: "issues",
  export: "Export",
  downloadTxt: "Download .txt",
  downloadPdf: "Download .pdf",
  changeTheme: "Change theme",
  themeParchment: "Cream Parchment",
  themeMidnight: "Obsidian Dark",
  language: "Language",
  beginWriting: "Begin writing your verse...",
  closeNotebooks: "Close notebooks",
  closeInspector: "Close inspector",
  closeSearch: "Close search",
  searchRhymesSynonyms: "Search rhymes & synonyms",
  stanza: "Stanza",
  searchCmdK: "Search ⌘K",
  placeCursor: "Place your cursor on a line to analyze its rhythm.",
  lineN: "Line {n}",
  stressPattern: "Stress pattern",
  stressLegend: "u = unstressed · / = stressed",
  wordBreakdown: "Word breakdown",
  colWord: "Word",
  colSyl: "Syl",
  colStress: "Stress",
  avgSylLine: "avg syl/line",
  copy: "Copy",
  copied: "Copied",
  defaultVoice: "Default",
  sylSuffix: "syl",
};

const es: Dictionary = {
  ...en,
  loading: "Cargando...",
  untitled: "Sin título",
  line: "línea",
  lines: "líneas",
  notebooks: "Cuadernos",
  notebook: "Cuaderno",
  poem: "Poema",
  deletePoem: "Eliminar poema",
  drafts: "Borradores",
  search: "Buscar",
  analysis: "Análisis",
  searchPlaceholder: "Buscar rimas y sinónimos...",
  syllables: "Sílabas",
  metricFeet: "Pies métricos",
  toneVibe: "Tono y ambiente",
  toneNone: "Ninguno",
  toneMelancholic: "Melancólico",
  toneEthereal: "Etéreo",
  toneGothic: "Gótico",
  toneUplifting: "Elevador",
  toneArchaic: "Arcaico",
  toneModern: "Moderno / Crudo",
  toneSlang: "Jerga / Vernáculo",
  footAny: "Cualquiera",
  footIambic: "Yámbico",
  footTrochaic: "Trocaico",
  footAnapestic: "Anapéstico",
  footDactylic: "Dactílico",
  enterWord: "Escribe una palabra para encontrar rimas y sinónimos.",
  noMatches: "Ninguna palabra coincide con tus filtros.",
  offlineSuggestions: "Usando sugerencias sin conexión",
  synonymsOnlyNote: "Solo sinónimos en este idioma — la búsqueda de rimas está disponible en inglés y español.",
  emojis: "Emojis",
  searchMore: "Buscar más →",
  noQuickMatches: "Sin coincidencias rápidas",
  findingRhymes: "Buscando coincidencias...",
  rhymeScheme: "Esquema de rima",
  meterSummary: "Resumen métrico",
  prevailingMeter: "Metro predominante",
  softBreaks: "quiebres suaves",
  hardBreaks: "quiebres fuertes",
  showAllMeterBreaks: "Mostrar todos los quiebres",
  cadenceReader: "Lector de cadencia",
  readAloud: "Leer en voz alta",
  stop: "Detener",
  tempo: "Tempo",
  voice: "Voz",
  pitch: "Tono",
  poeticPacing: "Ritmo poético",
  speechUnavailable: "La síntesis de voz no está disponible en este navegador.",
  grammarCheck: "Ortografía y gramática",
  grammarCheckHint: "Envía el texto del poema a LanguageTool mientras está activado. Pulsa un subrayado ondulado para corregir.",
  grammarReplace: "Reemplazar",
  grammarNoSuggestions: "Sin sugerencias",
  grammarChecking: "Revisando ortografía y gramática…",
  grammarError: "No se pudo contactar LanguageTool. Inténtalo de nuevo.",
  grammarIssues: "problemas",
  export: "Exportar",
  downloadTxt: "Descargar .txt",
  downloadPdf: "Descargar .pdf",
  changeTheme: "Cambiar tema",
  themeParchment: "Pergamino crema",
  themeMidnight: "Obsidiana oscura",
  language: "Idioma",
  beginWriting: "Comienza a escribir tu verso...",
  closeNotebooks: "Cerrar cuadernos",
  closeInspector: "Cerrar inspector",
  closeSearch: "Cerrar búsqueda",
  searchRhymesSynonyms: "Buscar rimas y sinónimos",
  stanza: "Estrofa",
  searchCmdK: "Buscar ⌘K",
  placeCursor: "Coloca el cursor en una línea para analizar su ritmo.",
  lineN: "Línea {n}",
  stressPattern: "Patrón de acentos",
  stressLegend: "u = átona · / = tónica",
  wordBreakdown: "Desglose de palabras",
  colWord: "Palabra",
  colSyl: "Sílabas",
  colStress: "Acento",
  avgSylLine: "síl. media/línea",
  copy: "Copiar",
  copied: "Copiado",
  defaultVoice: "Predeterminada",
  sylSuffix: "síl",
};

const fr: Dictionary = {
  ...en,
  loading: "Chargement...",
  untitled: "Sans titre",
  line: "ligne",
  lines: "lignes",
  notebooks: "Carnets",
  notebook: "Carnet",
  poem: "Poème",
  deletePoem: "Supprimer le poème",
  drafts: "Brouillons",
  search: "Rechercher",
  analysis: "Analyse",
  searchPlaceholder: "Rechercher rimes et synonymes...",
  syllables: "Syllabes",
  metricFeet: "Pieds métriques",
  toneVibe: "Ton et ambiance",
  toneNone: "Aucun",
  toneMelancholic: "Mélancolique",
  toneEthereal: "Éthéré",
  toneGothic: "Gothique",
  toneUplifting: "Élevant",
  toneArchaic: "Archaïque",
  toneModern: "Moderne / Brut",
  toneSlang: "Argot / Vernaculaire",
  footAny: "Tous",
  footIambic: "Iambique",
  footTrochaic: "Trochaïque",
  footAnapestic: "Anapestique",
  footDactylic: "Dactylique",
  enterWord: "Entrez un mot pour trouver rimes et synonymes.",
  noMatches: "Aucun mot ne correspond à vos filtres.",
  offlineSuggestions: "Suggestions hors ligne",
  synonymsOnlyNote: "Synonymes uniquement dans cette langue — la recherche de rimes est disponible en anglais et en espagnol.",
  emojis: "Emojis",
  searchMore: "Chercher plus →",
  noQuickMatches: "Pas de correspondances rapides",
  findingRhymes: "Recherche en cours...",
  rhymeScheme: "Schéma de rimes",
  meterSummary: "Résumé métrique",
  prevailingMeter: "Mètre dominant",
  softBreaks: "ruptures douces",
  hardBreaks: "ruptures dures",
  showAllMeterBreaks: "Afficher toutes les ruptures",
  cadenceReader: "Lecteur de cadence",
  readAloud: "Lire à haute voix",
  stop: "Arrêter",
  tempo: "Tempo",
  voice: "Voix",
  pitch: "Hauteur",
  poeticPacing: "Rythme poétique",
  speechUnavailable: "La synthèse vocale n'est pas disponible dans ce navigateur.",
  grammarCheck: "Orthographe et grammaire",
  grammarCheckHint: "Envoie le texte du poème à LanguageTool lorsqu'activé. Cliquez un soulignement ondulé pour corriger.",
  grammarReplace: "Remplacer",
  grammarNoSuggestions: "Aucune suggestion",
  grammarChecking: "Vérification de l'orthographe et de la grammaire…",
  grammarError: "Impossible de joindre LanguageTool. Réessayez dans un instant.",
  grammarIssues: "problèmes",
  export: "Exporter",
  downloadTxt: "Télécharger .txt",
  downloadPdf: "Télécharger .pdf",
  changeTheme: "Changer de thème",
  themeParchment: "Parchemin crème",
  themeMidnight: "Obsidienne sombre",
  language: "Langue",
  beginWriting: "Commencez à écrire votre vers...",
  closeNotebooks: "Fermer les carnets",
  closeInspector: "Fermer l'inspecteur",
  closeSearch: "Fermer la recherche",
  searchRhymesSynonyms: "Rechercher rimes et synonymes",
  stanza: "Strophe",
  searchCmdK: "Rechercher ⌘K",
  placeCursor: "Placez le curseur sur une ligne pour analyser son rythme.",
  lineN: "Ligne {n}",
  stressPattern: "Schéma d'accents",
  stressLegend: "u = inaccentué · / = accentué",
  wordBreakdown: "Décomposition des mots",
  colWord: "Mot",
  colSyl: "Syl",
  colStress: "Accent",
  avgSylLine: "syl. moy./ligne",
  copy: "Copier",
  copied: "Copié",
  defaultVoice: "Par défaut",
  sylSuffix: "syl",
};

const de: Dictionary = {
  ...en,
  loading: "Laden...",
  untitled: "Ohne Titel",
  line: "Zeile",
  lines: "Zeilen",
  notebooks: "Notizbücher",
  notebook: "Notizbuch",
  poem: "Gedicht",
  deletePoem: "Gedicht löschen",
  drafts: "Entwürfe",
  search: "Suchen",
  analysis: "Analyse",
  searchPlaceholder: "Reime und Synonyme suchen...",
  syllables: "Silben",
  metricFeet: "Metrische Füße",
  toneVibe: "Ton und Stimmung",
  toneNone: "Keine",
  toneMelancholic: "Melancholisch",
  toneEthereal: "Ätherisch",
  toneGothic: "Gotisch",
  toneUplifting: "Erhebend",
  toneArchaic: "Archaisch",
  toneModern: "Modern / Roh",
  toneSlang: "Slang / Umgangssprache",
  footAny: "Beliebig",
  footIambic: "Jambisch",
  footTrochaic: "Trochäisch",
  footAnapestic: "Anapästisch",
  footDactylic: "Daktylisch",
  enterWord: "Gib ein Wort ein, um Reime und Synonyme zu finden.",
  noMatches: "Keine Wörter passen zu deinen Filtern.",
  offlineSuggestions: "Offline-Vorschläge",
  synonymsOnlyNote: "Nur Synonyme in dieser Sprache — Reimsuche ist für Englisch und Spanisch verfügbar.",
  emojis: "Emojis",
  searchMore: "Mehr suchen →",
  noQuickMatches: "Keine schnellen Treffer",
  findingRhymes: "Suche läuft...",
  rhymeScheme: "Reimschema",
  meterSummary: "Metrische Übersicht",
  prevailingMeter: "Vorherrschendes Metrum",
  softBreaks: "weiche Brüche",
  hardBreaks: "harte Brüche",
  showAllMeterBreaks: "Alle metrischen Brüche zeigen",
  cadenceReader: "Kadenzleser",
  readAloud: "Vorlesen",
  stop: "Stopp",
  tempo: "Tempo",
  voice: "Stimme",
  pitch: "Tonhöhe",
  poeticPacing: "Poetisches Tempo",
  speechUnavailable: "Sprachsynthese ist in diesem Browser nicht verfügbar.",
  grammarCheck: "Rechtschreibung & Grammatik",
  grammarCheckHint: "Sendet den Gedichttext an LanguageTool, solange aktiviert. Tippe auf eine Wellenlinie zum Korrigieren.",
  grammarReplace: "Ersetzen",
  grammarNoSuggestions: "Keine Vorschläge",
  grammarChecking: "Rechtschreibung & Grammatik werden geprüft…",
  grammarError: "LanguageTool nicht erreichbar. Bitte gleich nochmal versuchen.",
  grammarIssues: "Probleme",
  export: "Exportieren",
  downloadTxt: ".txt herunterladen",
  downloadPdf: ".pdf herunterladen",
  changeTheme: "Thema ändern",
  themeParchment: "Cremepergament",
  themeMidnight: "Obsidian Dunkel",
  language: "Sprache",
  beginWriting: "Beginne, deinen Vers zu schreiben...",
  closeNotebooks: "Notizbücher schließen",
  closeInspector: "Inspektor schließen",
  closeSearch: "Suche schließen",
  searchRhymesSynonyms: "Reime und Synonyme suchen",
  stanza: "Strophe",
  searchCmdK: "Suchen ⌘K",
  placeCursor: "Setze den Cursor auf eine Zeile, um den Rhythmus zu analysieren.",
  lineN: "Zeile {n}",
  stressPattern: "Betonungsmuster",
  stressLegend: "u = unbetont · / = betont",
  wordBreakdown: "Wortaufschlüsselung",
  colWord: "Wort",
  colSyl: "Sil",
  colStress: "Betonung",
  avgSylLine: "Silben ø/Zeile",
  copy: "Kopieren",
  copied: "Kopiert",
  defaultVoice: "Standard",
  sylSuffix: "Sil",
};

const it: Dictionary = {
  ...en,
  loading: "Caricamento...",
  untitled: "Senza titolo",
  line: "riga",
  lines: "righe",
  notebooks: "Quaderni",
  notebook: "Quaderno",
  poem: "Poesia",
  deletePoem: "Elimina poesia",
  drafts: "Bozze",
  search: "Cerca",
  analysis: "Analisi",
  searchPlaceholder: "Cerca rime e sinonimi...",
  syllables: "Sillabe",
  metricFeet: "Piedi metrici",
  toneVibe: "Tono e atmosfera",
  toneNone: "Nessuno",
  toneMelancholic: "Malinconico",
  toneEthereal: "Etereo",
  toneGothic: "Gotico",
  toneUplifting: "Elevante",
  toneArchaic: "Arcaico",
  toneModern: "Moderno / Grezzo",
  toneSlang: "Slang / Vernacolo",
  footAny: "Qualsiasi",
  footIambic: "Giambico",
  footTrochaic: "Trocaico",
  footAnapestic: "Anapestico",
  footDactylic: "Dattilico",
  enterWord: "Inserisci una parola per trovare rime e sinonimi.",
  noMatches: "Nessuna parola corrisponde ai tuoi filtri.",
  offlineSuggestions: "Suggerimenti offline",
  synonymsOnlyNote: "Solo sinonimi in questa lingua — la ricerca di rime è disponibile in inglese e spagnolo.",
  emojis: "Emoji",
  searchMore: "Cerca di più →",
  noQuickMatches: "Nessuna corrispondenza rapida",
  findingRhymes: "Ricerca in corso...",
  rhymeScheme: "Schema delle rime",
  meterSummary: "Riepilogo metrico",
  prevailingMeter: "Metro prevalente",
  softBreaks: "interruzioni soft",
  hardBreaks: "interruzioni hard",
  showAllMeterBreaks: "Mostra tutte le interruzioni",
  cadenceReader: "Lettore di cadenza",
  readAloud: "Leggi ad alta voce",
  stop: "Ferma",
  tempo: "Tempo",
  voice: "Voce",
  pitch: "Tono",
  poeticPacing: "Ritmo poetico",
  speechUnavailable: "La sintesi vocale non è disponibile in questo browser.",
  grammarCheck: "Ortografia e grammatica",
  grammarCheckHint: "Invia il testo della poesia a LanguageTool mentre è attivo. Tocca una sottolineatura ondulata per correggere.",
  grammarReplace: "Sostituisci",
  grammarNoSuggestions: "Nessun suggerimento",
  grammarChecking: "Controllo ortografia e grammatica…",
  grammarError: "Impossibile raggiungere LanguageTool. Riprova tra poco.",
  grammarIssues: "problemi",
  export: "Esporta",
  downloadTxt: "Scarica .txt",
  downloadPdf: "Scarica .pdf",
  changeTheme: "Cambia tema",
  themeParchment: "Pergamena crema",
  themeMidnight: "Ossidiana scura",
  language: "Lingua",
  beginWriting: "Inizia a scrivere il tuo verso...",
  closeNotebooks: "Chiudi quaderni",
  closeInspector: "Chiudi ispettore",
  closeSearch: "Chiudi ricerca",
  searchRhymesSynonyms: "Cerca rime e sinonimi",
  stanza: "Strofa",
  searchCmdK: "Cerca ⌘K",
  placeCursor: "Metti il cursore su una riga per analizzarne il ritmo.",
  lineN: "Riga {n}",
  stressPattern: "Schema degli accenti",
  stressLegend: "u = atona · / = tonica",
  wordBreakdown: "Scomposizione delle parole",
  colWord: "Parola",
  colSyl: "Sil",
  colStress: "Accento",
  avgSylLine: "sil. medie/riga",
  copy: "Copia",
  copied: "Copiato",
  defaultVoice: "Predefinita",
  sylSuffix: "sil",
};

const DICTIONARIES: Record<AppLanguage, Dictionary> = { en, es, fr, de, it };

export function t(lang: AppLanguage, key: TranslationKey): string {
  return DICTIONARIES[lang][key] ?? DICTIONARIES.en[key] ?? key;
}
