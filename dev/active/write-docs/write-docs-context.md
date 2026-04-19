# Write Docs — Context

Last Updated: 2026-04-19

---

## Current state

**All documentation complete through Phase 2. Phase 3 is the only remaining item.**

| Phase | Status | Deliverables |
|-------|--------|-------------|
| Phase 1 | ✅ Complete | `README.md`, `docs/architecture.md`, `docs/components.md`, `CONTRIBUTING.md` |
| Phase 2 | ✅ Complete | `docs/deployment.md`, `docs/backend-integration.md` |
| Phase 3 | ⬜ Pending (low priority) | `docs/design-system.md` |

Repo is clean — no uncommitted changes. All work pushed to `origin/main`.

---

## What was built this session (full app + docs)

This is the first session for this project. Starting from a blank repo with only `CLAUDE.md`, the entire application AND documentation were created.

### Application built (commit `7b91632`)

Next.js 16 App Router site — StemAI, an AI audio stem separation web app modelled on lalal.ai.

**Pages:**
- `/` — landing page (HeroSection, HowItWorks, FeaturesGrid, ToolsSection, PricingSection, TestimonialsSection)
- `/upload` — 4-stage upload flow: `idle → selecting → processing → complete`
- `/pricing` — 3-tier pricing table with feature comparison

**Key components:**
- `components/shared/UploadZone.tsx` — react-dropzone, 200 MB limit, audio+video, sessionStorage handoff
- `components/shared/StemSelector.tsx` — 7 stem types with colour coding
- `components/shared/ProcessingState.tsx` — animated waveform + progress bar
- `components/shared/ResultPlayer.tsx` — per-stem play/pause + download
- `components/layout/Navbar.tsx` — sticky, `usePathname` active link
- `components/layout/Footer.tsx` — 4-column, social icons

**Design system:** Syne (headings) + DM Sans (body), `--accent: #7c3aed` purple, dark bg (`#050508`).

---

## Bugs fixed during app build — critical to remember

### 1. `@import` order in `globals.css` (PostCSS/Tailwind v4 constraint)

**Symptom:** 500 error — "Parsing CSS source code failed / @import rules must precede all rules aside from @charset and @layer statements"

**Root cause:** Tailwind v4 expands `@import "tailwindcss"` into real CSS rules during PostCSS processing. Any `@import url(...)` after it violates the CSS spec.

**Fix:** Google Fonts `@import url(...)` must come FIRST, before `@import "tailwindcss"`:

```css
/* CORRECT order in globals.css */
@import url('https://fonts.googleapis.com/css2?...');
@import "tailwindcss";
```

**This will bite any developer who adds a new font or CSS import.** Document it prominently if someone adds new imports.

### 2. Server components with event handlers (Next.js 16 App Router)

**Symptom:** 500 error — "Event handlers cannot be passed to Client Component props"

**Root cause:** `Footer.tsx` and `PricingSection.tsx` had `onMouseEnter`/`onMouseLeave` for hover effects but no `"use client"` directive. Next.js App Router server components cannot receive event handler props.

**Fix:** Add `"use client"` to any component that uses `onClick`, `onMouseEnter`, `onMouseLeave`, or any React hook.

**Rule:** If a component uses event handlers OR hooks (`useState`, `useEffect`, `useRef`, `useCallback`, `useRouter`, `usePathname`) — it must have `"use client"`.

### 3. In-page drop bug on `/upload`

**Symptom:** Dropping a file on the UploadZone while already on `/upload` did nothing — `router.push("/upload")` is a no-op when already on that route, and `useEffect([], [])` doesn't re-fire.

**Fix:** Added `onFileReady?: (name: string) => void` prop to `UploadZone`. When on `/upload`, the parent passes this callback to skip navigation and directly update state. When on the home hero, the prop is omitted and the original `router.push` path runs.

---

## Architecture constraints — must know before changing code

### 1. Mock API is dead code — upload page never calls it

`app/upload/page.tsx`'s `startProcessing()` function (lines 35–63) uses `setTimeout`/`setInterval` simulation only. It **never calls** `app/api/upload/route.ts`. The route handler is a scaffold documenting the intended contract.

To wire a real backend: replace `startProcessing` in `upload/page.tsx` — see `docs/backend-integration.md` for the exact code.

### 2. `Stem.type` union mismatch

`components/shared/ResultPlayer.tsx` defines:
```typescript
type: "vocal" | "instrumental"  // only 2 members
```

`app/api/upload/route.ts` returns `"drums"`, `"bass"`, `"other"` for full-split requests. This will be a TypeScript error when wiring the real API. Fix by widening the union to 8 members — see `docs/backend-integration.md` Step 2.

### 3. Vercel 4.5 MB request body limit

Vercel Hobby caps request bodies at 4.5 MB. `UploadZone` allows 200 MB. These are incompatible — either:
- Self-host (Railway/Fly/Render) — no limit
- Use presigned S3/R2 upload (file never passes through route handler)
- Reduce `maxSize` in `UploadZone.tsx` to 4 MB

Documented in `docs/deployment.md`.

### 4. Blob URL never revoked

`UploadZone.tsx` line 22: `URL.createObjectURL(file)` is called but never revoked. In production, call `URL.revokeObjectURL(blobUrl)` after the file is forwarded to the server and clear the sessionStorage key. Documented in `docs/backend-integration.md` Known Production Gaps §1.

---

## Key files to read before any future work

| File | Why |
|------|-----|
| `app/upload/page.tsx` | State machine, `startProcessing` mock, `StemResult` type |
| `app/api/upload/route.ts` | API scaffold (dead code — not called by UI) |
| `components/shared/ResultPlayer.tsx` | `Stem` interface (narrow type union, needs widening) |
| `components/shared/UploadZone.tsx` | sessionStorage keys, format list, blob URL leak |
| `app/globals.css` | CSS vars, `@import` order constraint, keyframes |
| `docs/backend-integration.md` | Full migration path from mock to real backend |
| `docs/deployment.md` | Vercel limit caveat, self-hosting options |

---

## sessionStorage contract (file-passing mechanism)

| Key | Set by | Read by | Value |
|-----|--------|---------|-------|
| `stemai_file_name` | `UploadZone.onDrop` | `upload/page.tsx` useEffect | `file.name` string |
| `stemai_file_url` | `UploadZone.onDrop` | `upload/page.tsx` startProcessing | `URL.createObjectURL(file)` blob URL |
| `stemai_file_type` | `UploadZone.onDrop` | Not currently read | `file.type` MIME string |

All three keys are cleared by `handleReset()` in `upload/page.tsx`.

---

## Remaining work

### Phase 3 — `docs/design-system.md` (low priority)

Only remaining task. Deferred until a designer or second developer joins.

Content to cover (all derivable from `app/globals.css`):
- Full CSS variable table: `--bg-primary` through `--green-glow` with hex values and intended use
- Typography scale: font sizes used across components (clamp values in hero, fixed sizes in cards)
- Animation catalogue: `waveBar`, `slide-up`, `shimmer`, `rotate-slow`, `ping-slow`, `float` — description of each
- Spacing conventions: padding patterns on cards (`p-6`, `p-7`, `p-8`), section padding (`py-24`)

No plan file is needed for this — it's a single 80-line Markdown file derivable entirely from `globals.css` and a grep of component files.

**To write it:** read `app/globals.css`, grep components for padding/font-size patterns, write `docs/design-system.md`, commit.

---

## Next steps if context resets

1. Run `git log --oneline -5` — confirm on `main`, clean tree.
2. The only open work is `docs/design-system.md` (Phase 3).
3. Read `app/globals.css` to get all CSS variables and keyframes.
4. Write `docs/design-system.md`.
5. Mark P3-T1 complete in `dev/active/write-docs/write-docs-tasks.md`.
6. Commit: `"docs: add design system reference"` and push.
