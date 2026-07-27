import { ImageResponse } from "next/og";

export const alt = "RhythmCraft — a meter-aware writing app for poets and lyricists";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#F7F5F0",
          color: "#2B2A27",
        }}
      >
        <div
          style={{
            fontSize: 76,
            letterSpacing: 18,
            fontWeight: 700,
            textTransform: "uppercase",
          }}
        >
          RhythmCraft
        </div>

        <div
          style={{
            marginTop: 28,
            fontSize: 30,
            color: "#6B665C",
            letterSpacing: 1,
          }}
        >
          A meter-aware writing app for poets and lyricists
        </div>

        <div style={{ display: "flex", marginTop: 60, gap: 20 }}>
          {["Syllables", "Meter", "Rhyme scheme", "Tone"].map((label) => (
            <div
              key={label}
              style={{
                display: "flex",
                fontSize: 22,
                color: "#8A8272",
                border: "1px solid #D9D3C6",
                borderRadius: 999,
                padding: "10px 26px",
              }}
            >
              {label}
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: 64,
            fontSize: 24,
            color: "#C4A882",
            letterSpacing: 6,
          }}
        >
          u / u / u / u /
        </div>
      </div>
    ),
    size
  );
}
