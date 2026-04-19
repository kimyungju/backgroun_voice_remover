"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Waves } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50" style={{ background: "rgba(5,5,8,0.85)", backdropFilter: "blur(20px)", borderBottom: "1px solid var(--border)" }}>
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}>
            <Waves size={16} className="text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight" style={{ fontFamily: "'Syne', sans-serif", color: "var(--text-primary)" }}>
            Stem<span style={{ color: "var(--accent-bright)" }}>AI</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {[
            { label: "Features", href: "/#features" },
            { label: "Pricing", href: "/pricing" },
            { label: "Apps", href: "#" },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-sm transition-colors duration-200"
              style={{
                color: pathname === item.href ? "var(--text-primary)" : "var(--text-secondary)",
                fontFamily: "'DM Sans', sans-serif",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-primary)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <Link
          href="/upload"
          className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 text-white"
          style={{ background: "var(--accent)", fontFamily: "'DM Sans', sans-serif" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#6d28d9")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "var(--accent)")}
        >
          Try for Free
        </Link>
      </nav>
    </header>
  );
}
