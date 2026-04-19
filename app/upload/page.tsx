"use client";

import { useState, useEffect, useCallback } from "react";
import UploadZone from "@/components/shared/UploadZone";
import StemSelector from "@/components/shared/StemSelector";
import ProcessingState from "@/components/shared/ProcessingState";
import ResultPlayer from "@/components/shared/ResultPlayer";
import { ArrowLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

type Stage = "idle" | "selecting" | "processing" | "complete";

interface StemResult {
  name: string;
  url: string;
  type: "vocal" | "instrumental";
}

export default function UploadPage() {
  const [stage, setStage] = useState<Stage>("idle");
  const [fileName, setFileName] = useState("");
  const [stemType, setStemType] = useState("vocals");
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<StemResult[]>([]);

  // Check if file was passed via sessionStorage on mount
  useEffect(() => {
    const name = sessionStorage.getItem("stemai_file_name");
    if (name) {
      setFileName(name);
      setStage("selecting");
    }
  }, []);

  const startProcessing = useCallback(async () => {
    setStage("processing");
    setProgress(0);

    // Simulate progress
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 95) {
          clearInterval(interval);
          return 95;
        }
        return p + Math.random() * 8 + 2;
      });
    }, 300);

    // Simulate API call
    await new Promise((r) => setTimeout(r, 3500));
    clearInterval(interval);
    setProgress(100);

    await new Promise((r) => setTimeout(r, 300));

    const fileUrl = sessionStorage.getItem("stemai_file_url") || "";
    setResults([
      { name: "Vocals", url: fileUrl, type: "vocal" },
      { name: "Instrumental", url: fileUrl, type: "instrumental" },
    ]);
    setStage("complete");
  }, []);

  const handleReset = () => {
    sessionStorage.removeItem("stemai_file_name");
    sessionStorage.removeItem("stemai_file_url");
    sessionStorage.removeItem("stemai_file_type");
    setStage("idle");
    setFileName("");
    setStemType("vocals");
    setProgress(0);
    setResults([]);
  };

  return (
    <div className="min-h-screen py-12 px-6" style={{ background: "var(--bg-primary)" }}>
      {/* Background glow */}
      <div
        className="fixed pointer-events-none"
        style={{
          top: "0",
          left: "50%",
          transform: "translateX(-50%)",
          width: "600px",
          height: "400px",
          background: "radial-gradient(ellipse, rgba(124,58,237,0.12) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      <div className="relative max-w-2xl mx-auto">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm mb-10 transition-colors"
          style={{ color: "var(--text-muted)" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
        >
          <ArrowLeft size={14} />
          Back to home
        </Link>

        {/* Progress breadcrumb */}
        {stage !== "idle" && (
          <div className="flex items-center gap-2 text-xs mb-8" style={{ color: "var(--text-muted)" }}>
            {["Upload", "Select Stem", "Processing", "Results"].map((label, i) => {
              const stageIndex = { idle: 0, selecting: 1, processing: 2, complete: 3 }[stage];
              const active = i <= stageIndex;
              return (
                <span key={label} className="flex items-center gap-2">
                  <span style={{ color: active ? "var(--accent-bright)" : "var(--text-muted)" }}>
                    {label}
                  </span>
                  {i < 3 && <ChevronRight size={12} style={{ color: "var(--text-muted)", flexShrink: 0 }} />}
                </span>
              );
            })}
          </div>
        )}

        {/* Content */}
        {stage === "idle" && (
          <div className="animate-slide-up">
            <h1
              className="font-bold text-2xl mb-2"
              style={{ fontFamily: "'Syne', sans-serif", color: "var(--text-primary)" }}
            >
              Upload your track
            </h1>
            <p className="text-sm mb-8" style={{ color: "var(--text-secondary)" }}>
              Drop any audio or video file to get started
            </p>
            <UploadZone
              compact
              onFileReady={(name) => {
                setFileName(name);
                setStage("selecting");
              }}
            />
          </div>
        )}

        {stage === "selecting" && (
          <div className="animate-slide-up">
            <div className="mb-8">
              <div
                className="inline-flex items-center gap-2 mb-2 text-xs px-3 py-1.5 rounded-full"
                style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)", color: "var(--accent-bright)" }}
              >
                File loaded: {fileName}
              </div>
              <h1
                className="font-bold text-2xl mb-2"
                style={{ fontFamily: "'Syne', sans-serif", color: "var(--text-primary)" }}
              >
                Choose what to separate
              </h1>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                Select the stem type you want to isolate
              </p>
            </div>

            <StemSelector selected={stemType} onChange={setStemType} />

            <div className="flex gap-3 mt-8">
              <button
                onClick={handleReset}
                className="px-5 py-3 rounded-xl text-sm font-medium transition-all duration-200"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}
              >
                ← Upload different file
              </button>
              <button
                onClick={startProcessing}
                className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all duration-200 text-white"
                style={{ background: "var(--accent)" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#6d28d9")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "var(--accent)")}
              >
                Separate stems →
              </button>
            </div>
          </div>
        )}

        {stage === "processing" && (
          <div className="animate-slide-up">
            <ProcessingState fileName={fileName} stemType={stemType} progress={progress} />
          </div>
        )}

        {stage === "complete" && (
          <div className="animate-slide-up">
            <ResultPlayer stems={results} fileName={fileName} onReset={handleReset} />
          </div>
        )}
      </div>
    </div>
  );
}
