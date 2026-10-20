import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { CodeBlock } from "../components/CodeBlock";
import { CopyButton } from "../components/CopyButton";
import { GITHUB, VERSION } from "../lib/site";

export const metadata: Metadata = {
  title: "Get KnockDesk",
  description: "Download KnockDesk 3.1.12 for Windows 10 and 11, or the unsigned macOS bundles for Apple Silicon and Intel Macs. Verify the SHA-256 before installing.",
  alternates: { canonical: "/download" },
};

const RELEASE = "https://github.com/OpKnock/KnockDesk/releases/download/v3.1.12";

type Build = {
  os: string;
  label: string;
  detail: string;
  file: string;
  size: string;
  sha: string;
  cta: string;
  check: string;
  note: string;
};

const BUILDS: Build[] = [
  {
    os: "Windows",
    label: "Windows 10 and 11",
    detail: "64-bit. Installer runs per user, no administrator rights needed.",
    file: "KnockDesk-Setup-3.1.12-x64.exe",
    size: "780 MB",
    sha: "23E2680B15F8DC551956CA269931C33AEDEC0B70347EAA0330661259C638403F",
    cta: "Download for Windows",
    check: "certutil -hashfile KnockDesk-Setup-3.1.12-x64.exe SHA256",
    note: "The installer is not code signed yet, so SmartScreen will say the publisher is unknown. Choose More info, then Run anyway. The SHA-256 below is the integrity check.",
  },
  {
    os: "Windows",
    label: "Windows 10 and 11, MSIX package",
    detail: "The same app as an MSIX package. Installs and uninstalls cleanly with no admin rights and no leftover files, and it updates in place. Needs Windows 10 1809 or later.",
    file: "KnockDesk-3.1.12-x64.msix",
    size: "292 MB",
    sha: "33A447878A116379006103BD520F6F864A3DEAFC7DA7CA95717A47833F0F2F6A",
    cta: "Download MSIX for Windows",
    check: "Get-FileHash KnockDesk-3.1.12-x64.msix -Algorithm SHA256",
    note: "The package is Authenticode-signed and RFC 3161-timestamped. Its certificate chains to Codegic Root CA G2, which is not in Microsoft's Trusted Root Program, so Windows will warn that the publisher is unknown before installing. The SHA-256 below is the integrity check. This is the same Windows build as the installer above, not a separate one.",
  },
  {
    os: "macOS",
    label: "macOS, Apple Silicon",
    detail: "For M1, M2, M3, and M4 Macs. macOS 11 or later.",
    file: "KnockDesk-3.1.12-macOS-arm64.zip",
    size: "979 MB",
    sha: "C5D1DE21BB019A4E73D9F2257BD23BEB1F875BEE5BF992D13DBEF42617D57D8F",
    cta: "Download for Apple Silicon",
    check: "shasum -a 256 KnockDesk-3.1.12-macOS-arm64.zip",
    note: "Unzip, move KnockDesk.app to Applications, then right-click and choose Open the first time. The bundle is unsigned and un-notarized while signing is being sorted out.",
  },
  {
    os: "macOS",
    label: "macOS, Intel",
    detail: "For Intel-based Macs. macOS 11 or later.",
    file: "KnockDesk-3.1.12-macOS-x64.zip",
    size: "1022 MB",
    sha: "BDD86415978A85FC43ABD9A40A0A6EFC3BCB1C95919A68887CC8D3E4B9A1409B",
    cta: "Download for Intel",
    check: "shasum -a 256 KnockDesk-3.1.12-macOS-x64.zip",
    note: "Unzip, move KnockDesk.app to Applications, then right-click and choose Open the first time. The bundle is unsigned and un-notarized while signing is being sorted out.",
  },
];

const CLONE = "git lfs install\ngit clone https://github.com/OpKnock/KnockDesk.git\ncd KnockDesk\ngit lfs pull\nnpm run dev";

const reqs = [
  "Windows 10 1809 or later (64-bit), or macOS 11 or later",
  "8 GB RAM recommended (4 GB minimum)",
  "3 GB free disk space for the installed app",
  "A provider API key for the AI models you choose",
];


export default function Download() {
  return (
    <main id="main" className="kd-container kd-page kd-doc">
      <div className="kd-page-top">
        <Breadcrumbs trail={[{ label: "Get KnockDesk" }]} />
      </div>
      <h1>Get KnockDesk</h1>
      <p className="kd-lead">
        Version {VERSION}. Free and open source. Pick your system below; the
        download starts immediately and you are not taken to a release page.
      </p>

      <div className="kd-builds">
        {BUILDS.map((b) => (
          <article key={b.file} className="kd-build">
            <header>
              <p className="kd-build-os">{b.os}</p>
              <h2>{b.label}</h2>
              <p className="kd-build-detail">{b.detail}</p>
            </header>
            <p className="kd-build-meta">
              {b.file} &middot; {b.size}
            </p>
            <div className="kd-build-actions">
              <a href={`${RELEASE}/${b.file}`} className="kd-btn kd-btn-primary" rel="noopener noreferrer">
                {b.cta}
              </a>
              <CopyButton text={`${RELEASE}/${b.file}`} label="copy link" />
            </div>
            <p className="kd-build-check">
              Verify it after downloading: <code>{b.check}</code>
            </p>
            <p className="kd-build-sha">
              SHA-256 <code>{b.sha}</code>
            </p>
            <p className="kd-build-note">{b.note}</p>
          </article>
        ))}
      </div>

      <h2>After you install it</h2>
      <ol className="kd-doc-list">
        <li>Check that the SHA-256 above matches your download.</li>
        <li>Launch the app and follow the first-run onboarding.</li>
        <li>Add your provider key in Settings, then AI Engine. Keep keys out of screenshots and logs.</li>
        <li>Turn on voice or computer control only when you want them.</li>
      </ol>
      <p>
        Stuck? Read the <Link href="/guide">setup guide</Link> or{" "}
        <Link href="/contact">contact us</Link>. The macOS bundles are awaiting
        validation on real hardware, so if something looks off there, tell us
        and we will fix it in the next build.
      </p>

      <div className="kd-card kd-card-src">
        <h2>Build from source</h2>
        <p>
          Requires Node.js 22 or later, Git with Git LFS, and Python 3.11 for
          maintenance checks. The source shell runs on Windows and macOS.
        </p>
        <CodeBlock code={CLONE} label="setup commands" />
        <p>
          The source build is under active stabilization and is not a signed
          release. For the packaged experience, use the installers above.
        </p>
      </div>

      <h2>System requirements</h2>
      <ul className="kd-legal" style={{ listStyle: "none" }}>
        {reqs.map((r) => (
          <li key={r} style={{ color: "var(--kd-muted)" }}>{r}</li>
        ))}
      </ul>
      <p style={{ marginTop: 32 }}>
        Every release is published with checksums on the{" "}
        <a href={`${GITHUB}/releases`} rel="noopener noreferrer">releases page</a>.
      </p>
    </main>
  );
}
