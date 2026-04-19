import { Upload, SlidersHorizontal, Download } from "lucide-react";

const steps = [
  {
    icon: Upload,
    step: "01",
    title: "Upload Your Track",
    desc: "Drag & drop or browse for any audio or video file. MP3, WAV, FLAC, MP4 — we handle them all.",
  },
  {
    icon: SlidersHorizontal,
    step: "02",
    title: "Choose Stems",
    desc: "Select which stems to extract: vocals, drums, bass, guitar, piano, synth, or full split.",
  },
  {
    icon: Download,
    step: "03",
    title: "Download Results",
    desc: "Get studio-quality separated stems in seconds. Play back, download, or use directly in your DAW.",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-24 relative" id="features">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--accent-bright)" }}>
            How It Works
          </p>
          <h2
            className="font-bold"
            style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(1.8rem, 4vw, 2.75rem)", color: "var(--text-primary)" }}
          >
            Three steps to perfect stems
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 relative">
          {/* Connector lines */}
          <div
            className="hidden md:block absolute top-12 left-1/3 w-1/3 h-px"
            style={{ background: "linear-gradient(90deg, transparent, var(--accent), transparent)" }}
          />
          <div
            className="hidden md:block absolute top-12 left-2/3 w-1/3 h-px"
            style={{ background: "linear-gradient(90deg, transparent, var(--accent), transparent)" }}
          />

          {steps.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.step}
                className="relative group glass-card rounded-2xl p-8 transition-all duration-300"
                style={{ cursor: "default" }}
              >
                <div className="flex items-start gap-4 mb-5">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110"
                    style={{ background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.25)" }}
                  >
                    <Icon size={20} style={{ color: "var(--accent-bright)" }} />
                  </div>
                  <span
                    className="font-bold text-3xl leading-none pt-1"
                    style={{ fontFamily: "'Syne', sans-serif", color: "rgba(124,58,237,0.2)" }}
                  >
                    {s.step}
                  </span>
                </div>
                <h3
                  className="font-semibold mb-2"
                  style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.1rem", color: "var(--text-primary)" }}
                >
                  {s.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {s.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
