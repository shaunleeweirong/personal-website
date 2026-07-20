import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Shaun Lee Wei Rong — I build things that work";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "#05060f",
          color: "#fff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 22, letterSpacing: 4, color: "#67e8f9", marginBottom: 24 }}>SHAUN LEE WEI RONG</div>
        <div style={{ fontSize: 64, fontWeight: 800, lineHeight: 1.1 }}>I build things that work —</div>
        <div
          style={{
            fontSize: 64,
            fontWeight: 800,
            lineHeight: 1.1,
            background: "linear-gradient(90deg,#a78bfa,#22d3ee)",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          products, businesses, teams.
        </div>
        <div style={{ fontSize: 24, color: "#8890a4", marginTop: 28 }}>
          LinkedIn · Amazon · ByteDance — exited founder, 20+ products shipped
        </div>
      </div>
    ),
    size
  );
}
