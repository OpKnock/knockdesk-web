import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { CodeBlock } from "../components/CodeBlock";
import { GITHUB } from "../lib/site";

export const metadata: Metadata = {
  title: "Guide",
  description: "Set up KnockDesk: run the Windows app or the source shell, add your API keys, and find where your data lives.",
  alternates: { canonical: "/guide" },
};

const CLONE = "git lfs install\ngit clone https://github.com/OpKnock/KnockDesk.git\ncd KnockDesk\ngit lfs pull\nnpm run dev";

export default function Guide() {
  return (
    <main id="main" className="kd-container kd-page kd-doc">
      <Breadcrumbs trail={[{ label: "Guide" }]} />
      <h1>Getting started</h1>
      <p className="kd-lead">Run KnockDesk, add a provider key, and know where your files live.</p>

      <h2>1. Run KnockDesk</h2>
      <h3>Packaged Windows app</h3>
      <p>On Windows 10 or 11, launch <code>KnockDesk.exe</code> from a trusted project distribution. Follow the first-run onboarding, configure the providers for the features you want, and start the assistant from the main interface.</p>
      <h3>Source shell on Windows or macOS</h3>
      <p>You need Node.js 22 or later with npm, Git and Git LFS, and Python 3.11 for maintenance checks. Runtime-backed assistant features also need a configured Hermes runtime.</p>
      <CodeBlock code={CLONE} label="setup commands" />
      <p>The launcher installs the locked workspaces, compiles the Electron main process, starts the renderer, and opens the app. Press Ctrl+C in the terminal to stop it.</p>
      <div className="kd-callout">
        <p><strong>macOS.</strong> Install a native Hermes CLI separately and set <code>KNOCKDESK_HERMES_EXE</code> to its absolute path before launching. The bundled legacy Hermes environment is not a portable macOS runtime.</p>
      </div>

      <h2>2. Add your API keys</h2>
      <ol>
        <li>Open <strong>Settings</strong>, then <strong>AI Engine</strong>.</li>
        <li>Add the key for the provider your feature needs: Google Gemini, OpenRouter, Groq, OpenAI, or Moonshot/Kimi.</li>
        <li>Select <strong>Save and Apply</strong>, then test the feature.</li>
      </ol>
      <p>Provider access, quotas, and pricing are set by each provider and can change. Treat keys as secrets: keep them out of screenshots and logs, and never commit them to source control.</p>

      <h2>3. Where your data lives</h2>
      <p>On a typical Windows setup:</p>
      <ul className="kd-legal">
        <li><code>Documents\KnockDesk Data\</code> holds persona files such as SOUL.md, memory files, and custom skills.</li>
        <li><code>Documents\KnockDesk_Vault\</code> is the file vault.</li>
        <li>The app user-data folder holds chats, contacts, notes, tasks, and settings.</li>
      </ul>
      <p>Exact paths can vary by build and configuration.</p>

      <h2>4. Use computer control safely</h2>
      <p>Computer control needs the right provider configuration and operating-system permissions. Review actions before you grant control, and avoid giving automation access to sensitive accounts or data unless you need to.</p>

      <h2>Need help?</h2>
      <p>Check the <a href={`${GITHUB}/blob/main/docs/PRODUCT_READINESS_AUDIT.md`} rel="noopener noreferrer">product readiness audit</a> for known gaps, or <Link href="/contact">contact us</Link>.</p>
    </main>
  );
}
