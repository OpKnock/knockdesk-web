import { Nav } from "./components/Nav";
import { Footer } from "./components/Footer";
import { BackToTop } from "./components/BackToTop";
import { ParticleHero } from "./components/ParticleHero";
import { FaqSection } from "./components/FaqSection";

const features = [
  {
    title: "Voice chat that works offline",
    desc: "Talk to your AI assistant without sending audio to the cloud. Your microphone stays yours.",
  },
  {
    title: "9 distinct voice personas",
    desc: "Choose from Jarvis, Boyfriend, Bro, Mentor, Assistant, Bestie, Girlfriend, Listener, or Partner. Each has its own tone, pitch, and personality.",
  },
  {
    title: "Screen capture and automation",
    desc: "Let KnockDesk read your screen, take screenshots, and control your computer when you ask it to.",
  },
  {
    title: "Local memory that learns you",
    desc: "Your preferences, work habits, and context stay on your PC. No cloud database tracking your conversations.",
  },
  {
    title: "Bring your own API keys",
    desc: "Use your existing Google Gemini, OpenRouter, or other provider keys. Your usage, your quota, your billing.",
  },
  {
    title: "Agent Town",
    desc: "A visual workspace where your AI agents interact. Watch tasks happen in real time.",
  },
];

const faqs = [
  {
    q: "Is KnockDesk really free?",
    a: "Yes. The app is open source under Apache-2.0. You bring your own AI provider keys (Google Gemini has a free tier), so there is no subscription, no locked features, and no upsell inside the app.",
  },
  {
    q: "Does my data leave my computer?",
    a: "Only when you send a prompt to your chosen AI provider (Google, OpenRouter, etc.). The app itself runs entirely on your PC. Your settings, memories, and chat history never leave your machine unless you explicitly export them.",
  },
  {
    q: "Which AI providers are supported?",
    a: "Google Gemini (free tier available), OpenRouter, and any OpenAI-compatible endpoint. You paste your own API key in Settings and the app connects directly.",
  },
  {
    q: "What are the system requirements?",
    a: "Windows 10 or later (64-bit), 8 GB RAM, 3 GB disk space. A GPU is not required. macOS support is in development.",
  },
  {
    q: "How do I get started?",
    a: "Download the installer, run it, and the app walks you through setup. You will need one API key from any supported provider. Google Gemini keys are free at aistudio.google.com.",
  },
  {
    q: "Can I uninstall it cleanly?",
    a: "Yes. The Windows uninstaller removes the app, shortcuts, and registry entries. Your data (settings, memories, chats) stays in your AppData folder until you delete it yourself.",
  },
];

export default function Home() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <Nav />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <main id="main">
        {/* Hero */}
        <section className="kd-grid-bg" style={{ position: "relative", minHeight: "92vh", display: "flex", alignItems: "center", padding: "96px 0" }}>
          <ParticleHero />
          <div className="kd-container kd-hero-content">
            <p className="kd-anim-in" style={{ fontSize: "0.8125rem", letterSpacing: "0.24em", color: "var(--kd-acc)", marginBottom: "24px", fontWeight: 500 }}>
              LOCAL FIRST. PRIVATE. YOURS.
            </p>
            <h1 className="kd-anim-in kd-anim-delay-1" style={{ marginBottom: "24px" }}>
              Your AI assistant,
              <br />
              <span style={{ fontWeight: 300, color: "var(--kd-acc)" }}>without the cloud.</span>
            </h1>
            <p className="kd-anim-in kd-anim-delay-2" style={{ fontSize: "1.25rem", maxWidth: "56ch", marginBottom: "40px" }}>
              KnockDesk runs on your PC, uses your API keys, and keeps every conversation on your machine.
              No account. No subscription. No tracking.
            </p>
            <div className="kd-anim-in kd-anim-delay-3" style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
              <a href="/download" className="kd-btn kd-btn-primary">
                Download for Windows
              </a>
              <a href="#features" className="kd-btn kd-btn-secondary">
                See what it does
              </a>
            </div>
            <div className="kd-anim-in kd-anim-delay-3" style={{ marginTop: "32px" }}>
              <p style={{ fontSize: "0.875rem", color: "var(--kd-faint)" }}>
                Free and open source. Works with your existing Google Gemini key.
              </p>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="kd-section" id="features">
          <div className="kd-container">
            <h2 style={{ marginBottom: "16px" }}>What KnockDesk does</h2>
            <p style={{ marginBottom: "48px" }}>Everything runs on your PC. Your keys, your data, your control.</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "16px" }}>
              {features.map((f, i) => (
                <div key={i} className="kd-card">
                  <h3 style={{ marginBottom: "10px", color: "var(--kd-text)" }}>{f.title}</h3>
                  <p style={{ fontSize: "0.9375rem" }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="kd-section">
          <div className="kd-container">
            <h2 style={{ marginBottom: "48px" }}>How it works</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "32px" }}>
              {[
                { step: "01", title: "Download and install", desc: "One installer, no admin rights needed. Takes about two minutes." },
                { step: "02", title: "Add your API key", desc: "Get a free Google Gemini key at aistudio.google.com, paste it in Settings." },
                { step: "03", title: "Start talking", desc: "Choose a voice persona, set your theme, and start a conversation. Everything else is automatic." },
              ].map((s) => (
                <div key={s.step}>
                  <p style={{ fontSize: "3rem", fontWeight: 200, color: "var(--kd-acc)", opacity: 0.55, lineHeight: 1 }} aria-hidden="true">{s.step}</p>
                  <h3 style={{ marginTop: "16px", marginBottom: "8px", color: "var(--kd-text)" }}>{s.title}</h3>
                  <p style={{ fontSize: "0.9375rem" }}>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <FaqSection faqs={faqs} />

        {/* Final CTA */}
        <section className="kd-section">
          <div className="kd-container" style={{ textAlign: "center" }}>
            <h2 style={{ marginBottom: "16px" }}>Ready to try it?</h2>
            <p style={{ marginBottom: "32px", marginInline: "auto" }}>
              Download KnockDesk, paste a free Gemini key, and start your first conversation in under five minutes.
            </p>
            <a href="/download" className="kd-btn kd-btn-primary">
              Download KnockDesk
            </a>
          </div>
        </section>
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
