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

- [ ] **P2-T1:** Write `docs/deployment.md`
  - [ ] Vercel deploy instructions
  - [ ] Manual Node.js deploy (`npm run build` → `npm start`)
  - [ ] Environment variables (currently none; document placeholder pattern for future `STEM_API_URL` etc.)
  - [ ] GitHub Actions CI skeleton for lint + build on PR
- [ ] **P2-T2:** Write `docs/backend-integration.md`
  - [ ] Explain that current processing is 100% simulated client-side (mock gap in `app/upload/page.tsx`)
  - [ ] Document exact `Stem` interface the upload page passes to `<ResultPlayer>`
  - [ ] Step-by-step: wire `app/api/upload/route.ts` to a Demucs subprocess
  - [ ] Step-by-step: wire to a generic cloud REST API
  - [ ] Note `URL.revokeObjectURL` cleanup gap in `UploadZone`
  - [ ] Note that `app/upload/page.tsx` must be updated to actually call the API (currently bypasses it)

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
