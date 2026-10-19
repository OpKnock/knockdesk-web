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
    size: "779 MB",
    sha: "324952F682600CCA058CAA3857D0B13C6E57B0580CFA7E4960ACB914EFC9AF2C",
    cta: "Download for Windows",
    check: "certutil -hashfile KnockDesk-Setup-3.1.12-x64.exe SHA256",
    note: "The installer is not code signed yet, so SmartScreen will say the publisher is unknown. Choose More info, then Run anyway. The SHA-256 below is the integrity check.",
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

function GithubMark() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.09.68-.22.68-.49v-1.7c-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.89 1.58 2.34 1.12 2.91.86.09-.67.35-1.13.63-1.39-2.22-.26-4.56-1.14-4.56-5.08 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05a9.4 9.4 0 0 1 5 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.95-2.35 4.82-4.58 5.08.36.32.68.94.68 1.92v2.84c0 .27.18.59.69.49A10.06 10.06 0 0 0 22 12.25C22 6.58 17.52 2 12 2z" />
    </svg>
  );
}

export default function Download() {
  return (
    <main id="main" className="kd-container kd-page kd-doc">
      <div className="kd-page-top">
        <Breadcrumbs trail={[{ label: "Get KnockDesk" }]} />
        <a className="kd-source" href={GITHUB} rel="noopener noreferrer">
          <GithubMark />
          View source on GitHub
        </a>
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
