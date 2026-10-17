import type { Metadata } from "next";
import { Nav } from "../components/Nav";
import { Footer } from "../components/Footer";
import { BackToTop } from "../components/BackToTop";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { CopyButton } from "../components/CopyButton";

export const metadata: Metadata = {
  title: "Download",
  description: "Download KnockDesk for Windows. Free, open source, no account required.",
  alternates: { canonical: "/download" },
};

const GITHUB = "https://github.com/OpKnock/KnockDesk";
const UTM = "?utm_source=knockdesk-website&utm_medium=download";

export default function Download() {
  return (
    <>
      <Nav />
      <main id="main" className="kd-container" style={{ paddingTop: "96px", paddingBottom: "96px", maxWidth: "720px" }}>
        <Breadcrumbs trail={[{ label: "Download" }]} />
        <h1 style={{ marginBottom: "16px" }}>Download KnockDesk</h1>
        <p style={{ fontSize: "1.125rem", marginBottom: "48px" }}>
          Free and open source. No account required. Your data stays on your PC.
        </p>

        <div className="kd-card" style={{ marginBottom: "24px", borderColor: "rgba(0,229,255,0.2)" }}>
          <h3 style={{ marginBottom: "8px" }}>Windows 10 and later (64-bit)</h3>
          <p style={{ fontSize: "0.9375rem", marginBottom: "16px" }}>
            Version 3.1.12. Installer size: 772 MB. Installed size: 2.7 GB.
          </p>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <a
              href={`${GITHUB}/releases/latest${UTM}`}
              className="kd-btn kd-btn-primary"
              style={{ textDecoration: "none" }}
              rel="noopener"
            >
              Download installer
            </a>
            <a
              href={GITHUB}
              className="kd-btn kd-btn-secondary"
              style={{ textDecoration: "none" }}
              rel="noopener"
            >
              View source on GitHub
            </a>
          </div>
          <p style={{ marginTop: "16px", fontSize: "0.8125rem", color: "var(--kd-faint)" }}>
            SHA-256 checksum published alongside the installer. Verify before installing.
          </p>
        </div>

        <div className="kd-card" style={{ marginBottom: "24px", borderColor: "var(--kd-border)" }}>
          <h3 style={{ marginBottom: "8px" }}>macOS</h3>
          <p style={{ fontSize: "0.9375rem", marginBottom: "16px" }}>
            In development. Native app bundle for Apple Silicon and Intel Macs.
          </p>
          <span style={{ fontSize: "0.875rem", color: "var(--kd-acc)" }}>Coming soon</span>
        </div>

        <h2 style={{ marginTop: "48px", marginBottom: "16px", fontSize: "1.5rem" }}>System requirements</h2>
        <div className="kd-card">
          <ul style={{ listStyle: "none", padding: 0 }}>
            {[
              "Windows 10 1809 or later (64-bit)",
              "8 GB RAM recommended (4 GB minimum)",
              "3 GB free disk space",
              "Internet connection for AI providers (optional for browsing the interface)",
            ].map((req) => (
              <li key={req} style={{ display: "flex", gap: "12px", alignItems: "baseline", padding: "8px 0", fontSize: "0.9375rem", color: "var(--kd-muted)" }}>
                <span style={{ color: "var(--kd-acc)" }}>{"\u2022"}</span>
                {req}
              </li>
            ))}
          </ul>
        </div>

        <h2 style={{ marginTop: "48px", marginBottom: "16px", fontSize: "1.5rem" }}>How to verify the download</h2>
        <div className="kd-card">
          <p style={{ fontSize: "0.9375rem", marginBottom: "12px" }}>
            Every release includes a SHA-256 checksum. Verify yours matches:
          </p>
          <div style={{ display: "flex", gap: "12px", alignItems: "stretch", flexWrap: "wrap" }}>
            <code style={{ flex: "1 1 320px", padding: "16px", background: "var(--kd-surface2)", borderRadius: "4px", fontSize: "0.8125rem", color: "var(--kd-acc)", overflowX: "auto", fontFamily: "ui-monospace, monospace" }}>
              certutil -hashfile KnockDesk-Setup-3.1.12-x64.exe SHA256
            </code>
            <div style={{ display: "flex", alignItems: "center" }}>
              <CopyButton text="certutil -hashfile KnockDesk-Setup-3.1.12-x64.exe SHA256" label="verify command" />
            </div>
          </div>
          <p style={{ marginTop: "12px", fontSize: "0.875rem" }}>
            Compare the output against the checksum on the GitHub Release page.
          </p>
        </div>
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
