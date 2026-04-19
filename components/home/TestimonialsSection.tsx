import { Star } from "lucide-react";

const testimonials = [
  {
    quote: "StemAI completely changed my workflow. What used to take hours with plugins now takes seconds. The vocal isolation is absolutely stunning — no artifacts, just clean stems.",
    name: "Marcus Chen",
    role: "Music Producer, Los Angeles",
    initials: "MC",
    color: "#a78bfa",
  },
  {
    quote: "I use this daily for my cover videos. The karaoke tracks come out perfect every time. I've tried every vocal remover out there and nothing comes close to the quality here.",
    name: "Sofia Reyes",
    role: "YouTube Creator, 2.1M subscribers",
    initials: "SR",
    color: "#f472b6",
  },
  {
    quote: "As a sound engineer, I was skeptical. But StemAI's drum isolation is genuinely professional-grade. I've used it on client projects and no one can tell the difference.",
    name: "James Okafor",
    role: "Audio Engineer & Mixer",
    initials: "JO",
    color: "#34d399",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--accent-bright)" }}>
            Testimonials
          </p>
          <h2
            className="font-bold"
            style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(1.8rem, 4vw, 2.75rem)", color: "var(--text-primary)" }}
          >
            Loved by creators worldwide
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="glass-card rounded-2xl p-7 transition-all duration-300"
              style={{ cursor: "default" }}
            >
              <div className="flex gap-1 mb-5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={13} style={{ color: "#fbbf24", fill: "#fbbf24" }} />
                ))}
              </div>

              <blockquote
                className="text-sm leading-relaxed mb-6"
                style={{ color: "var(--text-secondary)", fontStyle: "italic" }}
              >
                "{t.quote}"
              </blockquote>

              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{ background: `${t.color}20`, color: t.color, border: `1px solid ${t.color}30` }}
                >
                  {t.initials}
                </div>
                <div>
                  <div className="text-sm font-semibold" style={{ color: "var(--text-primary)", fontFamily: "'Syne', sans-serif" }}>
                    {t.name}
                  </div>
                  <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                    {t.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
