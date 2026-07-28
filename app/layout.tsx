import type { Metadata, Viewport } from "next";
import { Newsreader, Inter, Geist_Mono } from "next/font/google";
import "./globals.css";

const newsreader = Newsreader({
  variable: "--font-editor",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "700"],
});

const inter = Inter({
  variable: "--font-ui",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = "https://rhythmcraft.vercel.app";
const DESCRIPTION =
  "A meter-aware writing app for poets and lyricists. Live syllable counts, rhyme schemes, and tone-filtered rhyme search in a distraction-free canvas.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "RhythmCraft",
  description: DESCRIPTION,
  applicationName: "RhythmCraft",
  keywords: ["poetry", "songwriting", "rhyme", "meter", "syllables", "lyrics"],
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "RhythmCraft",
    title: "RhythmCraft",
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: "RhythmCraft",
    description: DESCRIPTION,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F7F5F0" },
    { media: "(prefers-color-scheme: dark)", color: "#121214" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="parchment"
      className={`${newsreader.variable} ${inter.variable} ${geistMono.variable}`}
    >
      <body className="bg-[var(--bg)] text-[var(--text)] antialiased">
        {children}
      </body>
    </html>
  );
}
