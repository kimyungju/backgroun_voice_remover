# Write Docs — Context

Last Updated: 2026-04-19

---

## Key files to read before editing docs

| File | Why it matters |
|------|---------------|
| `app/upload/page.tsx` | Source of truth for state machine stages and processing logic |
| `app/api/upload/route.ts` | Source of truth for API contract (mock implementation) |
| `components/shared/UploadZone.tsx` | sessionStorage keys, accepted file formats, 200 MB limit |
| `components/shared/ResultPlayer.tsx` | `Stem` interface definition used across docs |
| `app/globals.css` | All CSS variables, keyframes, utility classes |
| `CLAUDE.md` | Commit rule: no AI attribution lines |

---

## Key decisions already made

| Decision | Rationale |
|----------|-----------|
| Docs live at project root (`README.md`) and `docs/` (architecture, components) | Standard location, no docs framework needed |
| `CONTRIBUTING.md` goes at project root | GitHub renders it automatically on the repo page |
| No Storybook or generated API docs | Overkill for current scope — plain Markdown is sufficient |
| Home-section components (`components/home/`) not documented as public API | They're internal to the landing page; treating them as implementation details reduces doc maintenance burden |

---

## Architecture constraints docs must reflect

1. **`@import` order** — Google Fonts `@import url(...)` must come before `@import "tailwindcss"` in `globals.css`. This is a PostCSS/Tailwind v4 constraint; any docs that mention CSS setup must note it.

2. **`"use client"` required for event handlers** — Next.js 16 App Router server components cannot receive `onMouseEnter`/`onMouseLeave`/`onClick`. Any component docs that add interactivity guidance must remind the reader to add the directive.

3. **sessionStorage blob URL leak** — `URL.createObjectURL` in `UploadZone` is never revoked. `docs/backend-integration.md` should call this out as a known gap to fix in production.

4. **Mock API is client-side simulated** — `app/upload/page.tsx` does NOT actually call `app/api/upload/route.ts` — it simulates processing entirely in-browser with `setTimeout`/`setInterval`. The API route is a scaffold. This distinction is critical for `docs/backend-integration.md`.

---

## Existing docs summary

| File | Line count | Last updated |
|------|-----------|--------------|
| `README.md` | 105 | 2026-04-19 |
| `docs/architecture.md` | 137 | 2026-04-19 |
| `docs/components.md` | 203 | 2026-04-19 |

---

## Dependencies

- Phase 2 (`docs/backend-integration.md`) depends on understanding the mock API architecture (above constraint #4)
- Phase 2 (`docs/deployment.md`) can be written independently with no code dependencies
- Phase 1 (`CONTRIBUTING.md`) has no code dependencies — pure convention documentation
