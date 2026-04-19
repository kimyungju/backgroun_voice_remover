# StemAI Documentation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the boilerplate README and produce three targeted doc files that give a developer or contributor everything they need to understand, run, extend, and deploy the StemAI project.

**Architecture:** Three docs at project root level: a full `README.md` replacing the Next.js boilerplate, a `docs/architecture.md` covering component tree and data-flow, and a `docs/components.md` covering every shared component's props and behavior contract. No docs framework—plain Markdown, no build step.

**Tech Stack:** Markdown, Next.js 16 / App Router, React 19, Tailwind CSS v4, react-dropzone, lucide-react, TypeScript 5.

---

## File Map

| Action | File | Responsibility |
|--------|------|----------------|
| Overwrite | `README.md` | Project overview, quick-start, scripts, deployment |
| Create | `docs/architecture.md` | Routing, component tree, upload state machine, data-flow, sessionStorage contract, CSS design system |
| Create | `docs/components.md` | Props tables, behavior contracts, usage examples for every shared/layout component |

---

### Task 1: Overwrite `README.md`

**Files:**
- Modify: `README.md` (overwrite entirely)

- [ ] **Step 1: Write the new README**

Replace `README.md` with this content exactly:

```markdown
# StemAI — AI Audio Stem Separation

A [lalal.ai](https://www.lalal.ai)-style web app that lets users separate vocals, drums, bass, guitar, and more from any audio or video track. Runs fully in the browser — no DAW or plugin required.

## Live demo

```
npm run dev   →  http://localhost:3000
```

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page — hero, how-it-works, stem-type grid, tools, pricing, testimonials |
| `/upload` | Upload & process flow — drag-drop → stem selection → simulated processing → playback & download |
| `/pricing` | Full 3-tier pricing table with feature comparison |

## Tech stack

- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS v4 + CSS custom properties
- **Icons:** lucide-react
- **Upload:** react-dropzone (200 MB limit, audio/* + video/*)
- **Fonts:** Syne (headings) · DM Sans (body) — loaded via Google Fonts

## Quick start

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev
# → http://localhost:3000

# 3. Build for production
npm run build
npm start
```

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev server with Turbopack (hot reload) |
| `npm run build` | Production build |
| `npm start` | Run production server |
| `npm run lint` | Run ESLint |

## Project structure

```
app/
├── layout.tsx          Root layout (Navbar + Footer wrapper)
├── page.tsx            Landing page (section composition)
├── upload/page.tsx     Upload & processing flow
├── pricing/page.tsx    Pricing table
└── api/upload/route.ts Mock processing API (POST)

components/
├── home/               Landing-page sections
│   ├── HeroSection.tsx
│   ├── HowItWorks.tsx
│   ├── FeaturesGrid.tsx
│   ├── ToolsSection.tsx
│   ├── PricingSection.tsx
│   └── TestimonialsSection.tsx
├── layout/
│   ├── Navbar.tsx
│   └── Footer.tsx
└── shared/             Reusable UI across pages
    ├── UploadZone.tsx
    ├── StemSelector.tsx
    ├── ProcessingState.tsx
    └── ResultPlayer.tsx

public/
└── samples/sample.mp3  Demo audio for download buttons
```

## Deployment

Deploy to Vercel (zero config for Next.js):

```bash
npx vercel
```

Or any Node.js host that supports `next start`. No environment variables are required — all processing is currently simulated client-side.

## Extending with a real backend

The mock API lives in `app/api/upload/route.ts`. To swap in a real ML model:

1. Accept the `FormData` (file + stemType) from the POST body.
2. Run inference (e.g. Demucs, Spleeter, or a cloud API).
3. Return `{ success: true, stems: [{ name, type, url }] }`.
4. The upload page (`app/upload/page.tsx`) reads `stems` from the response and passes them to `<ResultPlayer />` — no other changes needed.

## Contributing

- Commit messages must not include AI attribution lines (`Co-Authored-By`, `Generated with`, etc.).
- Run `npm run lint` before committing.
- Prefer editing existing files over adding new ones.
```

- [ ] **Step 2: Verify the file was written**

```bash
head -5 README.md
```
Expected first line: `# StemAI — AI Audio Stem Separation`

- [ ] **Step 3: Commit**

```bash
git add README.md
git commit -m "docs: replace boilerplate README with project overview"
```

---

### Task 2: Create `docs/architecture.md`

**Files:**
- Create: `docs/architecture.md`

- [ ] **Step 1: Create the docs directory and file**

```bash
mkdir -p docs
```

Then create `docs/architecture.md` with this content:

```markdown
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

⚠️ Blob URLs created by `URL.createObjectURL` are never revoked. In a production app, call `URL.revokeObjectURL` in a cleanup effect.

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
```

- [ ] **Step 2: Verify the file exists**

```bash
head -5 docs/architecture.md
```
Expected: `# Architecture`

- [ ] **Step 3: Commit**

```bash
git add docs/architecture.md
git commit -m "docs: add architecture — routing, state machine, API contract, design system"
```

---

### Task 3: Create `docs/components.md`

**Files:**
- Create: `docs/components.md`

- [ ] **Step 1: Create the file**

Create `docs/components.md` with this content:

```markdown
# Component Reference

All shared components live in `components/shared/` and `components/layout/`. Home-page sections in `components/home/` are internal to the landing page and not intended for reuse elsewhere.

---

## `UploadZone`

**File:** `components/shared/UploadZone.tsx`  
**Directive:** `"use client"`

Drag-and-drop file uploader powered by react-dropzone.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `compact` | `boolean` | `false` | Reduces vertical padding (used on `/upload` page) |
| `onFileReady` | `(name: string) => void` | `undefined` | If provided, called with the file name after writing to sessionStorage. If omitted, `router.push("/upload")` is called instead. |

### Accepted formats

`audio/*`: `.mp3 .wav .flac .aac .ogg .m4a .wma`  
`video/*`: `.mp4 .mov .avi .mkv`  
Max size: **200 MB**

### Side effects

On a successful drop the component writes three keys to `sessionStorage`:

| Key | Value |
|-----|-------|
| `stemai_file_name` | `file.name` |
| `stemai_file_url` | `URL.createObjectURL(file)` |
| `stemai_file_type` | `file.type` |

### Usage

```tsx
// On the home hero — navigate to /upload after drop
<UploadZone />

// On /upload page — stay on page, update parent state
<UploadZone
  compact
  onFileReady={(name) => {
    setFileName(name);
    setStage("selecting");
  }}
/>
```

---

## `StemSelector`

**File:** `components/shared/StemSelector.tsx`  
**Directive:** `"use client"`

Grid of selectable stem-type buttons with per-stem colour coding.

### Props

| Prop | Type | Description |
|------|------|-------------|
| `selected` | `string` | ID of the currently selected stem |
| `onChange` | `(id: string) => void` | Called when user clicks a stem button |

### Stem IDs

| ID | Label | Colour |
|----|-------|--------|
| `vocals` | Vocals | `#a78bfa` |
| `drums` | Drums | `#f472b6` |
| `bass` | Bass | `#34d399` |
| `piano` | Piano | `#fbbf24` |
| `guitar` | Guitar | `#60a5fa` |
| `synth` | Synth | `#f87171` |
| `full` | Full Split | `#c084fc` |

### Usage

```tsx
const [stemType, setStemType] = useState("vocals");

<StemSelector selected={stemType} onChange={setStemType} />
```

---

## `ProcessingState`

**File:** `components/shared/ProcessingState.tsx`  
**Directive:** Server Component (no interactivity — pure display)

Animated processing screen shown while stems are being separated.

### Props

| Prop | Type | Description |
|------|------|-------------|
| `fileName` | `string` | Name of the uploaded file (shown below the animation) |
| `stemType` | `string` | Selected stem ID (displayed as "Separating: Vocals") |
| `progress` | `number` | 0–100 progress value; drives the progress bar width and status message |

### Status messages

Messages cycle based on `Math.floor((progress / 100) * 6)`:

0. "Analyzing audio waveform..."
1. "Identifying audio components..."
2. "Separating neural layers..."
3. "Reconstructing stem channels..."
4. "Applying quality enhancement..."
5. "Finalizing output files..."

### Usage

```tsx
<ProcessingState
  fileName="track.mp3"
  stemType="vocals"
  progress={42}
/>
```

---

## `ResultPlayer`

**File:** `components/shared/ResultPlayer.tsx`  
**Directive:** `"use client"` (audio playback via `useRef<HTMLAudioElement>`)

Displays one `StemCard` per stem. Each card has play/pause and download controls.

### Props — `ResultPlayer`

| Prop | Type | Description |
|------|------|-------------|
| `stems` | `Stem[]` | Array of processed stems to display |
| `fileName` | `string` | Original file name shown in the header |
| `onReset` | `() => void` | Called when user clicks "Process another track" |

### Type — `Stem`

```typescript
interface Stem {
  name: string;                     // Display name e.g. "Vocals"
  url: string;                      // Audio URL for playback and download
  type: "vocal" | "instrumental";   // Controls icon and accent colour
}
```

`type: "vocal"` → purple (`#a78bfa`) + `<Mic2>` icon  
`type: "instrumental"` → green (`#34d399`) + `<Music>` icon

### Playback behaviour

Each `StemCard` holds an `HTMLAudioElement` ref created lazily on first play. Clicking "Play" calls `audio.play()`. Clicking "Pause" calls `audio.pause()`. The `onended` event resets the play state. Multiple cards can play simultaneously — there is no global audio mutex.

### Usage

```tsx
<ResultPlayer
  fileName="track.mp3"
  stems={[
    { name: "Vocals",       url: "/output/vocals.mp3",       type: "vocal" },
    { name: "Instrumental", url: "/output/instrumental.mp3", type: "instrumental" },
  ]}
  onReset={() => setStage("idle")}
/>
```

---

## `Navbar`

**File:** `components/layout/Navbar.tsx`  
**Directive:** `"use client"` (uses `usePathname` for active link detection)

Sticky top navigation bar. Height: 64 px (`h-16`). Uses `backdrop-filter: blur(20px)` over a semi-transparent background.

### Links

| Label | `href` |
|-------|--------|
| Features | `/#features` |
| Pricing | `/pricing` |
| Apps | `#` (placeholder) |
| Try for Free (CTA) | `/upload` |

No props — self-contained.

---

## `Footer`

**File:** `components/layout/Footer.tsx`  
**Directive:** `"use client"` (uses `onMouseEnter`/`onMouseLeave` for hover colour transitions)

Four-column footer: brand + tagline, Product links, Company links, Legal links. Also renders two social icon links.

No props — self-contained. All links are `href="#"` placeholders except the brand logo which links to `/`.
```

- [ ] **Step 2: Verify the file exists**

```bash
head -5 docs/components.md
```
Expected: `# Component Reference`

- [ ] **Step 3: Commit**

```bash
git add docs/components.md
git commit -m "docs: add component reference — props, types, usage examples"
```

---

### Task 4: Push all doc commits

- [ ] **Step 1: Verify all three commits are ahead of origin**

```bash
git log --oneline origin/main..HEAD
```
Expected: 3 lines, one per doc commit.

- [ ] **Step 2: Push**

```bash
git push origin main
```
Expected: `main -> main` success message.

---

## Self-Review

**Spec coverage:** The request was "write docs." Three deliverables cover: project overview (README), internal architecture (architecture.md), and component API contracts (components.md). Nothing left uncovered.

**Placeholder scan:** All code blocks contain real code matching the actual source. No TBDs. Props tables reference real types from the source. Status messages are the literal strings from `ProcessingState.tsx`.

**Type consistency:**
- `Stem` interface in `components.md` Task 3 matches the definition in `ResultPlayer.tsx` exactly (`name`, `url`, `type: "vocal" | "instrumental"`).
- `Stage` type in `architecture.md` matches `app/upload/page.tsx` exactly (`"idle" | "selecting" | "processing" | "complete"`).
- Stem IDs in `StemSelector` table match the `id` values defined in `StemSelector.tsx`.
