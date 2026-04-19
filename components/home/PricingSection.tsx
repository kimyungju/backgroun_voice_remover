"use client";

import Link from "next/link";
import { Check, Zap } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "",
    desc: "Get started with basic stem separation",
    features: [
      "90 minutes per month",
      "2-stem split (vocals + instrumental)",
      "MP3 output",
      "Standard speed",
      "5 files per day",
    ],
    cta: "Start Free",
    href: "/upload",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$12",
    period: "/mo",
    desc: "For serious musicians and producers",
    features: [
      "Unlimited processing",
      "Up to 8-stem split",
      "Lossless WAV & FLAC output",
      "Priority fast processing",
      "Batch upload (up to 20 files)",
      "Commercial license",
    ],
    cta: "Get Pro",
    href: "/pricing",
    highlight: true,
    badge: "Most Popular",
  },
  {
    name: "Studio",
    price: "$49",
    period: "/mo",
    desc: "For studios and teams",
    features: [
      "Everything in Pro",
      "API access",
      "Team collaboration (5 seats)",
      "Priority support",
      "Custom model fine-tuning",
      "SLA guarantee",
    ],
    cta: "Contact Sales",
    href: "/pricing",
    highlight: false,
  },
];

export default function PricingSection() {
  return (
    <section className="py-24" style={{ background: "var(--bg-secondary)" }} id="pricing">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--accent-bright)" }}>
            Pricing
          </p>
          <h2
            className="font-bold mb-4"
            style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(1.8rem, 4vw, 2.75rem)", color: "var(--text-primary)" }}
          >
            Simple, transparent pricing
          </h2>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Start free. Upgrade when you need more.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className="relative rounded-2xl p-7 transition-all duration-300"
              style={
                plan.highlight
                  ? {
                      background: "linear-gradient(135deg, rgba(124,58,237,0.15) 0%, rgba(79,70,229,0.1) 100%)",
                      border: "1px solid rgba(124,58,237,0.4)",
                      boxShadow: "0 0 40px rgba(124,58,237,0.15)",
                    }
                  : {
                      background: "var(--bg-card)",
                      border: "1px solid var(--border)",
                    }
              }
            >
              {plan.badge && (
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5"
                  style={{ background: "var(--accent)", color: "white" }}
                >
                  <Zap size={10} />
                  {plan.badge}
                </div>
              )}

              <div className="mb-6">
                <h3
                  className="font-bold text-lg mb-1"
                  style={{ fontFamily: "'Syne', sans-serif", color: "var(--text-primary)" }}
                >
                  {plan.name}
                </h3>
                <p className="text-xs mb-4" style={{ color: "var(--text-muted)" }}>
                  {plan.desc}
                </p>
                <div className="flex items-baseline gap-1">
                  <span
                    className="font-extrabold"
                    style={{ fontFamily: "'Syne', sans-serif", fontSize: "2.5rem", color: "var(--text-primary)" }}
                  >
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-sm" style={{ color: "var(--text-muted)" }}>
                      {plan.period}
                    </span>
                  )}
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <Check
                      size={14}
                      className="mt-0.5 flex-shrink-0"
                      style={{ color: plan.highlight ? "var(--accent-bright)" : "var(--green)" }}
                    />
                    <span style={{ color: "var(--text-secondary)" }}>{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className="block w-full py-3 rounded-xl text-sm font-semibold text-center transition-all duration-200"
                style={
                  plan.highlight
                    ? { background: "var(--accent)", color: "white" }
                    : { background: "rgba(255,255,255,0.05)", color: "var(--text-primary)", border: "1px solid var(--border)" }
                }
                onMouseEnter={(e) => {
                  if (plan.highlight) (e.currentTarget as HTMLElement).style.background = "#6d28d9";
                  else (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.08)";
                }}
                onMouseLeave={(e) => {
                  if (plan.highlight) (e.currentTarget as HTMLElement).style.background = "var(--accent)";
                  else (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)";
                }}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
