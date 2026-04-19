import UploadZone from "@/components/shared/UploadZone";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden" style={{ paddingTop: "80px", paddingBottom: "80px" }}>
      {/* Background orbs */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "-200px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "800px",
          height: "600px",
          background: "radial-gradient(ellipse at center, rgba(124,58,237,0.18) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: "-100px",
          left: "10%",
          width: "400px",
          height: "400px",
          background: "radial-gradient(ellipse at center, rgba(79,70,229,0.12) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          top: "30%",
          right: "5%",
          width: "300px",
          height: "300px",
          background: "radial-gradient(ellipse at center, rgba(16,185,129,0.08) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      <div className="relative max-w-5xl mx-auto px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full text-xs font-medium"
          style={{ background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.25)", color: "var(--accent-bright)" }}>
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--accent-bright)" }} />
          Powered by Neural Audio AI — v3.0
        </div>

        {/* Headline */}
        <h1
          className="font-extrabold leading-[1.08] tracking-tight mb-6"
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "clamp(2.5rem, 6vw, 5rem)",
            color: "var(--text-primary)",
          }}
        >
          Separate Any Track{" "}
          <br />
          <span className="gradient-text">Instantly</span>
        </h1>

        <p
          className="max-w-2xl mx-auto mb-10 leading-relaxed"
          style={{
            fontSize: "clamp(1rem, 2vw, 1.2rem)",
            color: "var(--text-secondary)",
          }}
        >
          AI-powered stem separation for vocals, drums, bass, guitar and more.
          Studio-quality splits in seconds — no plugins, no DAW required.
        </p>

        {/* Upload zone */}
        <div className="max-w-2xl mx-auto mb-10">
          <UploadZone />
        </div>

        {/* Trust metrics */}
        <div className="flex flex-wrap items-center justify-center gap-8">
          {[
            { value: "12M+", label: "Tracks processed" },
            { value: "99.2%", label: "User satisfaction" },
            { value: "< 30s", label: "Average processing" },
            { value: "Lossless", label: "Output quality" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div
                className="font-bold text-lg"
                style={{ fontFamily: "'Syne', sans-serif", color: "var(--text-primary)" }}
              >
                {stat.value}
              </div>
              <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
