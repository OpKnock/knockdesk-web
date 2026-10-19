import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { CodeBlock } from "../components/CodeBlock";
import { CopyButton } from "../components/CopyButton";
import { GITHUB, VERSION } from "../lib/site";

export const metadata: Metadata = {
  title: "Get KnockDesk",
  description: "Download KnockDesk for Windows 10 and 11, or the unsigned macOS bundles for Apple Silicon and Intel Macs. Verify the SHA-256 before installing.",
  alternates: { canonical: "/download" },
};

const RELEASE = "https://github.com/OpKnock/KnockDesk/releases/download/v3.1.12";
const WIN = {
  label: "Windows 10 and 11",
  detail: "64-bit installer, per-user, no admin rights needed",
  file: "KnockDesk-Setup-3.1.12-x64.exe",
  size: "779 MB",
  sha: "324952F682600CCA058CAA3857D0B13C6E57B0580CFA7E4960ACB914EFC9AF2C",
};
const MACS = [
  {
    label: "macOS, Apple Silicon",
    detail: "For M1, M2, M3, and M4 Macs",
    file: "KnockDesk-3.1.12-macOS-arm64.zip",
    size: "979 MB",
    sha: "C5D1DE21BB019A4E73D9F2257BD23BEB1F875BEE5BF992D13DBEF42617D57D8F",
  },
  {
    label: "macOS, Intel",
    detail: "For Intel-based Macs",
    file: "KnockDesk-3.1.12-macOS-x64.zip",
    size: "1022 MB",
    sha: "BDD86415978A85FC43ABD9A40A0A6EFC3BCB1C95919A68887CC8D3E4B9A1409B",
  },
];
const CLONE = "git lfs install\ngit clone https://github.com/OpKnock/KnockDesk.git\ncd KnockDesk\ngit lfs pull\nnpm run dev";

const reqs = [
  "Windows 10 1809 or later (64-bit), or macOS 11 or later",
  "8 GB RAM recommended (4 GB minimum)",
  "3 GB free disk space for the installed app",
  "A provider API key for the AI models you choose",
];

function shaCommand(file: string, platform: "win" | "mac") {
  return platform === "win"
    ? `certutil -hashfile ${file} SHA256`
    : `shasum -a 256 ${file}`;
}

export default function Download() {
  return (
    <main id="main" className="kd-container kd-page kd-doc">
      <Breadcrumbs trail={[{ label: "Get KnockDesk" }]} />
      <h1>Get KnockDesk</h1>
      <p className="kd-lead">
        Version {VERSION}. Free and open source. The download starts directly; you are
        not taken to a release page. Provider API costs may apply.
      </p>

      <div className="kd-card" style={{ marginBottom: 24, borderColor: "var(--kd-ink)", borderWidth: 2 }}>
        <h3 style={{ marginBottom: 8 }}>{WIN.label}</h3>
        <p style={{ marginBottom: 8 }}>{WIN.detail}.</p>
        <p style={{ marginBottom: 24, fontSize: "0.9375rem", color: "var(--kd-faint)" }}>
          {WIN.file} &middot; {WIN.size} &middot; SHA-256 {WIN.sha.slice(0, 16)}&hellip;
        </p>
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap", alignItems: "center" }}>
          <a href={`${RELEASE}/${WIN.file}`} className="kd-btn kd-btn-primary" rel="noopener noreferrer">
            Download for Windows
          </a>
          <CopyButton text={`${RELEASE}/${WIN.file}`} label="copy link" />
        </div>
        <p style={{ marginTop: 16, fontSize: "0.9375rem" }}>
          Verify the download, then run the installer:{" "}
          <code style={{ fontSize: "0.875rem" }}>{shaCommand(WIN.file, "win")}</code>
        </p>
        <p style={{ marginTop: 12, fontSize: "0.9375rem", color: "var(--kd-faint)" }}>
          The installer is not code signed yet. Windows SmartScreen will say the publisher is
          unknown; choose <strong>More info</strong>, then <strong>Run anyway</strong>.
          The SHA-256 above is the integrity check.
        </p>
      </div>

      <div className="kd-card" style={{ marginBottom: 24 }}>
        <h3 style={{ marginBottom: 8 }}>macOS 11 or later</h3>
        <p style={{ marginBottom: 24 }}>
          Unsigned bundles, awaiting validation on real Mac hardware. Unzip, move
          KnockDesk.app to Applications, then right click and choose Open on first launch.
        </p>
        {MACS.map((m) => (
          <div key={m.file} style={{ marginBottom: 16 }}>
            <h4 style={{ marginBottom: 4 }}>{m.label}</h4>
            <p style={{ marginBottom: 4, fontSize: "0.9375rem", color: "var(--kd-muted)" }}>{m.detail}.</p>
            <p style={{ marginBottom: 8, fontSize: "0.9375rem", color: "var(--kd-faint)" }}>
              {m.file} &middot; {m.size} &middot; SHA-256 {m.sha.slice(0, 16)}&hellip;
            </p>
            <div style={{ display: "flex", gap: 24, flexWrap: "wrap", alignItems: "center" }}>
              <a href={`${RELEASE}/${m.file}`} className="kd-btn" rel="noopener noreferrer">
                Download for {m.label.includes("Apple") ? "Apple Silicon" : "Intel"}
              </a>
              <CopyButton text={`${RELEASE}/${m.file}`} label="copy link" />
            </div>
          </div>
        ))}
        <p style={{ marginTop: 8, fontSize: "0.9375rem" }}>
          Verify with <code style={{ fontSize: "0.875rem" }}>{shaCommand(MACS[0].file, "mac")}</code>
        </p>
      </div>

      <div className="kd-card" style={{ marginBottom: 24 }}>
        <h3 style={{ marginBottom: 8 }}>Build from source</h3>
        <p style={{ marginBottom: 16 }}>
          Requires Node.js 22 or later, Git, Git LFS, and Python 3.11 for maintenance checks.
        </p>
        <CodeBlock code={CLONE} label="setup commands" />
        <p style={{ fontSize: "0.9375rem" }}>
          The source build is under active stabilization. It is not a signed or notarized
          release and is not yet certified as a feature-for-feature replacement for the
          packaged app.
        </p>
      </div>

      <h2 style={{ fontSize: "2rem", margin: "64px 0 24px" }}>System requirements</h2>
      <ul className="kd-legal" style={{ listStyle: "none" }}>
        {reqs.map((r) => (
          <li key={r} style={{ color: "var(--kd-muted)" }}>{r}</li>
        ))}
      </ul>

      <h2 style={{ fontSize: "2rem", margin: "64px 0 24px" }}>Before you run it</h2>
      <ul className="kd-legal">
        <li>Check that the SHA-256 above matches your download before installing.</li>
        <li>Add provider keys yourself in Settings, then AI Engine. Keep them out of screenshots and logs.</li>
        <li>Review computer-control actions before you grant access.</li>
      </ul>
      <p style={{ marginTop: 48 }}>
        Something not working? <Link href="/contact">Contact us</Link>, or read the{" "}
        <Link href="/guide">setup guide</Link>.
      </p>
    </main>
  );
}
