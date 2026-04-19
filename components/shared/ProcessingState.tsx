import { Waves } from "lucide-react";

interface Props {
  fileName: string;
  stemType: string;
  progress: number;
}

const messages = [
  "Analyzing audio waveform...",
  "Identifying audio components...",
  "Separating neural layers...",
  "Reconstructing stem channels...",
  "Applying quality enhancement...",
  "Finalizing output files...",
];

export default function ProcessingState({ fileName, stemType, progress }: Props) {
  const messageIndex = Math.min(Math.floor((progress / 100) * messages.length), messages.length - 1);

  return (
    <div className="flex flex-col items-center py-16 gap-8">
      {/* Animated waveform */}
      <div className="relative">
        <div className="flex items-center gap-1 h-16">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="wave-bar rounded-full"
              style={{
                width: "4px",
                height: i % 3 === 0 ? "56px" : i % 3 === 1 ? "40px" : "48px",
                background: `linear-gradient(to top, #7c3aed, #a78bfa)`,
                transformOrigin: "bottom",
              }}
            />
          ))}
        </div>
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(ellipse, rgba(124,58,237,0.15) 0%, transparent 70%)",
            filter: "blur(20px)",
          }}
        />
      </div>

      <div className="text-center max-w-md">
        <div
          className="font-bold text-xl mb-2"
          style={{ fontFamily: "'Syne', sans-serif", color: "var(--text-primary)" }}
        >
          Processing your track
        </div>
        <div className="text-sm mb-1" style={{ color: "var(--text-secondary)" }}>
          {fileName}
        </div>
        <div className="text-xs" style={{ color: "var(--text-muted)" }}>
          Separating: {stemType === "full" ? "All stems" : stemType.charAt(0).toUpperCase() + stemType.slice(1)}
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-md">
        <div className="flex justify-between text-xs mb-2" style={{ color: "var(--text-muted)" }}>
          <span>{messages[messageIndex]}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div
          className="w-full h-1.5 rounded-full overflow-hidden"
          style={{ background: "rgba(255,255,255,0.06)" }}
        >
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${progress}%`,
              background: "linear-gradient(90deg, #7c3aed, #a78bfa)",
              boxShadow: "0 0 12px rgba(124,58,237,0.5)",
            }}
          />
        </div>
      </div>

      <p className="text-xs text-center max-w-xs" style={{ color: "var(--text-muted)" }}>
        This usually takes 10–30 seconds depending on track length and complexity.
      </p>
    </div>
  );
}
