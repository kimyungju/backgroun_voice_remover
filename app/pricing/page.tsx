import Link from "next/link";
import { Check, X, Zap } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing — StemAI",
};

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "",
    desc: "Perfect for trying out stem separation",
    cta: "Start Free",
    href: "/upload",
    highlight: false,
    badge: null,
  },
  {
    name: "Pro",
    price: "$12",
    period: "/month",
    desc: "For serious creators and producers",
    cta: "Get Pro",
    href: "/upload",
    highlight: true,
    badge: "Most Popular",
  },
  {
    name: "Studio",
    price: "$49",
    period: "/month",
    desc: "For studios, teams & developers",
    cta: "Contact Sales",
    href: "mailto:hello@stemai.app",
    highlight: false,
    badge: null,
  },
];

const features = [
  { label: "Monthly processing", free: "90 min", pro: "Unlimited", studio: "Unlimited" },
  { label: "Stem types", free: "2-stem", pro: "8-stem", studio: "8-stem" },
  { label: "Output quality", free: "MP3 320kbps", pro: "Lossless WAV/FLAC", studio: "Lossless WAV/FLAC" },
  { label: "Processing speed", free: "Standard", pro: "Priority fast", studio: "Ultra fast" },
  { label: "Files per day", free: "5", pro: "Unlimited", studio: "Unlimited" },
  { label: "Batch upload", free: false, pro: "Up to 20 files", studio: "Up to 100 files" },
  { label: "Commercial license", free: false, pro: true, studio: true },
  { label: "API access", free: false, pro: false, studio: true },
  { label: "Team seats", free: "1", pro: "1", studio: "5" },
  { label: "Priority support", free: false, pro: false, studio: true },
  { label: "Custom model", free: false, pro: false, studio: true },
  { label: "SLA guarantee", free: false, pro: false, studio: "99.9%" },
];

function FeatureValue({ value }: { value: boolean | string }) {
  if (value === true) return <Check size={16} style={{ color: "#34d399", margin: "0 auto" }} />;
  if (value === false) return <X size={14} style={{ color: "var(--text-muted)", margin: "0 auto" }} />;
  return <span className="text-sm" style={{ color: "var(--text-secondary)" }}>{value}</span>;
}

export default function PricingPage() {
  return (
    <div className="min-h-screen py-20 px-6" style={{ background: "var(--bg-primary)" }}>
      {/* Background glow */}
      <div
        className="fixed pointer-events-none"
        style={{
          top: "0",
          left: "50%",
          transform: "translateX(-50%)",
          width: "800px",
          height: "400px",
          background: "radial-gradient(ellipse, rgba(124,58,237,0.12) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      <div className="relative max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--accent-bright)" }}>
            Pricing
          </p>
          <h1
            className="font-bold mb-4"
            style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(2rem, 5vw, 3.5rem)", color: "var(--text-primary)" }}
          >
            Transparent pricing,<br />no surprises
          </h1>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Start free. Cancel any time. No hidden fees.
          </p>
        </div>

        {/* Plan cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className="relative rounded-2xl p-8"
              style={
                plan.highlight
                  ? {
                      background: "linear-gradient(135deg, rgba(124,58,237,0.18) 0%, rgba(79,70,229,0.1) 100%)",
                      border: "1px solid rgba(124,58,237,0.45)",
                      boxShadow: "0 0 50px rgba(124,58,237,0.18)",
                    }
                  : { background: "var(--bg-card)", border: "1px solid var(--border)" }
              }
            >
              {plan.badge && (
                <div
                  className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5"
                  style={{ background: "var(--accent)", color: "white" }}
                >
                  <Zap size={10} />
                  {plan.badge}
                </div>
              )}

              <h2
                className="font-bold text-xl mb-1"
                style={{ fontFamily: "'Syne', sans-serif", color: "var(--text-primary)" }}
              >
                {plan.name}
              </h2>
              <p className="text-xs mb-6" style={{ color: "var(--text-muted)" }}>
                {plan.desc}
              </p>

              <div className="flex items-baseline gap-1 mb-8">
                <span
                  className="font-extrabold"
                  style={{ fontFamily: "'Syne', sans-serif", fontSize: "3rem", color: "var(--text-primary)", lineHeight: 1 }}
                >
                  {plan.price}
                </span>
                {plan.period && (
                  <span className="text-sm" style={{ color: "var(--text-muted)" }}>
                    {plan.period}
                  </span>
                )}
              </div>

              <Link
                href={plan.href}
                className="block w-full py-3 rounded-xl text-sm font-semibold text-center transition-all duration-200"
                style={
                  plan.highlight
                    ? { background: "var(--accent)", color: "white" }
                    : { background: "rgba(255,255,255,0.05)", color: "var(--text-primary)", border: "1px solid var(--border)" }
                }
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* Feature comparison table */}
        <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
          <div
            className="grid grid-cols-4 px-6 py-4"
            style={{ background: "var(--bg-card)", borderBottom: "1px solid var(--border)" }}
          >
            <div className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
              Feature
            </div>
            {plans.map((plan) => (
              <div
                key={plan.name}
                className="text-center text-sm font-bold"
                style={{ fontFamily: "'Syne', sans-serif", color: plan.highlight ? "var(--accent-bright)" : "var(--text-primary)" }}
              >
                {plan.name}
              </div>
            ))}
          </div>

          {features.map((feature, i) => (
            <div
              key={feature.label}
              className="grid grid-cols-4 px-6 py-4 items-center"
              style={{
                background: i % 2 === 0 ? "var(--bg-primary)" : "var(--bg-card)",
                borderBottom: i < features.length - 1 ? "1px solid var(--border)" : "none",
              }}
            >
              <div className="text-sm" style={{ color: "var(--text-secondary)" }}>
                {feature.label}
              </div>
              <div className="text-center"><FeatureValue value={feature.free} /></div>
              <div className="text-center"><FeatureValue value={feature.pro} /></div>
              <div className="text-center"><FeatureValue value={feature.studio} /></div>
            </div>
          ))}
        </div>

        {/* FAQ note */}
        <div className="text-center mt-12">
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Questions?{" "}
            <a href="mailto:hello@stemai.app" style={{ color: "var(--accent-bright)" }}>
              Contact us
            </a>{" "}
            — we reply within 24 hours.
          </p>
        </div>
      </div>
    </div>
  );
}
