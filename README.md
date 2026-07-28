# RhythmCraft

A meter-aware writing app for poets and lyricists. Write in a distraction-free canvas while RhythmCraft analyses your syllables, meter, and rhyme scheme in the background.

## Features

- **Editorial Zen canvas** — centered serif editor with everything else tucked away until you need it
- **Live meter diagnostics** — detects the prevailing metrical foot and softly underlines lines that break it
- **Rhyme scheme mapping** — computes ABAB, AABB, and other patterns as you write
- **Rhyme & synonym search** — English/Spanish via [Datamuse](https://datamuse.com); French/German/Italian synonyms via Free Dictionary API
- **Emoji suggestions** — poetic keyword search also returns relevant emoji
- **Tone & Vibe filters** — melancholic, ethereal, gothic, uplifting, archaic, modern/gritty, and slang/vernacular (English)
- **Spelling & grammar** — opt-in LanguageTool linting with wavy underlines and quick-fix tooltips (off by default)
- **Multi-language UI** — English, Spanish, French, German, Italian interface labels
- **Cadence reader** — voice picker, pitch + BPM controls, and poetic pacing with caesura pauses
- **Mobile-ready drawers** — bottom sheets with drag-to-dismiss on phones; 44px tap targets
- **Notebooks** — organise poems into collections, saved locally in your browser
- **Themes** — Cream Parchment and Obsidian Dark
- **Export** — download as `.txt` or `.pdf` with optional line numbers and rhyme labels

## Keyboard shortcuts

| Shortcut | Action |
| --- | --- |
| `Cmd/Ctrl + K` | Open the command palette |
| `Cmd/Ctrl + \` | Toggle the notebooks drawer |
| `Cmd/Ctrl + I` | Toggle the inspector drawer |
| `Escape` | Close the topmost overlay |

Highlighting a word in the editor opens a popover with instant rhyme suggestions.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm start` | Serve the production build |
| `npm run lint` | Run ESLint |
| `npm run test:e2e` | Run the Playwright end-to-end suite |
| `npm run test:e2e:headed` | Run the suite in a visible browser |

## Deployment

RhythmCraft is a standard Next.js App Router project and deploys to [Vercel](https://vercel.com) without configuration. The `/api/words` and `/api/grammar` routes run as serverless functions.

No environment variables or API keys are required. If Datamuse is unreachable or times out, the words API falls back to a bundled offline word list.

## Data storage & privacy

Poems and notebooks are stored in the browser's `localStorage`.

**Spelling & grammar checking is opt-in and off by default.** When you enable it in the Inspector → Analysis panel, poem text is sent to [LanguageTool](https://languagetool.org)'s public API for proofreading. Disable the toggle to stop sending text.

Word/rhyme search always contacts Datamuse (or Free Dictionary for FR/DE/IT) with the search query only — not your full poem.

## Tech stack

Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Lucide icons, jsPDF, Playwright.

## Credits

Word data provided by the [Datamuse API](https://datamuse.com) and [Free Dictionary API](https://dictionaryapi.dev). Grammar checking by [LanguageTool](https://languagetool.org).
