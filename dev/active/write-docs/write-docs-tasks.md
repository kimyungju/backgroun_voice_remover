# Write Docs — Task Checklist

Last Updated: 2026-04-19

---

## Status legend
- `[ ]` Not started
- `[~]` In progress
- `[x]` Complete

---

## Phase 1 — Contributor onboarding
**Goal:** Any developer can contribute without asking questions.

- [x] `README.md` — project overview, quick-start, scripts, structure, deployment, backend extension *(done 2026-04-19)*
- [x] `docs/architecture.md` — routing, state machine, sessionStorage, API contract, design system *(done 2026-04-19)*
- [x] `docs/components.md` — props tables, types, usage examples for all shared/layout components *(done 2026-04-19)*
- [x] **P1-T1:** Write `CONTRIBUTING.md` *(done 2026-04-19)*
  - [x] Branch naming convention
  - [x] Commit message format (reference CLAUDE.md rule: no AI attribution)
  - [x] PR checklist (lint, type-check, docs updated)
  - [x] How to run locally: `npm install && npm run dev`
  - [x] How to run lint: `npm run lint`
  - [x] How to run type-check: `npx tsc --noEmit`
  - [x] First-contribution walkthrough (fork → branch → PR)
- [x] **P1-T2:** Fix `docs/components.md` — `ProcessingState` directive label *(done 2026-04-19)*
  - [x] Remove "Server Component (no interactivity — pure display)" directive note
  - [x] Replace with accurate description referencing client parent

---

## Phase 2 — Deployment & backend integration
**Goal:** Developers can deploy and wire a real model without asking questions.

- [x] **P2-T1:** Write `docs/deployment.md` *(done 2026-04-19)*
  - [x] Railway/Fly/Render (recommended — no body size limit)
  - [x] Vercel with 4.5 MB caveat + presigned upload alternative
  - [x] Environment variables (`STEM_API_URL`, `STEM_API_KEY`)
  - [x] GitHub Actions CI workflow
- [x] **P2-T2:** Write `docs/backend-integration.md` *(done 2026-04-19)*
  - [x] Explain mock gap (`startProcessing` never calls the route handler)
  - [x] Step 1: wire `app/upload/page.tsx` to real `fetch("/api/upload")`
  - [x] Step 2: widen `Stem.type` union in `ResultPlayer.tsx`
  - [x] Step 3: route handler that proxies to Python service
  - [x] Step 4: FastAPI + Demucs separate-service example
  - [x] Replicate managed API alternative
  - [x] `URL.revokeObjectURL` cleanup gap
  - [x] No error state in upload flow
  - [x] CORS requirement for output file URLs

---

## Phase 3 — Design system (low priority)
**Goal:** Designer or second developer can work with the visual language.

- [ ] **P3-T1:** Write `docs/design-system.md`
  - [ ] Full CSS variable table (hex, variable name, intended use)
  - [ ] Typography scale
  - [ ] Animation catalogue (all keyframes from globals.css)
  - [ ] Spacing / border-radius conventions

---

## Completed
- [x] Initial docs layer (README, architecture, components) — 2026-04-19
- [x] Dev task structure created (`dev/active/write-docs/`) — 2026-04-19
