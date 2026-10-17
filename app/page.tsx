import Link from "next/link";
import { FaqSection } from "./components/FaqSection";
import { Icon } from "./components/Icon";
import { StackScene } from "./components/StackScene";
import { VERSION } from "./lib/site";

const features = [
  { icon: "mic", title: "Voice chat that works offline", desc: "Talk to your AI assistant without sending audio to the cloud. Your microphone stays yours." },
  { icon: "voices", title: "9 distinct voice personas", desc: "Choose from Jarvis, Boyfriend, Bro, Mentor, Assistant, Bestie, Girlfriend, Listener, or Partner. Each has its own tone, pitch, and personality." },
  { icon: "screen", title: "Screen capture and automation", desc: "Let KnockDesk read your screen, take screenshots, and control your computer when you ask it to." },
  { icon: "memory", title: "Local memory that learns you", desc: "Your preferences, work habits, and context stay on your PC. No cloud database tracking your conversations." },
  { icon: "key", title: "Bring your own API keys", desc: "Use your existing Google Gemini, OpenRouter, or other provider keys. Your usage, your quota, your billing." },
  { icon: "town", title: "Agent Town", desc: "A visual workspace where your AI agents interact. Watch tasks happen in real time." },
];

const steps = [
  { n: "01", title: "Download and install", desc: "One installer, no admin rights needed. Takes about two minutes." },
  { n: "02", title: "Add your API key", desc: "Get a free Google Gemini key at aistudio.google.com, paste it in Settings." },
  { n: "03", title: "Start talking", desc: "Choose a voice persona, set your theme, and start a conversation. Everything else is automatic." },
];

const faqs = [
  { q: "Is KnockDesk really free?", a: "Yes. The app is open source under Apache-2.0. You bring your own AI provider keys (Google Gemini has a free tier), so there is no subscription, no locked features, and no upsell inside the app." },
  { q: "Does my data leave my computer?", a: "Only when you send a prompt to your chosen AI provider (Google, OpenRouter, etc.). The app itself runs entirely on your PC. Your settings, memories, and chat history never leave your machine unless you explicitly export them." },
  { q: "Which AI providers are supported?", a: "Google Gemini (free tier available), OpenRouter, and any OpenAI-compatible endpoint. You paste your own API key in Settings and the app connects directly." },
  { q: "What are the system requirements?", a: "Windows 10 or later (64-bit), 8 GB RAM, 3 GB disk space. A GPU is not required. macOS support is in development." },
  { q: "How do I get started?", a: "Download the installer, run it, and the app walks you through setup. You will need one API key from any supported provider. Google Gemini keys are free at aistudio.google.com." },
  { q: "Can I uninstall it cleanly?", a: "Yes. The Windows uninstaller removes the app, shortcuts, and registry entries. Your data (settings, memories, chats) stays in your AppData folder until you delete it yourself." },
];

const stays = ["Settings, themes, and voice choices", "API keys, encrypted with Windows DPAPI", "Chat history and memories", "Screenshots and captures"];
const leaves = ["Prompts you send, straight to the AI provider you chose", "Update checks, only if you turn automatic updates on"];
const planes = ["Settings and themes", "Chat history and memory", "API keys, encrypted"];

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
            <h1>Your AI assistant, without the cloud.</h1>
            <p className="kd-sub">
              KnockDesk runs on your PC, uses your API keys, and keeps every conversation on your machine. No account. No subscription. No tracking.
            </p>
            <div className="kd-hero-actions">
              <Link href="/download" className="kd-btn kd-btn-primary">Download for Windows</Link>
              <a href="#features" className="kd-link">See what it does</a>
            </div>
            <p className="kd-hero-note">Free and open source. Works with your existing Google Gemini key.</p>
          </div>
          <div className="kd-scene" aria-hidden="true">
            <div className="kd-obj">
              {Array.from({ length: 15 }, (_, n) => (
                <svg key={n} viewBox="0 0 443 443" style={{ "--n": n } as React.CSSProperties}><use href="#kd-mark" /></svg>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="kd-proof">
        <div className="kd-container">
          <ul>
            <li><strong>Open source</strong><span>Apache-2.0 licensed</span></li>
            <li><strong>Windows 10 or later</strong><span>64-bit installer</span></li>
            <li><strong>Version {VERSION}</strong><span>Checksum published per release</span></li>
            <li><strong>No account</strong><span>Bring your own API key</span></li>
          </ul>
        </div>
      </div>

      <section className="kd-section" id="features">
        <div className="kd-container">
          <div className="kd-head" data-reveal>
            <h2>What KnockDesk does</h2>
            <p>Everything runs on your PC. Your keys, your data, your control.</p>
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

      <section className="kd-section" style={{ background: "var(--kd-soft)" }}>
        <div className="kd-container kd-split">
          <div data-reveal>
            <h2>What stays on your PC, and the one thing that leaves.</h2>
            <div className="kd-lists">
              <div>
                <h3>Stays on your PC</h3>
                <ul>{stays.map((s) => <li key={s}>{s}</li>)}</ul>
              </div>
              <div>
                <h3>Leaves your PC, under your control</h3>
                <ul>{leaves.map((s) => <li key={s}>{s}</li>)}</ul>
              </div>
            </div>
            <p style={{ marginTop: 24 }}><Link href="/privacy" className="kd-link">Read the privacy policy</Link></p>
          </div>
          <StackScene planes={planes} out="Prompts to your provider" />
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
        <div className="kd-container" data-reveal>
          
          <h2>Ready to try it?</h2>
          <p>Download KnockDesk, paste a free Gemini key, and start your first conversation in under five minutes.</p>
          <Link href="/download" className="kd-btn kd-btn-primary">Download KnockDesk</Link>
        </div>
      </section>
    </main>
  );
}
