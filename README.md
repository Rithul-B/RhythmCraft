# RhythmCraft

A meter-aware writing app for poets and lyricists. Write in a distraction-free canvas while RhythmCraft analyses your syllables, meter, and rhyme scheme in the background.

## Features

- **Editorial Zen canvas** — centered serif editor with everything else tucked away until you need it
- **Live meter diagnostics** — detects the prevailing metrical foot and softly underlines lines that break it
- **Rhyme scheme mapping** — computes ABAB, AABB, and other patterns as you write
- **Rhyme & synonym search** — powered by the [Datamuse API](https://datamuse.com), filterable by syllable count and metrical foot
- **Tone & Vibe filters** — rank suggestions by mood: melancholic, ethereal, gothic, uplifting, archaic, or modern
- **Cadence reader** — reads your poem aloud with an adjustable BPM tempo slider
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

RhythmCraft is a standard Next.js App Router project and deploys to [Vercel](https://vercel.com) without configuration. Push the repository to GitHub, import it in Vercel, and deploy — the `/api/words` route runs as a serverless function.

No environment variables or API keys are required. If Datamuse is unreachable or times out, the API route falls back to a bundled offline word list so the app keeps working.

## Data storage

Poems and notebooks are stored in the browser's `localStorage`, so your writing never leaves your device.

## Tech stack

Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Lucide icons, jsPDF, Playwright.

## Credits

Word data provided by the [Datamuse API](https://datamuse.com).
