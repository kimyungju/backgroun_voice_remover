import Link from "next/link";
import { Mic2, Layers, VolumeX, Radio, ChevronRight } from "lucide-react";

const tools = [
  {
    icon: Mic2,
    name: "Vocal Remover",
    desc: "Remove vocals from any song and create perfect karaoke or instrumental versions.",
    badge: "Most Popular",
    color: "#a78bfa",
  },
  {
    icon: Layers,
    name: "Stem Splitter",
    desc: "Split audio into up to 8 isolated stems — vocals, drums, bass, guitars, keys and more.",
    badge: null,
    color: "#60a5fa",
  },
  {
    icon: VolumeX,
    name: "Noise Reducer",
    desc: "Remove background noise, hiss, hum and artifacts from recordings and podcasts.",
    badge: "New",
    color: "#34d399",
  },
  {
    icon: Radio,
    name: "Voice Cleaner",
    desc: "Enhance voice recordings with AI-powered clarity boost and de-reverb.",
    badge: null,
    color: "#f472b6",
  },
];

export default function ToolsSection() {
  return (
    <section className="py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--accent-bright)" }}>
            Tools
          </p>
          <h2
            className="font-bold"
            style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(1.8rem, 4vw, 2.75rem)", color: "var(--text-primary)" }}
          >
            Everything you need
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.name}
                href="/upload"
                className="group glass-card rounded-2xl p-7 flex items-start gap-5 transition-all duration-300 no-underline"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
                  style={{ background: `${tool.color}15`, border: `1px solid ${tool.color}25` }}
                >
                  <Icon size={20} style={{ color: tool.color }} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <h3
                      className="font-semibold"
                      style={{ fontFamily: "'Syne', sans-serif", fontSize: "1rem", color: "var(--text-primary)" }}
                    >
                      {tool.name}
                    </h3>
                    {tool.badge && (
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{ background: `${tool.color}20`, color: tool.color, border: `1px solid ${tool.color}30` }}
                      >
                        {tool.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                    {tool.desc}
                  </p>
                </div>

                <ChevronRight
                  size={16}
                  className="flex-shrink-0 mt-1 transition-transform duration-200 group-hover:translate-x-1"
                  style={{ color: "var(--text-muted)" }}
                />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
