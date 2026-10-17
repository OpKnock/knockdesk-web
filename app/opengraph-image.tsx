import { ImageResponse } from "next/og";

export const alt = "KnockDesk, a local-first AI assistant for Windows";
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
          background: "#05070b",
          color: "#f2f4f7",
        }}
      >
        <div
          style={{
            width: 120,
            height: 120,
            borderRadius: 20,
            border: "6px solid #00e5ff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 48,
          }}
        >
          <div style={{ width: 40, height: 40, borderRadius: 40, border: "6px solid #00e5ff" }} />
        </div>
        <div style={{ display: "flex", fontSize: 88, fontWeight: 700, letterSpacing: "-0.02em" }}>
          KnockDesk
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 34,
            color: "rgba(242,244,247,0.6)",
            marginTop: 24,
          }}
        >
          Your AI assistant, without the cloud
        </div>
        <div style={{ display: "flex", fontSize: 24, color: "#00e5ff", marginTop: 40, letterSpacing: "0.2em" }}>
          KNOCKDESK.APP
        </div>
      </div>
    ),
    size
  );
}
