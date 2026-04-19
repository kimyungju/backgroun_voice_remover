"use client";

import { useState, useRef } from "react";
import { Play, Pause, Download, Mic2, Music } from "lucide-react";

interface Stem {
  name: string;
  url: string;
  type: "vocal" | "instrumental";
}

interface Props {
  stems: Stem[];
  fileName: string;
  onReset: () => void;
}

function StemCard({ stem }: { stem: Stem }) {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const isVocal = stem.type === "vocal";
  const color = isVocal ? "#a78bfa" : "#34d399";
  const Icon = isVocal ? Mic2 : Music;

  const togglePlay = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(stem.url);
      audioRef.current.onended = () => setPlaying(false);
    }
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
    setPlaying(!playing);
  };

  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = stem.url;
    a.download = `${stem.name}.mp3`;
    a.click();
  };

  return (
    <div
      className="rounded-2xl p-6 transition-all duration-300"
      style={{
        background: `linear-gradient(135deg, ${color}08 0%, var(--bg-card) 100%)`,
        border: `1px solid ${color}25`,
      }}
    >
      <div className="flex items-center gap-4 mb-5">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ background: `${color}18`, border: `1px solid ${color}30` }}
        >
          <Icon size={20} style={{ color }} />
        </div>
        <div>
          <div
            className="font-semibold"
            style={{ fontFamily: "'Syne', sans-serif", color: "var(--text-primary)" }}
          >
            {stem.name}
          </div>
          <div className="text-xs" style={{ color: "var(--text-muted)" }}>
            {isVocal ? "Isolated vocals track" : "Music without vocals"}
          </div>
        </div>
      </div>

      {/* Waveform visualization placeholder */}
      <div
        className="w-full h-12 rounded-lg mb-5 flex items-center px-3 gap-px overflow-hidden"
        style={{ background: "rgba(0,0,0,0.2)" }}
      >
        {Array.from({ length: 60 }).map((_, i) => {
          const h = 20 + Math.sin(i * 0.4) * 15 + Math.random() * 10;
          return (
            <div
              key={i}
              className="flex-1 rounded-sm"
              style={{
                height: `${h}%`,
                background: playing
                  ? `linear-gradient(to top, ${color}, ${color}80)`
                  : `rgba(255,255,255,0.08)`,
                transition: "background 0.3s",
              }}
            />
          );
        })}
      </div>

      <div className="flex gap-3">
        <button
          onClick={togglePlay}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
          style={{
            background: playing ? `${color}20` : `${color}15`,
            border: `1px solid ${color}30`,
            color,
          }}
        >
          {playing ? <Pause size={15} /> : <Play size={15} />}
          {playing ? "Pause" : "Play"}
        </button>
        <button
          onClick={handleDownload}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
          style={{ background: color, color: "white" }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          <Download size={14} />
          Download
        </button>
      </div>
    </div>
  );
}

export default function ResultPlayer({ stems, fileName, onReset }: Props) {
  return (
    <div>
      <div className="text-center mb-8">
        <div
          className="inline-flex items-center gap-2 mb-3 px-4 py-2 rounded-full text-xs font-medium"
          style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.25)", color: "#34d399" }}
        >
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#34d399" }} />
          Processing complete
        </div>
        <h2
          className="font-bold text-2xl mb-1"
          style={{ fontFamily: "'Syne', sans-serif", color: "var(--text-primary)" }}
        >
          Your stems are ready
        </h2>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          {fileName}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-8">
        {stems.map((stem) => (
          <StemCard key={stem.name} stem={stem} />
        ))}
      </div>

      <div className="text-center">
        <button
          onClick={onReset}
          className="text-sm transition-colors"
          style={{ color: "var(--text-muted)" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
        >
          Process another track →
        </button>
      </div>
    </div>
  );
}
