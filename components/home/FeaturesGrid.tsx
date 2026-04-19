import { Mic2, Drum, Music2, Piano, Guitar, Zap, Waves, Radio } from "lucide-react";

const stems = [
  { icon: Mic2, name: "Vocals", desc: "Lead & backing vocals with pristine clarity", color: "#a78bfa" },
  { icon: Drum, name: "Drums", desc: "Full kit: kick, snare, hi-hats & cymbals", color: "#f472b6" },
  { icon: Music2, name: "Bass", desc: "Electric bass, synth bass & bass guitar", color: "#34d399" },
  { icon: Piano, name: "Piano", desc: "Keys, piano chords & Rhodes", color: "#fbbf24" },
  { icon: Guitar, name: "Guitar", desc: "Acoustic, electric & rhythm guitar", color: "#60a5fa" },
  { icon: Zap, name: "Synth", desc: "Synthesizers, pads & electronic elements", color: "#f87171" },
  { icon: Waves, name: "Strings", desc: "Orchestral strings, violin & cello", color: "#c084fc" },
  { icon: Radio, name: "Other", desc: "Remaining elements & ambient sounds", color: "#94a3b8" },
];

export default function FeaturesGrid() {
  return (
    <section className="py-24" style={{ background: "var(--bg-secondary)" }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--accent-bright)" }}>
            Stem Types
          </p>
          <h2
            className="font-bold mb-4"
            style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(1.8rem, 4vw, 2.75rem)", color: "var(--text-primary)" }}
          >
            Every instrument, isolated
          </h2>
          <p className="max-w-xl mx-auto text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            Our AI model identifies and separates up to 8 distinct audio stems with professional-grade precision.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stems.map((stem) => {
            const Icon = stem.icon;
            return (
              <div
                key={stem.name}
                className="group glass-card rounded-2xl p-6 transition-all duration-300"
                style={{ cursor: "default" }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                  style={{ background: `${stem.color}18`, border: `1px solid ${stem.color}30` }}
                >
                  <Icon size={18} style={{ color: stem.color }} />
                </div>
                <h3
                  className="font-semibold mb-1.5"
                  style={{ fontFamily: "'Syne', sans-serif", fontSize: "0.95rem", color: "var(--text-primary)" }}
                >
                  {stem.name}
                </h3>
                <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
                  {stem.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
