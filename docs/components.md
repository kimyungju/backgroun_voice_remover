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
