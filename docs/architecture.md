# Architecture

## Routing

StemAI uses Next.js 16 App Router. All routes are file-system-based under `app/`.

```
/              app/page.tsx           Server Component — section composition only
/upload        app/upload/page.tsx    "use client" — stateful upload flow
/pricing       app/pricing/page.tsx   Server Component — static pricing table
POST /api/upload  app/api/upload/route.ts  Route Handler — mock stem processing
```

`app/layout.tsx` wraps every route with `<Navbar>` and `<Footer>`. Both are Client Components (they use event handlers for hover effects).

## Component tree

```
RootLayout (layout.tsx)
├── Navbar
│
├── / (page.tsx)                    ← Server Component
│   ├── HeroSection
│   │   └── UploadZone              ← "use client"
│   ├── HowItWorks
│   ├── FeaturesGrid
│   ├── ToolsSection
│   ├── PricingSection              ← "use client"
│   └── TestimonialsSection
│
├── /upload (upload/page.tsx)       ← "use client"
│   ├── UploadZone (idle stage)
│   ├── StemSelector (selecting stage)
│   ├── ProcessingState (processing stage)
│   └── ResultPlayer (complete stage)
│
├── /pricing (pricing/page.tsx)     ← Server Component
│
└── Footer
```

## Upload page state machine

The upload page (`app/upload/page.tsx`) drives the user flow through four stages:

```
idle ──(file dropped)──▶ selecting ──(user clicks "Separate stems")──▶ processing ──(done)──▶ complete
  ▲                                                                                                │
  └──────────────────────────(user clicks "Process another track")────────────────────────────────┘
```

| Stage | Rendered component | Key state |
|-------|--------------------|-----------|
| `idle` | `<UploadZone onFileReady={…}>` | `fileName = ""` |
| `selecting` | `<StemSelector>` | `fileName`, `stemType` |
| `processing` | `<ProcessingState>` | `fileName`, `stemType`, `progress` (0–100) |
| `complete` | `<ResultPlayer>` | `fileName`, `stems[]` |

Progress is driven by a `setInterval` that increments by `random * 8 + 2` every 300 ms, capped at 95 %, then jumps to 100 % after a 3.5 s `setTimeout`.

## File-passing flow (sessionStorage)

Files move from `UploadZone` to the upload page via `sessionStorage`:

```
UploadZone.onDrop
  └─ sessionStorage.setItem("stemai_file_name", file.name)
  └─ sessionStorage.setItem("stemai_file_url",  URL.createObjectURL(file))
  └─ sessionStorage.setItem("stemai_file_type", file.type)
  └─ if (onFileReady) onFileReady(name)   ← already on /upload
     else router.push("/upload")          ← navigating from home
```

On the upload page, a `useEffect([], [])` reads `stemai_file_name` on mount and jumps directly to the `selecting` stage if a file is already stored. This allows the hero's `<UploadZone>` to populate sessionStorage and navigate in one gesture.

> ⚠️ Blob URLs created by `URL.createObjectURL` are never revoked in the current implementation. In a production app, call `URL.revokeObjectURL` in a cleanup effect.

## API contract

**POST `/api/upload`**

Request body: `FormData` with fields:
- `stemType`: `"vocals" | "drums" | "bass" | "piano" | "guitar" | "synth" | "full"` (optional, defaults to `"vocals"`)

Response (JSON):
```json
{
  "success": true,
  "stems": [
    { "name": "Vocals",       "type": "vocal",          "url": "/samples/sample.mp3" },
    { "name": "Instrumental", "type": "instrumental",   "url": "/samples/sample.mp3" }
  ]
}
```

For `stemType = "full"` the response returns 4 stems (Vocals, Drums, Bass, Other).

> The current implementation is a mock — it sleeps 1.5–2.5 s and returns `/samples/sample.mp3` for all URLs. Replace `app/api/upload/route.ts` to connect a real model.

## Design system

### CSS custom properties (globals.css)

```css
--bg-primary:    #050508   /* page background */
--bg-secondary:  #0d0d14   /* alternate section background */
--bg-card:       #111118   /* card background */
--bg-card-hover: #16161f   /* card hover background */
--border:        rgba(255,255,255,0.06)
--border-accent: rgba(139,92,246,0.35)
--accent:        #7c3aed   /* purple CTA / primary */
--accent-bright: #a78bfa   /* lighter purple for text accents */
--text-primary:  #f0f0ff
--text-secondary:#a0a0b8
--text-muted:    #4a4a6a
--green:         #10b981   /* success colour */
```

### Typography

| Role | Font | Weights |
|------|------|---------|
| Headings (h1–h4) | Syne | 400 · 500 · 600 · 700 · 800 |
| Body / UI text | DM Sans | 300 · 400 · 500 |

Loaded via Google Fonts `@import` at the top of `globals.css` (must precede `@import "tailwindcss"`).

### Reusable CSS classes

| Class | Effect |
|-------|--------|
| `.glass-card` | `bg-card` + 1 px `--border`; hover → `bg-card-hover` + `--border-accent` |
| `.gradient-text` | Purple diagonal gradient clipped to text |
| `.gradient-text-green` | Green diagonal gradient clipped to text |
| `.wave-bar` | `waveBar` keyframe — scaleY 0.25 → 1 → 0.25, staggered by child index |
| `.animate-slide-up` | Fade + translateY(24px→0) over 0.6 s |
| `.shimmer` | Horizontal shimmer gradient (loading skeleton) |
