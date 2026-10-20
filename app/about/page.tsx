import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { GITHUB } from "../lib/site";

export const metadata: Metadata = {
  title: "About",
  description: "KnockDesk is an open-source, local-first AI workspace built by OpKnock. Learn what it is, how it treats your data, and what it is built on.",
  alternates: { canonical: "/about" },
};

const credits = ["Hermes-Agent runtime (MIT)", "Electron and Chromium", "Node.js and Python", "React", "AgentTown", "Baileys", "Tesseract OCR", "Playwright"];

export default function About() {
  return (
    <main id="main" className="kd-container kd-page kd-doc">
      <div className="kd-page-top">
        <Breadcrumbs trail={[{ label: "About" }]} />
        <a className="kd-source" href={GITHUB} rel="noopener noreferrer">
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.09.68-.22.68-.49v-1.7c-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.89 1.58 2.34 1.12 2.91.86.09-.67.35-1.13.63-1.39-2.22-.26-4.56-1.14-4.56-5.08 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05a9.4 9.4 0 0 1 5 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.95-2.35 4.82-4.58 5.08.36.32.68.94.68 1.92v2.84c0 .27.18.59.69.49A10.06 10.06 0 0 0 22 12.25C22 6.58 17.52 2 12 2z" /></svg>
          View source on GitHub
        </a>
      </div>
      <h1 data-reveal="split">About KnockDesk</h1>
      <p className="kd-lead">A JARVIS-inspired AI workspace that feels personal and helps you get practical work done on your computer.</p>

      <h2>What it is</h2>
      <p>KnockDesk is a local-first desktop assistant. It brings voice interaction, configurable personas, persistent memory, skills, resident agents, world-monitoring tools, and computer-use capabilities into one workspace.</p>

      <h2>How it treats your data</h2>
      <p>Local files and supported runtime data are stored on your computer by default, and your persona and memory files stay open for you to inspect and manage. KnockDesk is local-first, not universally offline. Voice transcription, AI responses, news and map tools, messaging integrations, and remote bridges may talk to external services, and each one follows that service&apos;s own policies.</p>
      <p>Read the <Link href="/privacy">privacy policy</Link> for the details.</p>

      <h2>Who builds it</h2>
      <p>KnockDesk is built and published by OpKnock, an independent developer. The source is public on <a href={GITHUB} rel="noopener noreferrer">GitHub</a>, along with a security policy for reporting vulnerabilities.</p>

      <div className="kd-callout">
        <p><strong>Current status.</strong> The repository holds a maintained source desktop shell and a separately preserved packaged Windows app. The source build is under active stabilization and is not yet certified as a replacement for every screen and integration in the packaged app.</p>
      </div>

      <h2>Built on open source</h2>
      <p>KnockDesk builds on upstream projects and third-party components. Each keeps its own license and notices.</p>
      <ul className="kd-chips">{credits.map((c) => <li key={c}>{c}</li>)}</ul>

      <h2>License</h2>
      <p>First-party KnockDesk code is licensed under Apache-2.0. Third-party components keep their own licenses. See NOTICE.md in the repository before redistributing a build.</p>
      <p style={{ marginTop: 40 }}><Link href="/contact" className="kd-link">Contact OpKnock</Link></p>
    </main>
  );
}
