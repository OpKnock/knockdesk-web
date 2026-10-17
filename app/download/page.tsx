import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { CopyButton } from "../components/CopyButton";
import { GITHUB, VERSION } from "../lib/site";

export const metadata: Metadata = {
  title: "Download",
  description: "Download KnockDesk for Windows. Free, open source, no account required.",
  alternates: { canonical: "/download" },
};

const UTM = "?utm_source=knockdesk-website&utm_medium=download";
const CMD = `certutil -hashfile KnockDesk-Setup-${VERSION}-x64.exe SHA256`;
const reqs = [
  "Windows 10 1809 or later (64-bit)",
  "8 GB RAM recommended (4 GB minimum)",
  "3 GB free disk space",
  "Internet connection for AI providers (optional for browsing the interface)",
];

export default function Download() {
  return (
    <main id="main" className="kd-container kd-page">
      <Breadcrumbs trail={[{ label: "Download" }]} />
      <h1>Download KnockDesk</h1>
      <p className="kd-lead">Free and open source. No account required. Your data stays on your PC.</p>

      <div className="kd-card" style={{ marginBottom: 24, borderColor: "var(--kd-ink)", borderWidth: 2 }}>
        <h3 style={{ marginBottom: 8 }}>Windows 10 and later (64-bit)</h3>
        <p style={{ marginBottom: 24 }}>Version {VERSION}. Installer size: 762 MB. Installed size: 2.7 GB.</p>
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap", alignItems: "center" }}>
          <a href={`${GITHUB}/releases/latest${UTM}`} className="kd-btn kd-btn-primary" rel="noopener noreferrer">Download installer</a>
          <a href={GITHUB} className="kd-link" rel="noopener noreferrer">View source on GitHub</a>
        </div>
        <p style={{ marginTop: 24, fontSize: "0.9375rem", color: "var(--kd-faint)" }}>SHA-256 checksum published alongside the installer. Verify before installing.</p>
      </div>

      <div className="kd-card" style={{ marginBottom: 24 }}>
        <h3 style={{ marginBottom: 8 }}>macOS 11 or later</h3>
        <p style={{ marginBottom: 16 }}>Native app bundles for Apple Silicon (arm64) and Intel Macs. Version {VERSION}. Bundle size: about 1 GB per architecture.</p>
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap", alignItems: "center" }}>
          <a href={`${GITHUB}/releases/tag/v${VERSION}${UTM}`} className="kd-btn kd-btn-primary" rel="noopener noreferrer">Download for macOS</a>
        </div>
        <p style={{ marginTop: 16, fontSize: "0.9375rem", color: "var(--kd-faint)" }}>Bundles are unsigned. After unzipping, right click KnockDesk.app and choose Open on first launch. Checksums are published on the release page.</p>
      </div>

      <h2 style={{ fontSize: "2rem", margin: "64px 0 24px" }}>System requirements</h2>
      <ul className="kd-legal" style={{ listStyle: "none" }}>
        {reqs.map((r) => (<li key={r} style={{ color: "var(--kd-muted)" }}>{r}</li>))}
      </ul>

      <h2 style={{ fontSize: "2rem", margin: "64px 0 24px" }}>How to verify the download</h2>
      <p style={{ marginBottom: 16 }}>Every release includes a SHA-256 checksum. Verify yours matches:</p>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "stretch" }}>
        <code style={{ flex: "1 1 320px", padding: 16, background: "var(--kd-soft)", border: "1px solid var(--kd-border)", borderRadius: 4, fontSize: "0.875rem", overflowX: "auto", whiteSpace: "nowrap" }}>{CMD}</code>
        <CopyButton text={CMD} label="verify command" />
      </div>
      <p style={{ marginTop: 16, fontSize: "0.9375rem" }}>Compare the output against the checksum on the GitHub Release page.</p>
      <p style={{ marginTop: 48 }}>Questions before you install? <Link href="/contact">Contact us</Link>.</p>
    </main>
  );
}
