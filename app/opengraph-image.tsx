import { ImageResponse } from "next/og";

export const alt = "KnockDesk, a local-first AI assistant for Windows";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: 96, background: "#ffffff", color: "#0b0b0c" }}>
        <div style={{ display: "flex", alignItems: "center", marginBottom: 48 }}>
          <svg width="88" height="88" viewBox="0 0 443 443">
            <defs><mask id="m"><rect width="443" height="443" fill="#fff" /><circle cx="222" cy="206" r="166" fill="#000" /><rect y="215" width="443" height="44" fill="#fff" /></mask></defs>
            <rect width="443" height="443" rx="110" fill="#0b0b0c" mask="url(#m)" />
          </svg>
          <div style={{ display: "flex", fontSize: 44, fontWeight: 700, marginLeft: 24 }}>KnockDesk</div>
        </div>
        <div style={{ display: "flex", fontSize: 88, fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.05 }}>Your AI assistant, without the cloud.</div>
        <div style={{ display: "flex", fontSize: 32, color: "#3d3d44", marginTop: 32 }}>Free and open source. Runs on your PC.</div>
        <div style={{ position: "absolute", left: 0, bottom: 0, width: 1200, height: 16, background: "#c93a12", display: "flex" }} />
      </div>
    ),
    size
  );
}
