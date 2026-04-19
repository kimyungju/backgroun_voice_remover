"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useRouter } from "next/navigation";
import { Upload, Music, AlertCircle } from "lucide-react";

interface Props {
  compact?: boolean;
  onFileReady?: (name: string) => void;
}

export default function UploadZone({ compact, onFileReady }: Props) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    (accepted: File[]) => {
      setError(null);
      if (accepted.length === 0) return;
      const file = accepted[0];
      const url = URL.createObjectURL(file);
      sessionStorage.setItem("stemai_file_name", file.name);
      sessionStorage.setItem("stemai_file_url", url);
      sessionStorage.setItem("stemai_file_type", file.type);
      if (onFileReady) {
        onFileReady(file.name);
      } else {
        router.push("/upload");
      }
    },
    [router, onFileReady]
  );

  const onDropRejected = useCallback(() => {
    setError("Please upload an audio or video file (MP3, WAV, FLAC, MP4, etc.)");
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected,
    accept: {
      "audio/*": [".mp3", ".wav", ".flac", ".aac", ".ogg", ".m4a", ".wma"],
      "video/*": [".mp4", ".mov", ".avi", ".mkv"],
    },
    maxFiles: 1,
    maxSize: 200 * 1024 * 1024,
  });

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className="relative cursor-pointer transition-all duration-300"
        style={{
          border: `2px dashed ${isDragActive ? "var(--accent-bright)" : "rgba(124,58,237,0.3)"}`,
          borderRadius: "16px",
          background: isDragActive
            ? "rgba(124,58,237,0.08)"
            : "rgba(17,17,24,0.6)",
          padding: compact ? "32px 24px" : "56px 24px",
          boxShadow: isDragActive ? "0 0 40px rgba(124,58,237,0.2)" : "none",
        }}
      >
        <input {...getInputProps()} />

        <div className="flex flex-col items-center gap-4 text-center">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center transition-transform duration-300"
            style={{
              background: isDragActive
                ? "rgba(124,58,237,0.25)"
                : "rgba(124,58,237,0.12)",
              transform: isDragActive ? "scale(1.1)" : "scale(1)",
            }}
          >
            {isDragActive ? (
              <Music size={28} style={{ color: "var(--accent-bright)" }} />
            ) : (
              <Upload size={28} style={{ color: "var(--accent-bright)" }} />
            )}
          </div>

          <div>
            <p
              className="font-semibold mb-1.5"
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: compact ? "1rem" : "1.125rem",
                color: "var(--text-primary)",
              }}
            >
              {isDragActive ? "Drop it here!" : "Drop your audio file here"}
            </p>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              or{" "}
              <span style={{ color: "var(--accent-bright)" }}>browse files</span>
              {" "}— MP3, WAV, FLAC, MP4 up to 200MB
            </p>
          </div>

          {!compact && (
            <div className="flex items-center gap-6 mt-2">
              {["No quality loss", "All formats", "Fast processing"].map((label) => (
                <div key={label} className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--green)" }} />
                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>{label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-3 flex items-center gap-2 text-sm" style={{ color: "#f87171" }}>
          <AlertCircle size={14} />
          {error}
        </div>
      )}
    </div>
  );
}
