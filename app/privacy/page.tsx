import type { Metadata } from "next";
import { Nav } from "../components/Nav";
import { Footer } from "../components/Footer";
import { BackToTop } from "../components/BackToTop";
import { Breadcrumbs } from "../components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "KnockDesk privacy policy. All data stays on your PC. No tracking, no telemetry, no cloud backend.",
  alternates: { canonical: "/privacy" },
};

export default function Privacy() {
  return (
    <>
      <Nav />
      <main id="main" className="kd-container kd-legal" style={{ paddingTop: "96px", paddingBottom: "96px", maxWidth: "720px" }}>
        <Breadcrumbs trail={[{ label: "Privacy Policy" }]} />
        <h1 style={{ marginBottom: "8px", fontSize: "2.5rem" }}>Privacy Policy</h1>
        <p style={{ marginBottom: "48px", fontSize: "0.875rem", color: "var(--kd-faint)" }}>
          Effective: October 17, 2026. Contact: wagdemehul@gmail.com
        </p>

        <h2>Summary</h2>
        <p>
          KnockDesk runs on your PC. Your settings, memories, and chat history stay on your machine.
          We do not operate a cloud backend, we do not collect analytics, and we do not track you.
        </p>

        <h2>What stays on your PC</h2>
        <ul>
          <li><strong>Settings, themes, voice choices:</strong> stored in your AppData folder.</li>
          <li><strong>API keys:</strong> encrypted with Windows DPAPI. Never written to logs.</li>
          <li><strong>Chat history and memories:</strong> local JSON and SQLite files.</li>
          <li><strong>Screenshots and captures:</strong> saved to your Downloads folder.</li>
        </ul>

        <h2>What leaves your PC</h2>
        <p>
          Only two things can leave your machine, and both are under your control:
        </p>
        <ul>
          <li><strong>AI provider requests:</strong> when you send a prompt, it goes directly to your chosen provider (Google Gemini, OpenRouter, etc.) using the API key you provided. That provider has its own privacy policy.</li>
          <li><strong>Update checks:</strong> if you enable automatic updates, the app checks a version feed. No personal data is sent.</li>
        </ul>

        <h2>Microphone, camera, and screen</h2>
        <p>
          These are used only when you explicitly start a feature that needs them (voice chat, screen capture, computer automation). KnockDesk performs no background recording. Audio and screen content is processed locally or sent to your chosen AI provider per your request.
        </p>

        <h2>What we do not do</h2>
        <ul>
          <li>No telemetry or analytics collection</li>
          <li>No advertising or cross-site tracking</li>
          <li>No sale or sharing of your data</li>
          <li>No cloud account required</li>
          <li>No background data collection</li>
        </ul>

        <h2>Retention and deletion</h2>
        <p>
          Your data stays on your PC until you delete it. Uninstalling KnockDesk preserves your AppData folder. To erase everything, uninstall the app and then delete the folder <code style={{ color: "var(--kd-acc)", fontSize: "0.875rem" }}>%APPDATA%\stonic_gen3</code>.
        </p>

        <h2>Generative AI disclosure</h2>
        <p>
          Responses from KnockDesk are machine-generated and can be wrong. Verify important information independently. Report unsafe or abusive outputs via the contact page so provider settings can be adjusted.
        </p>

        <h2>Children</h2>
        <p>
          KnockDesk is not directed at children under 13. We do not knowingly collect personal information from children.
        </p>

        <h2>India: DPDP Act disclosure</h2>
        <p>
          For users in India, this site and the KnockDesk app are designed to comply with the Digital Personal Data Protection Act, 2023. This website collects no personal data on any server: the contact form opens your own email client and the message goes directly to the developer mailbox. The KnockDesk app stores your data only on your device. You can erase all of it at any time by uninstalling and deleting the AppData folder named in the Retention section above.
        </p>

        <h2>Cookies</h2>
        <p>
          This website sets no cookies and runs no third-party trackers. Details are on the{" "}
          <a href="/cookies" style={{ color: "var(--kd-acc)", textDecoration: "none" }}>cookie policy page</a>.
        </p>

        <h2>Changes to this policy</h2>
        <p>
          If this policy changes, the updated version will be published on this page with a new effective date.
        </p>
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
