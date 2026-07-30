import type { AppLanguage } from "./i18n/languages";

type Replacer = [RegExp, string];

/**
 * Expand slang / chat abbreviations so Web Speech API pronounces them more
 * naturally. Applied lightly — we keep poetic line breaks intact.
 */
const SHARED: Replacer[] = [
  [/\b(\d+)k\b/gi, "$1 thousand"],
  [/\b(\d+)%/g, "$1 percent"],
];

const BY_LANG: Record<AppLanguage, Replacer[]> = {
  en: [
    [/\b(?:idk)\b/gi, "I don't know"],
    [/\b(?:imo|imho)\b/gi, "in my opinion"],
    [/\b(?:tbh)\b/gi, "to be honest"],
    [/\b(?:ngl)\b/gi, "not gonna lie"],
    [/\b(?:fr)\b/gi, "for real"],
    [/\b(?:rn)\b/gi, "right now"],
    [/\b(?:btw)\b/gi, "by the way"],
    [/\b(?:omg)\b/gi, "oh my god"],
    [/\b(?:lol|lmao)\b/gi, "ha ha"],
    [/\b(?:brb)\b/gi, "be right back"],
    [/\b(?:smh)\b/gi, "shaking my head"],
    [/\b(?:ikr)\b/gi, "I know, right"],
    [/\b(?:lowkey)\b/gi, "low-key"],
    [/\b(?:highkey)\b/gi, "high-key"],
    [/\b(?:no cap)\b/gi, "no cap"],
    [/\b(?:on god)\b/gi, "on God"],
    [/\b(?:bet)\b/gi, "bet"],
    [/\b(?:finna)\b/gi, "fixing to"],
    [/\b(?:gonna)\b/gi, "going to"],
    [/\b(?:wanna)\b/gi, "want to"],
    [/\b(?:gotta)\b/gi, "got to"],
    [/\b(?:lemme)\b/gi, "let me"],
    [/\b(?:gimme)\b/gi, "give me"],
    [/\b(?:kinda)\b/gi, "kind of"],
    [/\b(?:sorta)\b/gi, "sort of"],
    [/\b(?:outta)\b/gi, "out of"],
    [/\b(?:ain't)\b/gi, "isn't"],
    [/\bya\b/gi, "you"],
    [/\bur\b/gi, "your"],
    [/\bu\b/gi, "you"],
    [/\bim\b/gi, "I'm"],
    [/\bthx\b/gi, "thanks"],
    [/\bpls\b/gi, "please"],
    [/\bw\/\b/gi, "with"],
    [/\bw\/o\b/gi, "without"],
    [/\b(?:skibidi)\b/gi, "skibidi"],
    [/\b(?:gyatt)\b/gi, "gyat"],
    [/\b(?:delulu)\b/gi, "delusional"],
    [/\b(?:rizz)\b/gi, "rizz"],
    [/\b(?:sigma)\b/gi, "sigma"],
    [/\b(?:bussin)\b/gi, "bussing"],
    [/\b(?:fr fr)\b/gi, "for real for real"],
    [/\b(?:say less)\b/gi, "say less"],
    [/\b(?:deadass)\b/gi, "dead serious"],
    [/\b(?:it's giving)\b/gi, "it's giving"],
  ],
  es: [
    [/\b(?:xq|xk|pq)\b/gi, "porque"],
    [/\b(?:tmb|tb)\b/gi, "también"],
    [/\b(?:xfa|xfavor)\b/gi, "por favor"],
    [/\b(?:pa['’]?)\b/gi, "para"],
    [/\b(?:bn)\b/gi, "bien"],
    [/\b(?:tqm|tkm)\b/gi, "te quiero mucho"],
    [/\b(?:ntp)\b/gi, "no te preocupes"],
    [/\b(?:vdd)\b/gi, "verdad"],
    [/\b(?:msj)\b/gi, "mensaje"],
    [/\bjajaja+\b/gi, "ja ja ja"],
  ],
  fr: [
    [/\b(?:jsp)\b/gi, "je ne sais pas"],
    [/\b(?:tkt)\b/gi, "t'inquiète"],
    [/\b(?:mdr|ptdr)\b/gi, "mort de rire"],
    [/\b(?:bcp)\b/gi, "beaucoup"],
    [/\b(?:pk|pq)\b/gi, "pourquoi"],
    [/\b(?:stp|svp)\b/gi, "s'il te plaît"],
    [/\b(?:dsl)\b/gi, "désolé"],
    [/\b(?:chui|chuis)\b/gi, "je suis"],
    [/\b(?:ouais)\b/gi, "oui"],
    [/\b(?:wesh)\b/gi, "ouais"],
  ],
  de: [
    [/\b(?:vllt|vl)\b/gi, "vielleicht"],
    [/\b(?:bzw)\b/gi, "beziehungsweise"],
    [/\b(?:usw)\b/gi, "und so weiter"],
    [/\b(?:z\.?b\.?)\b/gi, "zum Beispiel"],
    [/\b(?:ka)\b/gi, "keine Ahnung"],
    [/\b(?:idk)\b/gi, "ich weiß nicht"],
    [/\b(?:digga|digger)\b/gi, "Digga"],
    [/\b(?:krass)\b/gi, "krass"],
    [/\b(?:lass\s+ma)\b/gi, "lass mal"],
  ],
  it: [
    [/\b(?:nn)\b/gi, "non"],
    [/\b(?:xké|xk|perché|perche)\b/gi, "perché"],
    [/\b(?:cmq)\b/gi, "comunque"],
    [/\b(?:tvb)\b/gi, "ti voglio bene"],
    [/\b(?:tt)\b/gi, "tanto"],
    [/\b(?:ke)\b/gi, "che"],
    [/\b(?:qnd)\b/gi, "quando"],
    [/\b(?:msg)\b/gi, "messaggio"],
    [/\b(?:boh)\b/gi, "boh"],
    [/\b(?:ahahah+)\b/gi, "ah ah ah"],
  ],
  pt: [
    [/\b(?:pq)\b/gi, "porque"],
    [/\b(?:tb|tbm)\b/gi, "também"],
    [/\b(?:vc)\b/gi, "você"],
    [/\b(?:msg)\b/gi, "mensagem"],
    [/\b(?:blz)\b/gi, "beleza"],
    [/\b(?:vlw)\b/gi, "valeu"],
    [/\b(?:tmj)\b/gi, "tamo junto"],
    [/\b(?:kd)\b/gi, "cadê"],
    [/\b(?:n|ñ)\b/gi, "não"],
    [/\bhahaha+\b/gi, "ha ha ha"],
  ],
  nl: [
    [/\b(?:ff)\b/gi, "even"],
    [/\b(?:gwn)\b/gi, "gewoon"],
    [/\b(?:idd)\b/gi, "inderdaad"],
    [/\b(?:nvm)\b/gi, "maakt niet uit"],
    [/\b(?:wrm)\b/gi, "waarom"],
    [/\b(?:mss)\b/gi, "misschien"],
    [/\b(?:omg)\b/gi, "oh mijn god"],
    [/\b(?:lol)\b/gi, "ha ha"],
    [/\b(?:sws)\b/gi, "sowieso"],
  ],
  pl: [
    [/\b(?:np)\b/gi, "na przykład"],
    [/\b(?:itd)\b/gi, "i tak dalej"],
    [/\b(?:btw)\b/gi, "przy okazji"],
    [/\b(?:omg)\b/gi, "o mój boże"],
    [/\b(?:lol)\b/gi, "ha ha"],
    [/\b(?:nwm)\b/gi, "nie wiem"],
    [/\b(?:spoko)\b/gi, "spokojnie"],
    [/\b(?:siema)\b/gi, "cześć"],
  ],
  ru: [
    [/\b(?:спс|спсб)\b/gi, "спасибо"],
    [/\b(?:пж|пжлст)\b/gi, "пожалуйста"],
    [/\b(?:норм)\b/gi, "нормально"],
    [/\b(?:чел)\b/gi, "человек"],
    [/\b(?:лол)\b/gi, "ха ха"],
    [/\b(?:имхо)\b/gi, "по моему мнению"],
    [/\b(?:кста)\b/gi, "кстати"],
  ],
  sv: [
    [/\b(?:asså|allså)\b/gi, "alltså"],
    [/\b(?:typ)\b/gi, "typ"],
    [/\b(?:ba)\b/gi, "bara"],
    [/\b(?:omg)\b/gi, "herregud"],
    [/\b(?:lol)\b/gi, "ha ha"],
    [/\b(?:tjena)\b/gi, "hej"],
    [/\b(?:fett)\b/gi, "fett"],
  ],
};

/**
 * Prepare poem text for speech: expand slang, tidy whitespace, keep stanza breaks.
 */
export function normalizeTextForSpeech(text: string, language: AppLanguage): string {
  let out = text.replace(/\u00a0/g, " ");

  out = out.replace(/[—–]/g, ", ");
  out = out.replace(/\.{3,}/g, "…");

  const rules = [...BY_LANG[language], ...SHARED];
  for (const [pattern, replacement] of rules) {
    out = out.replace(pattern, replacement);
  }

  out = out
    .split("\n")
    .map((line) => line.replace(/[ \t]{2,}/g, " ").trimEnd())
    .join("\n")
    .trim();

  return out;
}
