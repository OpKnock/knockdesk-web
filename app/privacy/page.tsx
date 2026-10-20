import Link from "next/link";
import type { Metadata } from "next";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { EMAIL } from "../lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "KnockDesk privacy policy. All data stays on your PC. No tracking, no telemetry, no cloud backend.",
  alternates: { canonical: "/privacy" },
};

export default function Privacy() {
  return (
    <>
      <main id="main" className="kd-container kd-legal kd-page">
        <Breadcrumbs trail={[{ label: "Privacy Policy" }]} />
        <h1 data-reveal="split">Privacy Policy</h1>
        <p className="kd-meta">
          Effective: October 20, 2026. Last updated: October 20, 2026.
          <br />
          Contact: <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
        </p>

        <h2>Summary</h2>
        <p>
          KnockDesk runs on your PC. Your settings, memories, and chat history
          stay on your machine. We do not operate a cloud backend, we do not
          collect analytics, and we do not track you. The only personal data
          that reaches us is what you choose to type into the contact form,
          and that goes straight to our mailbox.
        </p>

        <h2>Who we are</h2>
        <p>
          KnockDesk is published by OpKnock, a small independent project. The
          software is distributed as free and open source under the Apache
          License 2.0, and the source is public. There is no company behind it
          that holds a copy of anything you do with the app.
        </p>

        <h2>What stays on your PC</h2>
        <ul>
          <li>
            <strong>Settings, chats, contacts, notes, tasks:</strong> stored in
            the app user-data folder on your PC. Persona and memory files are in
            <code>Documents\KnockDesk Data</code>.
          </li>
          <li>
            <strong>API keys:</strong> configured locally in Settings and used
            for requests to the providers you enable. They are protected with
            your operating system account and are redacted from logs and
            screenshots.
          </li>
          <li>
            <strong>Chat history and memories:</strong> local JSON and SQLite
            files you can read, edit, or delete at any time.
          </li>
          <li>
            <strong>Files you create with the app:</strong> screenshots and
            captures are saved to your Downloads folder.
          </li>
        </ul>

        <h2>What leaves your PC</h2>
        <p>
          Only two things can leave your machine, and both are under your
          control:
        </p>
        <ul>
          <li>
            <strong>AI provider requests:</strong> when you send a prompt, it
            goes directly to your chosen provider (Google Gemini, OpenRouter,
            Groq, OpenAI, Moonshot) using the API key you provided. That
            provider handles the request under its own privacy policy and
            terms. We never see it.
          </li>
          <li>
            <strong>Update checks:</strong> if you enable automatic updates, the
            app checks a version feed. No personal data is sent.
          </li>
        </ul>
        <p>
          KnockDesk itself has no server component. It cannot collect your data
          because there is nowhere for it to send it.
        </p>

        <h2>Microphone, camera, and screen</h2>
        <p>
          These are used only when you explicitly start a feature that needs
          them, such as voice chat, screen capture, or computer automation.
          KnockDesk performs no background recording. Audio and screen content
          is processed locally, or sent to the AI provider you configured, only
          as part of the request you asked for. You can turn each of these off
          in Settings, and switching one off stops it immediately.
        </p>

        <h2>What we do not do</h2>
        <ul>
          <li>No telemetry or analytics collection</li>
          <li>No advertising or cross-site tracking</li>
          <li>No sale, rental, or sharing of your data</li>
          <li>No cloud account, no sign-in, no user profile</li>
          <li>No background data collection</li>
          <li>No advertising SDKs embedded in the app</li>
        </ul>

        <h2>This website</h2>
        <p>
          This site is a static website. It has no server-side application, no
          database, and no user accounts. It sets no cookies and embeds no
          third-party tracking scripts. The contact form does not submit
          anything to a server: it opens your own mail client with the message
          addressed to us, so what you write reaches us only because you chose
          to send it.
        </p>
        <p>
          The font files and images are served from this site&apos;s own
          domain, so no font or tracking provider receives a request about your
          visit. The full detail is on the <Link href="/cookies">cookie policy
          page</Link>.
        </p>

        <h2>Security</h2>
        <p>
          The application stores its protected data encrypted at rest, using a
          key generated on your machine and bound to your operating system
          account. The shipped modules are recorded in a signed manifest, and
          that manifest is verified before the application uses those modules.
          A failed verification stops the affected feature rather than running
          unverified code.
        </p>
        <p>
          No system is perfectly secure. Keep your operating system updated,
          do not share your API keys, and review what you have granted
          microphone, camera, and screen access to.
        </p>

        <h2>Data retention and deletion</h2>
        <p>
          Your data stays on your PC until you delete it. Uninstalling
          KnockDesk preserves your data folders. To erase everything,
          uninstall the app and then delete the folders
          <code>Documents\KnockDesk Data</code>,{" "}
          <code>Documents\KnockDesk_Vault</code>, and the app user-data folder.
          There is nothing on our side to delete, because nothing was ever
          received.
        </p>

        <h2>Children</h2>
        <p>
          KnockDesk is not directed at children under 13, or under the age of
          digital consent in your country. We do not knowingly collect personal
          information from children.
        </p>

        <h2>Your rights</h2>
        <p>
          You can read, export, edit, and delete everything the app holds,
          because it is all on your machine. For anything you have sent us by
          email, you can ask for a copy or for deletion by writing to{" "}
          <a href={`mailto:${EMAIL}`}>{EMAIL}</a>, and we will action it. We
          keep no register of people, so there is nothing else to review.
        </p>

        <h2>Generative AI disclosure</h2>
        <p>
          Responses from KnockDesk are machine-generated and can be wrong. Model
          output can also reflect biases present in the training data of the
          provider you chose. Verify important information independently, and
          do not rely on the app for medical, legal, financial, or safety
          decisions. Report unsafe or abusive outputs via the contact page so
          provider settings can be adjusted.
        </p>

        <h2>International transfers</h2>
        <p>
          The KnockDesk app does not transfer your data across borders, because
          it does not transmit your data to us at all. If you use an AI
          provider that is based outside your country, that provider will
          process your prompts in the jurisdiction where it operates, under
          its own privacy policy. Read the policy of the provider you choose.
        </p>

        <h2>India: DPDP Act disclosure</h2>
        <p>
          For users in India, this site and the KnockDesk app are designed to
          comply with the Digital Personal Data Protection Act, 2023. This
          website collects no personal data on any server: the contact form
          opens your own email client and the message goes directly to the
          developer mailbox. The KnockDesk app stores your data only on your
          device. You can erase all of it at any time by uninstalling and
          deleting the folders named in the retention section above. To exercise
          any right under the Act, write to{" "}
          <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.
        </p>

        <h2>Cookies</h2>
        <p>
          This website sets no cookies and runs no third-party trackers.
          Details are on the <Link href="/cookies">cookie policy page</Link>.
        </p>

        <h2>Changes to this policy</h2>
        <p>
          If this policy changes, the updated version will be published on this
          page with a new effective date. Because the app does not phone home,
          a change to the app&apos;s behaviour is visible in the release notes
          and in the source repository rather than here.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about this policy, or a request relating to your data,
          write to <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.
        </p>
      </main>
    </>
  );
}
