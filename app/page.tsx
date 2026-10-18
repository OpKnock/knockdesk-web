import Link from "next/link";
import { FaqSection } from "./components/FaqSection";
import { Icon } from "./components/Icon";
import { Avatar } from "./components/Avatar";

const features = [
  { icon: "mic", title: "Voice assistant", desc: "Talk to your assistant with wake-word detection, speech transcription, and spoken replies. Which speech services run depends on how you configure it." },
  { icon: "voices", title: "9 distinct voice personas", desc: "Choose from Jarvis, Boyfriend, Bro, Mentor, Assistant, Bestie, Girlfriend, Listener, or Partner. Each has its own tone, pitch, and personality." },
  { icon: "screen", title: "Computer control", desc: "Let KnockDesk work with what is on your screen through a visual overlay. You grant control, and you can review what it does." },
  { icon: "memory", title: "Memory you can open", desc: "Persona and memory files live in your Documents folder as plain files. Read them, edit them, or delete them." },
  { icon: "key", title: "Bring your own API keys", desc: "Use Google Gemini, OpenRouter, Groq, OpenAI, or Moonshot/Kimi. Your usage, your quota, your billing." },
  { icon: "town", title: "AgentTown", desc: "A pixel-art office where your AI agents have desks, roles, and activity indicators, so you can follow their work." },
];

const steps = [
  { n: "01", title: "Get KnockDesk", desc: "On Windows 10 or 11, launch KnockDesk.exe from a trusted distribution, or run the source shell with npm run dev." },
  { n: "02", title: "Add your API key", desc: "Open Settings, then AI Engine. Paste a provider key, select Save and Apply, and test it." },
  { n: "03", title: "Start talking", desc: "Follow the first-run onboarding, start the assistant from the main interface, and say hello." },
];

const faqs = [
  { q: "Is KnockDesk really free?", a: "The app is open source, and first-party code is licensed under Apache-2.0. You bring your own AI provider keys, so there is no KnockDesk subscription. Providers may charge for usage, and a free tier is not guaranteed." },
  { q: "Does my data leave my computer?", a: "Your persona, memory, and settings are stored on your PC. Prompts, speech, and tool requests go to the providers you enable, such as Google or OpenRouter, and are covered by their policies. KnockDesk is local-first, not universally offline." },
  { q: "Which AI providers are supported?", a: "Depending on the feature, KnockDesk can use Google Gemini, OpenRouter, Groq, OpenAI, and Moonshot/Kimi. You add keys in Settings, then AI Engine." },
  { q: "Which systems does it run on?", a: "The packaged app is for Windows 10 and 11. A maintained source shell runs on Windows and macOS, but it is still being stabilized and is not yet a feature-for-feature match for the packaged app." },
  { q: "How do I get started?", a: "Open the Guide. It covers running the packaged app or the source shell, adding a provider key, and where your files are stored." },
  { q: "Where is my data stored?", a: "On a typical Windows setup: persona, memory, and custom skills in Documents\\KnockDesk Data, the file vault in Documents\\KnockDesk_Vault, and chats, contacts, notes, tasks, and settings in the app user-data folder." },
];

const stays = ["Persona and memory files, as plain files you can open", "Custom skills and the file vault", "Chats, contacts, notes, tasks, and settings", "API keys, configured locally in Settings"];
const leaves = ["Prompts and speech you send to the providers you enable", "News, map, messaging, and remote features, only when you turn them on"];
const planes = ["Persona and memory", "Chats and notes", "Settings and keys"];
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
          <div>
            <p className="kd-eyebrow">Local first. Private. Yours.</p>
            <h1>A personal AI assistant that lives on your PC.</h1>
            <p className="kd-sub">
              KnockDesk brings voice, memory, skills, and resident agents into one desktop workspace. Your files stay on your computer, and you choose the AI provider.
            </p>
            <div className="kd-hero-actions">
              <Link href="/download" className="kd-btn kd-btn-primary">Get KnockDesk</Link>
              <a href="#features" className="kd-link">See what it does</a>
            </div>
            <p className="kd-hero-note">Free and open source. Provider API costs may apply.</p>
          </div>
          <Avatar />
        </div>
      </section>

      <div className="kd-proof">
        <div className="kd-container">
          <ul>
            <li><strong>Open source</strong><span>First-party code under Apache-2.0</span></li>
            <li><strong>Windows 10 and 11</strong><span>macOS source shell available</span></li>
            <li><strong>Your own API keys</strong><span>Gemini, OpenRouter, Groq and more</span></li>
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

      <section className="kd-section" style={{ paddingTop: 0, borderTop: 0 }}>
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

      <section className="kd-section" style={{ background: "var(--kd-soft)" }}>
        <div className="kd-container kd-split">
          <div data-reveal>
            <h2>What stays on your PC, and what leaves.</h2>
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
            <p style={{ marginTop: 24 }}><Link href="/privacy" className="kd-link">Read the privacy policy</Link></p>
          </div>
          <div className="kd-stack" data-progress aria-hidden="true">
            <div className="kd-stack-inner">
              {planes.map((p, i) => (<div key={p} className="kd-plane" style={{ "--i": i } as React.CSSProperties}>{p}</div>))}
              <div className="kd-plane out" style={{ "--i": planes.length } as React.CSSProperties}>Prompts to your provider</div>
            </div>
          </div>
        </div>
      </section>

      <section className="kd-section">
        <div className="kd-container">
          <h2 data-reveal style={{ marginBottom: 72 }}>How it works</h2>
          <div className="kd-steps">
            {steps.map((s, i) => (
              <div key={s.n} className="kd-step" data-reveal style={{ "--d": `${i * 100}ms` } as React.CSSProperties}>
                <p className="n" aria-hidden="true">{s.n}</p>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FaqSection faqs={faqs} />

      <section className="kd-section kd-cta">
        <div className="kd-container kd-hero-grid" data-reveal>
          <div>
            <h2>Ready to try it?</h2>
            <p style={{ marginLeft: 0 }}>Add a provider key, pick a voice, and start your first conversation.</p>
            <Link href="/download" className="kd-btn kd-btn-primary">Get KnockDesk</Link>
          </div>
          <div className="kd-scene" aria-hidden="true">
            <div className="kd-obj" style={{ ["--hero" as string]: 0.35 }}>
              {Array.from({ length: 15 }, (_, n) => (
                <svg key={n} viewBox="0 0 443 443" style={{ "--n": n } as React.CSSProperties}><use href="#kd-mark" /></svg>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
