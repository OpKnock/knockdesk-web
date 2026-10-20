/**
 * "Inside the app": three blocks that show what KnockDesk actually looks like
 * in use, each with the real capture, the story it tells, and the detail that
 * makes it work. A server component on purpose: the motion on the globe is
 * pure CSS, so nothing here needs to ship JavaScript.
 */

type Block = {
  id: string;
  index: string;
  title: string;
  tagline: string;
  lead: string;
  points: string[];
  image: string;
  width: number;
  height: number;
  alt: string;
  effect: "town" | "voice" | "globe";
};

const blocks: Block[] = [
  {
    id: "agent-town",
    index: "01",
    title: "Agent Town",
    tagline: "A living office, inside your PC.",
    lead:
      "Alice, Bob, Carol and Dave aren't decorations — they're real AI agents with desks, roles, and live status. This is your team.",
    points: [
      "Four resident agents, each online with their own desk and specialty",
      "Walk up to any agent and hand over a task — face-to-face, no dashboards",
      "They move, meet, and even small-talk between jobs — “Paper jam again?”",
    ],
    image: "/shots/agent-town.webp",
    width: 675,
    height: 407,
    alt: "Agent Town: a pixel-art office where four AI agents sit at their own desks, with a status bar showing who is online.",
    effect: "town",
  },
  {
    id: "voice-assistant",
    index: "02",
    title: "Voice Assistant",
    tagline: "Meet the mind you talk to.",
    lead:
      "This is Stonic's living core — the voice assistant you speak to directly. Hit Start AI, say the word, and watch it think. Four circuits shape who it is:",
    points: [
      "Memory — it remembers you: your name, your work, your preferences",
      "Skills — the real abilities it uses to get things done on your PC",
      "Soul — tune its personality until it feels like yours",
      "Settings — full control over how it listens, thinks and behaves",
    ],
    image: "/shots/voice-assistant.webp",
    width: 680,
    height: 327,
    alt: "The voice assistant core: memory, skills, character and settings feeding into a particle orb with a Start AI button.",
    effect: "voice",
  },
  {
    id: "world-monitor",
    index: "03",
    title: "World Monitor",
    tagline: "The whole world, on your radar.",
    lead:
      "A live satellite feed built into your command center — a 3D globe with active hotspots, a full 2D command map, and today's headlines streaming in while you work.",
    points: [
      "A living 3D globe — spin it, zoom it, watch hotspots light up",
      "Flip to the full 2D command map for the detailed picture, live on UTC time",
      "Today's top headlines collected into one feed — no tab-hopping",
      "Your desktop stops being wallpaper and starts being mission control",
    ],
    image: "/shots/world-monitor.webp",
    width: 675,
    height: 530,
    alt: "The World Monitor: a 3D globe of Earth with live hotspots plotted across Africa, Europe and the Middle East.",
    effect: "globe",
  },
];

const themes = ["Ember", "Cyberpunk", "Midnight", "Mono", "Rosé", "Nous Blue", "Classic teal"];

/** A hotspot drifting across the visible face of the globe. */
function Hotspots() {
  const spots = [
    { y: 32, d: "0s" },
    { y: 45, d: "2.2s" },
    { y: 58, d: "4.3s" },
    { y: 70, d: "1.1s" },
    { y: 39, d: "5.7s" },
  ];
  return (
    <>
      {spots.map((s, i) => (
        <i
          key={i}
          style={{
            ["--y" as string]: `${s.y}%`,
            ["--d" as string]: s.d,
          }}
        />
      ))}
    </>
  );
}

function Media({ block }: { block: Block }) {
  if (block.effect === "globe") {
    return (
      <div className="kd-shot kd-shot-globe">
        <div className="kd-globe">
          <img
            src={block.image}
            alt={block.alt}
            width={block.width}
            height={block.height}
            loading="lazy"
            decoding="async"
            className="kd-globe-img"
          />
          <div className="kd-globe-disc" aria-hidden="true">
            <div className="kd-globe-track">
              <Hotspots />
            </div>
          </div>
          <div className="kd-globe-sheen" aria-hidden="true" />
        </div>
      </div>
    );
  }

  if (block.effect === "voice") {
    return (
      <div className="kd-shot kd-shot-voice">
        <img
          src={block.image}
          alt={block.alt}
          width={block.width}
          height={block.height}
          loading="lazy"
          decoding="async"
        />
        <span className="kd-voice-pulse" aria-hidden="true" />
      </div>
    );
  }

  return (
    <div className="kd-shot kd-shot-town">
      <img
        src={block.image}
        alt={block.alt}
        width={block.width}
        height={block.height}
        loading="lazy"
        decoding="async"
      />
      <span className="kd-town-scan" aria-hidden="true" />
    </div>
  );
}

export function AppFeatures() {
  return (
    <section className="kd-section kd-inside" id="inside">
      <div className="kd-container">
        <div className="kd-head">
          <h2 data-reveal="split">Inside the app</h2>
          <p data-reveal>
            Three places where KnockDesk stops being a chat box and becomes a place you work.
          </p>
        </div>

        <div className="kd-inside-list">
          {blocks.map((b, i) => (
            <article className="kd-inside-row" key={b.id} data-flip={i % 2 === 1}>
              <div className="kd-inside-copy" data-reveal>
                <p className="kd-inside-index">{b.index}</p>
                <h3>{b.title}</h3>
                <p className="kd-inside-tagline">{b.tagline}</p>
                <p className="kd-inside-lead">{b.lead}</p>
                <ul className="kd-inside-points">
                  {b.points.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </div>
              <div className="kd-inside-media" data-reveal="card">
                <Media block={b} />
              </div>
            </article>
          ))}
        </div>

        <div className="kd-inside-themes" data-reveal="card">
          <div>
            <h3>Command-center themes</h3>
            <p>Pick a look for your workspace, then keep working in it.</p>
          </div>
          <ul className="kd-chips">
            {themes.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
