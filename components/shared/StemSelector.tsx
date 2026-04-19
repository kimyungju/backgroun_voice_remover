"use client";

import { Mic2, Drum, Music2, Piano, Guitar, Zap, Layers } from "lucide-react";

const stems = [
  { id: "vocals", label: "Vocals", icon: Mic2, desc: "Lead & backing vocals", color: "#a78bfa" },
  { id: "drums", label: "Drums", icon: Drum, desc: "Full drum kit", color: "#f472b6" },
  { id: "bass", label: "Bass", icon: Music2, desc: "Bass guitar & synth bass", color: "#34d399" },
  { id: "piano", label: "Piano", icon: Piano, desc: "Piano & keys", color: "#fbbf24" },
  { id: "guitar", label: "Guitar", icon: Guitar, desc: "Acoustic & electric", color: "#60a5fa" },
  { id: "synth", label: "Synth", icon: Zap, desc: "Electronic & pads", color: "#f87171" },
  { id: "full", label: "Full Split", icon: Layers, desc: "All stems at once", color: "#c084fc" },
];

interface Props {
  selected: string;
  onChange: (id: string) => void;
}

export default function StemSelector({ selected, onChange }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      {stems.map((stem) => {
        const Icon = stem.icon;
        const isSelected = selected === stem.id;
        return (
          <button
            key={stem.id}
            onClick={() => onChange(stem.id)}
            className="relative rounded-xl p-4 text-left transition-all duration-200"
            style={{
              background: isSelected ? `${stem.color}15` : "var(--bg-card)",
              border: `1px solid ${isSelected ? stem.color + "50" : "var(--border)"}`,
              boxShadow: isSelected ? `0 0 20px ${stem.color}20` : "none",
            }}
          >
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center mb-3 transition-transform duration-200"
              style={{
                background: isSelected ? `${stem.color}25` : `${stem.color}12`,
                transform: isSelected ? "scale(1.05)" : "scale(1)",
              }}
            >
              <Icon size={16} style={{ color: stem.color }} />
            </div>
            <div
              className="text-sm font-semibold mb-0.5"
              style={{ fontFamily: "'Syne', sans-serif", color: "var(--text-primary)" }}
            >
              {stem.label}
            </div>
            <div className="text-xs" style={{ color: "var(--text-muted)" }}>
              {stem.desc}
            </div>
            {isSelected && (
              <div
                className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full flex items-center justify-center"
                style={{ background: stem.color }}
              >
                <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                  <path d="M1 3L3 5L7 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
