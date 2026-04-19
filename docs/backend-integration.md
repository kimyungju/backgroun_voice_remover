# Backend Integration

## Current state: 100% simulated

All processing in StemAI is currently simulated in the browser. **The route handler at `app/api/upload/route.ts` is never called** — the upload page fakes processing entirely client-side and returns the original uploaded file as both stem outputs.

Specifically, `startProcessing()` in `app/upload/page.tsx` (lines 35–63):

1. Starts a fake `setInterval` progress animation (0 → 95% over ~3.5 s).
2. Waits 3.5 s via `setTimeout`.
3. Reads `sessionStorage.getItem("stemai_file_url")` — the original file blob URL.
4. Sets both "Vocals" and "Instrumental" to that same URL.
5. Transitions to the `complete` stage.

This means `app/api/upload/route.ts` is scaffolding — it documents the intended contract but has no callers.

---

## Migration path overview

```
Current:   UploadZone → sessionStorage → startProcessing (setTimeout mock) → ResultPlayer
Target:    UploadZone → sessionStorage → startProcessing (real fetch) → /api/upload → Python service → ResultPlayer
```

Four changes are required:

1. **`app/upload/page.tsx`** — replace the `setTimeout` simulation in `startProcessing` with a real `fetch` to `/api/upload`.
2. **`app/upload/page.tsx`** — widen the `StemResult` type to include all stem types the API can return.
3. **`components/shared/ResultPlayer.tsx`** — widen the `Stem.type` union to match.
4. **`app/api/upload/route.ts`** — replace the mock with a call to your Python service.

---

## Step 1 — Wire the upload page to call the API

Replace `startProcessing` in `app/upload/page.tsx` with this implementation.

Also replace the `StemResult` interface at the top of the file:

```typescript
// Replace the narrow StemResult interface (line 13-17 in upload/page.tsx):
interface StemResult {
  name: string;
  url: string;
  type:
    | "vocal"
    | "instrumental"
    | "drums"
    | "bass"
    | "piano"
    | "guitar"
    | "synth"
    | "other";
}

// Replace startProcessing (line 35-63 in upload/page.tsx):
const startProcessing = useCallback(async () => {
  setStage("processing");
  setProgress(0);

  const interval = setInterval(() => {
    setProgress((p) => {
      if (p >= 90) { clearInterval(interval); return 90; }
      return p + Math.random() * 5 + 1;
    });
  }, 400);

  try {
    const blobUrl = sessionStorage.getItem("stemai_file_url") ?? "";
    const storedName = sessionStorage.getItem("stemai_file_name") ?? "audio.mp3";

    // Convert the sessionStorage blob URL back to a Blob for FormData
    const audioBlob = await fetch(blobUrl).then((r) => r.blob());

    const formData = new FormData();
    formData.append("file", audioBlob, storedName);
    formData.append("stemType", stemType);

    const res = await fetch("/api/upload", { method: "POST", body: formData });
    if (!res.ok) throw new Error(`Server returned ${res.status}`);

    const data: { success: boolean; stems: StemResult[] } = await res.json();

    clearInterval(interval);
    setProgress(100);
    await new Promise((r) => setTimeout(r, 300));
    setResults(data.stems);
    setStage("complete");
  } catch (err) {
    clearInterval(interval);
    console.error("Processing failed:", err);
    setProgress(0);
    setStage("idle");
  }
}, [stemType]);
```

> **Why `fetch(blobUrl)`?** `URL.createObjectURL` produces a `blob:` URL that lives in the browser's memory. We read it back with `fetch` to get the underlying `Blob`, then attach it to `FormData` for the POST request.

---

## Step 2 — Fix the `Stem` type in `ResultPlayer`

`ResultPlayer.tsx` currently defines:

```typescript
interface Stem {
  name: string;
  url: string;
  type: "vocal" | "instrumental";   // ← too narrow
}
```

The API returns `"drums"`, `"bass"`, `"other"` etc. for full-split requests. Widen the union:

```typescript
// In components/shared/ResultPlayer.tsx, replace the Stem interface:
interface Stem {
  name: string;
  url: string;
  type:
    | "vocal"
    | "instrumental"
    | "drums"
    | "bass"
    | "piano"
    | "guitar"
    | "synth"
    | "other";
}
```

The `StemCard` component inside `ResultPlayer` uses `stem.type === "vocal"` as a binary check for icon/colour — this still works correctly after widening the union. Non-vocal types will render with the green "instrumental" styling.

---

## Step 3 — Implement the route handler

Replace `app/api/upload/route.ts` to forward the file to a Python service:

```typescript
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const stemApiUrl = process.env.STEM_API_URL;
  if (!stemApiUrl) {
    return NextResponse.json(
      { success: false, error: "STEM_API_URL is not configured" },
      { status: 503 }
    );
  }

  // Forward the multipart form data directly to the Python service
  const formData = await req.formData();
  const stemType = formData.get("stemType")?.toString() ?? "vocals";
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json(
      { success: false, error: "No file in request" },
      { status: 400 }
    );
  }

  // Re-build FormData to forward to the Python service
  const upstream = new FormData();
  upstream.append("file", file, file.name);
  upstream.append("stem_type", stemType);

  const upstreamRes = await fetch(`${stemApiUrl}/separate`, {
    method: "POST",
    body: upstream,
  });

  if (!upstreamRes.ok) {
    const text = await upstreamRes.text();
    return NextResponse.json(
      { success: false, error: `Upstream error: ${text}` },
      { status: 502 }
    );
  }

  const data = await upstreamRes.json();
  return NextResponse.json({ success: true, stems: data.stems });
}
```

The Python service must return:

```json
{
  "stems": [
    { "name": "Vocals",       "type": "vocal",        "url": "https://…/vocals.mp3" },
    { "name": "Instrumental", "type": "instrumental", "url": "https://…/instrumental.mp3" }
  ]
}
```

`url` must be a public URL (or a presigned S3/R2 URL) that the browser can fetch for playback and download. It cannot be a local filesystem path.

---

## Step 4 — Python service (FastAPI + Demucs)

> **Important:** Do not run Demucs directly inside the Next.js route handler. Route handlers run in a Node.js environment with no Python. Demucs takes 30–90 seconds for a 5-minute track — far beyond serverless timeout limits. Run it as a separate long-lived service.

### Minimal FastAPI service (local development)

Install dependencies:

```bash
pip install fastapi uvicorn python-multipart demucs
```

Create `stem_service/main.py`:

```python
import os
import uuid
import asyncio
from pathlib import Path
from fastapi import FastAPI, File, Form, UploadFile, HTTPException
from fastapi.staticfiles import StaticFiles

app = FastAPI()

OUTPUT_DIR = Path("output")
OUTPUT_DIR.mkdir(exist_ok=True)
app.mount("/output", StaticFiles(directory=str(OUTPUT_DIR)), name="output")

STEM_TYPE_TO_DEMUCS = {
    "vocals": ["vocals", "no_vocals"],
    "full":   ["vocals", "drums", "bass", "other"],
    "drums":  ["drums",  "other"],
    "bass":   ["bass",   "other"],
}

TYPE_MAP = {
    "vocals":   "vocal",
    "no_vocals":"instrumental",
    "drums":    "drums",
    "bass":     "bass",
    "other":    "other",
}

BASE_URL = os.getenv("SERVICE_BASE_URL", "http://localhost:8000")

@app.post("/separate")
async def separate(
    file: UploadFile = File(...),
    stem_type: str = Form("vocals"),
):
    job_id = uuid.uuid4().hex
    job_dir = OUTPUT_DIR / job_id
    job_dir.mkdir()

    # Save uploaded file
    input_path = job_dir / file.filename
    with open(input_path, "wb") as f:
        f.write(await file.read())

    # Run Demucs (htdemucs model, two-stem for vocals/instrumental)
    two_stem = stem_type not in ("full",)
    cmd = [
        "python", "-m", "demucs",
        "--out", str(job_dir),
        "--two-stems" if two_stem else "",
        "vocals" if two_stem else "",
        str(input_path),
    ]
    cmd = [c for c in cmd if c]  # remove empty strings

    proc = await asyncio.create_subprocess_exec(
        *cmd,
        stdout=asyncio.subprocess.PIPE,
        stderr=asyncio.subprocess.PIPE,
    )
    _, stderr = await proc.communicate()
    if proc.returncode != 0:
        raise HTTPException(status_code=500, detail=stderr.decode())

    # Collect output files
    # Demucs writes to job_dir/htdemucs/<track_name>/*.wav
    track_name = input_path.stem
    demucs_dir = job_dir / "htdemucs" / track_name
    stems = []
    for wav_path in sorted(demucs_dir.glob("*.wav")):
        stem_name = wav_path.stem          # e.g. "vocals", "no_vocals"
        relative = wav_path.relative_to(OUTPUT_DIR)
        url = f"{BASE_URL}/output/{relative}"
        stems.append({
            "name":  stem_name.replace("_", " ").title(),
            "type":  TYPE_MAP.get(stem_name, "other"),
            "url":   url,
        })

    return {"stems": stems}
```

Start the service:

```bash
cd stem_service
uvicorn main:app --reload --port 8000
```

Set the environment variable in `.env.local`:

```
STEM_API_URL=http://localhost:8000
```

> **Production note:** In production, serve the output files from S3/R2 rather than FastAPI's `StaticFiles`. Return presigned URLs instead of the local `BASE_URL`. Demucs output files can be several hundred MB per job — local disk is not suitable at scale.

### Managed API alternative (Replicate)

For a faster path without running your own GPU server, use [Replicate](https://replicate.com) which hosts Demucs as a public model:

```typescript
// In app/api/upload/route.ts — replace the upstream fetch with Replicate:
import Replicate from "replicate";

const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });

// Convert File to base64 data URI for Replicate input
const arrayBuffer = await file.arrayBuffer();
const base64 = Buffer.from(arrayBuffer).toString("base64");
const mimeType = file.type || "audio/mpeg";
const dataUri = `data:${mimeType};base64,${base64}`;

const output = await replicate.run(
  "deanishe/demucs:...",  // pin to a specific version hash
  { input: { audio: dataUri, stem: stemType === "full" ? "none" : "vocals" } }
);

// output is an array of URLs to separated stems on Replicate's CDN
```

Install: `npm install replicate`
Set: `REPLICATE_API_TOKEN=r8_...` in `.env.local`

> Replicate's free tier has rate limits and charges per second of GPU time. Do not use for production without reviewing their pricing.

---

## Known production gaps

These issues exist in the current codebase and should be addressed before shipping to real users:

### 1. Blob URL never revoked

In `components/shared/UploadZone.tsx` (line 22):

```typescript
const url = URL.createObjectURL(file);
```

This blob URL is never released. Fix by calling `URL.revokeObjectURL` after the file has been forwarded to the server:

```typescript
// In upload/page.tsx, after the fetch completes successfully:
const blobUrl = sessionStorage.getItem("stemai_file_url") ?? "";
// ... fetch and send the file ...
URL.revokeObjectURL(blobUrl);             // release browser memory
sessionStorage.removeItem("stemai_file_url");
```

### 2. No error state in the upload flow

The `startProcessing` function above catches errors and resets to `idle`. Consider adding an `error` stage to the state machine to show users a meaningful message rather than silently returning to the upload screen.

### 3. Output files must be publicly accessible

`ResultPlayer` uses `new Audio(stem.url)` and a `<a href={stem.url} download>` button. Both require the stem URLs to be fetchable by the browser — CORS headers must be set on the storage bucket or CDN serving the files.
