import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { CodeBlock } from "../components/CodeBlock";
import { CopyButton } from "../components/CopyButton";
import { GITHUB, VERSION } from "../lib/site";

export const metadata: Metadata = {
  title: "Get KnockDesk",
  description: "Download KnockDesk 3.1.12 for Windows 10 and 11, or the macOS bundles for Apple Silicon and Intel Macs. Verify the SHA-256 before installing.",
  alternates: { canonical: "/download" },
};

const RELEASE = "https://github.com/OpKnock/KnockDesk/releases/download/v3.1.12";

type Build = {
  os: "Windows" | "macOS";
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
    label: "Windows installer",
    detail: "64-bit. Runs per user, no administrator rights needed.",
    file: "KnockDesk-Setup-3.1.12-x64.exe",
    size: "782 MB",
    sha: "8D0A0DA0563954C2F24FC91A324B447E0F899520B773593C70ADF63323CEE1A6",
    cta: "Download for Windows",
    check: "certutil -hashfile KnockDesk-Setup-3.1.12-x64.exe SHA256",
    note: "Authenticode-signed and RFC 3161-timestamped. The certificate chains to Codegic Root CA G2, which is not in Microsoft's Trusted Root Program, so Windows shows the publisher as unknown before installing. Choose More info, then Run anyway. The SHA-256 below is the integrity check.",
  },
  {
    os: "Windows",
    label: "Windows MSIX package",
    detail: "The same build as an MSIX, with the package identity and publisher Microsoft assigned to the Partner Center account. Needs Windows 10 1809 or later. Larger than the installer because the package format compresses each file on its own.",
    file: "KnockDesk-3.1.12-x64.msix",
    size: "1093 MB",
    sha: "6CE0EB2250DDDBC7110E7ACDE5F61F8251BF7FEA495CF373D1AF2A7C8D9586FA",
    cta: "Download MSIX for Windows",
    check: "Get-FileHash KnockDesk-3.1.12-x64.msix -Algorithm SHA256",
    note: "This is the Microsoft Store package, submitted unsigned so Microsoft can sign it. Once the Store listing is live it installs from the Store with a trusted signature, no admin rights, no leftovers, and in-place updates. The unsigned package is here for reference; to install it directly, turn on Developer Mode and use Add-AppxPackage. For an ordinary install, use the installer above.",
  },
  {
    os: "macOS",
    label: "macOS, Apple Silicon",
    detail: "For M1, M2, M3, and M4 Macs. macOS 11 or later.",
    file: "KnockDesk-3.1.12-macOS-arm64.zip",
    size: "1035 MB",
    sha: "5A31E1F3AE147FF522455248A852A76C870A54DA80305EA2332A6D067FD04CE7",
    cta: "Download for Apple Silicon",
    check: "shasum -a 256 KnockDesk-3.1.12-macOS-arm64.zip",
    note: "Unzip, move KnockDesk.app to Applications, then right-click and choose Open the first time. The bundle is unsigned and un-notarized while signing is being sorted out.",
  },
  {
    os: "macOS",
    label: "macOS, Intel",
    detail: "For Intel-based Macs. macOS 11 or later.",
    file: "KnockDesk-3.1.12-macOS-x64.zip",
    size: "1078 MB",
    sha: "501C3E3F4441CD13E4FB53F59F076D03EFBFADF6AEB54F7F76E8AE594FA09838",
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

function WindowsMark() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M3 5.44 10.53 4.6v7.02H3V5.44Zm0 13.12L10.53 19.4v-7.02H3v6.18Zm8.61-14.13L21 3.3v8.32h-9.37V4.43Zm0 15.14V11.6H21v8.32l-9.37-1.09Z" />
    </svg>
  );
}

function AppleMark() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M16.36 12.75c-.02-2.2 1.8-3.26 1.88-3.32-1.03-1.51-2.62-1.72-3.18-1.73-1.35-.14-2.65.8-3.33.8-.69 0-1.75-.78-2.88-.75-1.48.02-2.85.86-3.6 2.19-1.54 2.66-.4 6.6 1.1 8.76.73 1.06 1.6 2.25 2.75 2.2 1.1-.04 1.52-.71 2.85-.71 1.32 0 1.7.71 2.87.69 1.18-.02 1.93-1.08 2.65-2.14.83-1.23 1.18-2.42 1.2-2.48-.03-.01-2.3-.88-2.31-3.51Zm-2.4-7.15c.6-.72 1-1.75.88-2.76-.86.04-1.9.58-2.53 1.3-.56.65-1.05 1.7-.92 2.7.97.07 1.96-.49 2.57-1.24Z" />
    </svg>
  );
}

function GithubMark() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.09.68-.22.68-.49v-1.7c-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.89 1.58 2.34 1.12 2.91.86.09-.67.35-1.13.63-1.39-2.22-.26-4.56-1.14-4.56-5.08 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05a9.4 9.4 0 0 1 5 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.95-2.35 4.82-4.58 5.08.36.32.68.94.68 1.92v2.84c0 .27.18.59.69.49A10.06 10.06 0 0 0 22 12.25C22 6.58 17.52 2 12 2z" />
    </svg>
  );
}

export default function Download() {
  return (
    <main id="main" className="kd-container kd-page kd-doc kd-wide">
      <div className="kd-page-top">
        <Breadcrumbs trail={[{ label: "Get KnockDesk" }]} />
        <a className="kd-source" href={GITHUB} rel="noopener noreferrer">
          <GithubMark />
          View source on GitHub
        </a>
      </div>
      <h1 data-reveal="split">Get KnockDesk</h1>
      <p className="kd-lead">
        Version {VERSION}. Free and open source. Pick your system below; the
        download starts immediately and you are not taken to a release page.
      </p>

      <div className="kd-builds">
        {BUILDS.map((b) => (
          <article key={b.file} className="kd-build" data-reveal="card">
            <header>
              <p className="kd-build-os">
                {b.os === "Windows" ? <WindowsMark /> : <AppleMark />}
                {b.os}
              </p>
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

      <h2>Windows may warn you before it installs</h2>
      <p>
        The Windows build is code signed and timestamped, but the certificate
        chains to a root that is not part of the Microsoft Trusted Root Program.
        Windows cannot vouch for a publisher it does not recognise, so it shows
        a SmartScreen warning instead of installing straight away. This is what
        you will see, and it is expected.
      </p>
      <div className="kd-help-shots">
        <figure>
          <img
            src="/help/windows-smartscreen-blocked.svg"
            width={640}
            height={420}
            alt="The Windows SmartScreen dialog reading: Windows protected your PC. Microsoft Defender SmartScreen prevented an unrecognized app from starting, with buttons for Don't run and More info."
            loading="lazy"
            decoding="async"
          />
          <figcaption>
            The warning appears the first time you run the installer. Click{" "}
            <strong>More info</strong>.
          </figcaption>
        </figure>
        <figure>
          <img
            src="/help/windows-smartscreen-run-anyway.svg"
            width={640}
            height={420}
            alt="The same SmartScreen dialog after More info is clicked. The app name and publisher are shown, and a Run anyway button appears in place of More info."
            loading="lazy"
            decoding="async"
          />
          <figcaption>
            The dialog expands and shows the file name and publisher. Click{" "}
            <strong>Run anyway</strong>.
          </figcaption>
        </figure>
      </div>
      <div className="kd-callout">
        <p>
          <strong>Run anyway is safe here.</strong> It tells Windows to proceed
          with an app it cannot verify, so it is only reasonable once you have
          checked the SHA-256 above against the value published on the release.
          If those two do not match, stop and do not install the file.
        </p>
      </div>

      <h2>macOS will ask you to open the app manually</h2>
      <p>
        The macOS bundles are not signed with an Apple Developer ID and are not
        notarized yet, so Gatekeeper blocks them on first launch. This is a
        known, expected step while signing is being sorted out.
      </p>
      <div className="kd-help-shots">
        <figure>
          <img
            src="/help/macos-gatekeeper-blocked.svg"
            width={640}
            height={400}
            alt="The macOS dialog reading: KnockDesk can't be opened. Apple cannot check it for malicious software. The developer of KnockDesk.app can't be verified, with an OK button and an Open button."
            loading="lazy"
            decoding="async"
          />
          <figcaption>
            Gatekeeper blocks the app on first launch because there is no
            Developer ID on it.
          </figcaption>
        </figure>
        <figure>
          <img
            src="/help/macos-gatekeeper-open.svg"
            width={640}
            height={400}
            alt="The same macOS Gatekeeper dialog with the Open button highlighted."
            loading="lazy"
            decoding="async"
          />
          <figcaption>
            Right-click the app in Finder, choose{" "}
            <strong>Open</strong>, then confirm with <strong>Open</strong>.
          </figcaption>
        </figure>
      </div>
      <p>
        If the app is already in Applications, control-click its icon in the
        Finder rather than double-clicking it, choose <strong>Open</strong>,
        and confirm. macOS remembers the choice, so it launches normally from
        then on. You can also allow it in System Settings under Privacy and
        Security, under Open Anyway.
      </p>

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
