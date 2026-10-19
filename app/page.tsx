import Link from "next/link";
import { FaqSection } from "./components/FaqSection";
import { HeroPanel } from "./components/HeroPanel";
import { Icon, type IconName } from "./components/Icon";
import { LayerStack } from "./components/LayerStack";
import { VERSION } from "./lib/site";

type Feature = { icon: IconName; title: string; desc: string };

const features: Feature[] = [
  { icon: "mic", title: "Voice assistant", desc: "Talk to your assistant with wake-word detection, speech transcription, and spoken replies. Which speech services run depends on how you configure it." },
  { icon: "voices", title: "9 distinct voice personas", desc: "Choose from Jarvis, Boyfriend, Bro, Mentor, Assistant, Bestie, Girlfriend, Listener, or Partner. Each has its own tone, pitch, and personality." },
  { icon: "screen", title: "Computer control", desc: "Let KnockDesk work with what is on your screen through a visual overlay. You grant control, and you can review what it does." },
  { icon: "memory", title: "Memory you can open", desc: "Persona and memory files live in your Documents folder as plain files. Read them, edit them, or delete them." },
  { icon: "key", title: "Bring your own API keys", desc: "Use Google Gemini, OpenRouter, Groq, OpenAI, or Moonshot/Kimi. Your usage, your quota, your billing." },
  { icon: "town", title: "AgentTown", desc: "A pixel-art office where your AI agents have desks, roles, and activity indicators, so you can follow their work." },
];

const steps = [
  { n: "01", title: "Get KnockDesk", desc: "Install the Windows build in a couple of minutes, or run the source shell on Windows and macOS." },
  { n: "02", title: "Add your API key", desc: "Open Settings, then AI Engine. Paste a provider key, select Save and Apply, and test it." },
  { n: "03", title: "Start talking", desc: "Follow the first-run onboarding, start the assistant, and say hello. Nothing leaves your PC until you enable it." },
];

const faqs = [
  { q: "Is KnockDesk really free?", a: "The app is open source, and first-party code is licensed under Apache-2.0. There is no KnockDesk subscription and no account. You bring your own AI provider key, and each provider has its own pricing and free tier." },
  { q: "Does my data leave my computer?", a: "Your persona, memory, and settings are stored on your PC. Prompts, speech, and tool requests go to the providers you enable, such as Google or OpenRouter, and are covered by their policies. KnockDesk is local-first, not universally offline." },
  { q: "Which AI providers are supported?", a: "Depending on the feature, KnockDesk can use Google Gemini, OpenRouter, Groq, OpenAI, and Moonshot/Kimi. You add keys in Settings, then AI Engine." },
  { q: "Which systems does it run on?", a: "The packaged app is for Windows 10 and 11. Bundles for macOS are published with each release, and a maintained source shell runs on Windows and macOS." },
  { q: "How do I get started?", a: "Open the Guide. It covers running the packaged app or the source shell, adding a provider key, and where your files are stored." },
  { q: "Where is my data stored?", a: "On a typical Windows setup: persona, memory, and custom skills in Documents\\KnockDesk Data, the file vault in Documents\\KnockDesk_Vault, and chats, contacts, notes, tasks, and settings in the app user-data folder." },
  { q: "Can it control my computer?", a: "Yes, and only with your say-so. Computer control is off until you turn it on in Settings, shows you what it is doing through an overlay, and stops when you switch it off." },
];

const stays = ["Persona and memory files, as plain files you can open", "Custom skills and the file vault", "Chats, contacts, notes, tasks, and settings", "API keys, protected by your Windows account"];
const leaves = ["Prompts and speech you send to the providers you enable", "News, map, messaging, and remote features, only when you turn them on"];

const safety: Feature[] = [
  { icon: "mic", title: "The microphone is yours", desc: "Microphone capture starts when you turn it on and stops when you turn it off. Speech is transcribed by the provider you configured, not by us." },
  { icon: "screen", title: "Control needs consent", desc: "Computer control is off by default. It starts only after you approve it, shows an overlay while it works, and stops on a keypress." },
  { icon: "key", title: "Keys stay local", desc: "API keys are stored on your machine with your Windows account's protection and are redacted from logs and screenshots." },
];

const more = [
  { t: "World Monitor", d: "An interactive map and news-monitoring tools that bring location and headlines into your workspace. Feeds depend on the sources configured for your build." },
  { t: "Command-center themes", d: "Pick a look for your workspace.", chips: ["Ember", "Cyberpunk", "Midnight", "Mono", "Rosé", "Nous Blue", "Classic teal"] },
];

export default function Home() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };

  return (
    <main id="main">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <section className="kd-hero">
        <div className="kd-container kd-hero-grid">
          <div data-hero-copy>
            <p className="kd-eyebrow">Local first. Private. Yours.</p>
            <h1>A personal AI assistant that lives on your PC.</h1>
            <p className="kd-sub">
              KnockDesk brings voice, memory, skills, and resident agents into one desktop workspace.
              Your files stay on your computer, and you choose the AI provider.
            </p>
            <div className="kd-hero-actions">
              <Link href="/download" className="kd-btn kd-btn-primary">Get KnockDesk</Link>
              <a href="#features" className="kd-link">See what it does</a>
            </div>
            <p className="kd-hero-note">Free and open source. You bring your own AI provider key.</p>
          </div>
          <div data-hero-panel data-parallax>
            <HeroPanel />
          </div>
        </div>
      </section>

      <div className="kd-proof" data-progress>
        <div className="kd-container">
          <ul>
            <li><strong>Open source</strong><span>First-party code under Apache-2.0</span></li>
            <li><strong data-count="9">9</strong><span>Voice personas, from Jarvis to Bestie</span></li>
            <li><strong data-count="5">5</strong><span>AI providers you can bring your own key for</span></li>
            <li><strong>Plain local files</strong><span>Persona and memory you can open</span></li>
          </ul>
        </div>
      </div>

      <section className="kd-section" id="features">
        <div className="kd-container">
          <div className="kd-head" data-reveal>
            <h2>What KnockDesk does</h2>
            <p>Voice, persona, memory, skills, and agents in one workspace, with your keys and your files under your control.</p>
          </div>
          <div className="kd-grid-3">
            {features.map((f, i) => (
              <div key={f.title} className="kd-feature" data-reveal style={{ "--d": `${(i % 3) * 90}ms` } as React.CSSProperties}>
                <Icon name={f.icon} />
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="kd-section kd-safety">
        <div className="kd-container">
          <div className="kd-head" data-reveal>
            <h2>Built to be safe to leave running</h2>
            <p>Sensitive features are off until you switch them on, and you can see what the app is doing at any moment.</p>
          </div>
          <div className="kd-grid-3">
            {safety.map((s, i) => (
              <div key={s.title} className="kd-feature" data-reveal style={{ "--d": `${(i % 3) * 90}ms` } as React.CSSProperties}>
                <Icon name={s.icon} />
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="kd-section kd-section-flush">
        <div className="kd-container kd-two">
          {more.map((m, i) => (
            <div key={m.t} className="kd-card" data-reveal style={{ "--d": `${i * 90}ms` } as React.CSSProperties}>
              <h3>{m.t}</h3>
              <p>{m.d}</p>
              {m.chips && <ul className="kd-chips">{m.chips.map((c) => <li key={c}>{c}</li>)}</ul>}
            </div>
          ))}
        </div>
      </section>

      <section className="kd-section kd-safety" id="layers">
        <div className="kd-container kd-split">
          <div data-reveal>
            <h2>Four layers. Only one can leave your PC.</h2>
            <p>Everything KnockDesk keeps is either a file you can open or a request you chose to send. Pick a layer to see what it holds.</p>
            <div className="kd-lists">
              <div>
                <h3>Stays on your PC</h3>
                <ul>{stays.map((s) => <li key={s}>{s}</li>)}</ul>
              </div>
              <div>
                <h3>Leaves your PC, only when you enable it</h3>
                <ul>{leaves.map((s) => <li key={s}>{s}</li>)}</ul>
              </div>
            </div>
            <p className="kd-lists-foot"><Link href="/privacy" className="kd-link">Read the privacy policy</Link></p>
          </div>
          <LayerStack />
        </div>
      </section>

      <section className="kd-section">
        <div className="kd-container">
          <h2 data-reveal style={{ marginBottom: 72 }}>How it works</h2>
          <div className="kd-steps" data-story>
            {steps.map((s, i) => (
              <div key={s.n} className="kd-step" data-reveal data-story-step style={{ "--d": `${i * 100}ms` } as React.CSSProperties}>
                <p className="n" aria-hidden="true">{s.n}</p>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
            <div className="kd-steps-rail" aria-hidden="true"><i /></div>
          </div>
        </div>
      </section>

      <FaqSection faqs={faqs} />

      <section className="kd-section kd-cta">
        <div className="kd-container kd-cta-grid" data-reveal>
          <div>
            <h2>Ready to try it?</h2>
            <p>Install it, add a provider key, pick a voice, and start your first conversation.</p>
            <div className="kd-hero-actions">
              <Link href="/download" className="kd-btn kd-btn-primary">Get KnockDesk</Link>
              <Link href="/guide" className="kd-btn kd-btn-ghost">Read the guide</Link>
            </div>
          </div>
          <ul className="kd-cta-facts">
            <li><strong>Version {VERSION}</strong><span>Windows installer and macOS bundles</span></li>
            <li><strong>No account</strong><span>Nothing to sign up for</span></li>
            <li><strong>Apache-2.0</strong><span>First-party code, inspectable</span></li>
          </ul>
        </div>
      </section>
    </main>
  );
}
