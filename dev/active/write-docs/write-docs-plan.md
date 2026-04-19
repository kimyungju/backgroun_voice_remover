# StemAI Documentation Plan

Last Updated: 2026-04-19

---

## Executive Summary

StemAI has a functional Next.js 16 web app (landing page, upload flow, pricing) with a solid initial docs layer written in the same session as the code. The three existing docs — `README.md`, `docs/architecture.md`, `docs/components.md` — cover developer quick-start, internal architecture, and shared-component APIs.

This plan identifies the **gaps** in that initial layer and prioritizes the next documentation work by value and effort. The goal is a complete docs suite that allows a new developer to contribute, deploy, and extend StemAI without asking anyone a question.

---

## Current State Analysis

### What exists

| File | Coverage | Quality |
|------|----------|---------|
| `README.md` | Quick-start, scripts, project structure, deployment, backend extension guide | Good — actionable |
| `docs/architecture.md` | Routing, component tree, upload state machine, sessionStorage contract, API contract, design system | Good — accurate |
| `docs/components.md` | Props, types, behavior contracts, usage examples for all 6 shared/layout components | Good — complete |

### What is missing

| Gap | Impact | Effort |
|-----|--------|--------|
| No `CONTRIBUTING.md` — no branch naming, PR format, commit rules, or review process | Medium | S |
| No `docs/deployment.md` — Vercel config, env vars for real backend, CI/CD | Medium | M |
| No `docs/backend-integration.md` — how to swap mock API for Demucs/Spleeter/cloud | High | M |
| No API endpoint JSDoc / inline comments | Low | S |
| No `docs/design-system.md` — standalone colour palette, spacing, animation catalogue | Low | M |
| No home-section component docs (`components/home/`) — currently marked "internal" but may need docs as app grows | Low | L |
| `docs/components.md` `ProcessingState` incorrectly labelled "Server Component" (it receives `progress` prop that changes — works fine as server component because parent is client, but comment is misleading) | Low | XS |

---

## Proposed Future State

A five-file docs suite:

```
README.md                      ✅ done
CONTRIBUTING.md                ← Phase 1
docs/
├── architecture.md            ✅ done
├── components.md              ✅ done  (+ small fix)
├── backend-integration.md     ← Phase 2
└── deployment.md              ← Phase 2
```

Optional Phase 3 (low priority):
```
docs/design-system.md
docs/home-sections.md
```

---

## Implementation Phases

### Phase 1 — Contributor onboarding (Priority: High, Effort: S)

Creates the missing social contract for contributions. Any open-source or team project needs this before the first external PR lands.

**Deliverables:**
- `CONTRIBUTING.md` at project root

### Phase 2 — Deployment & backend extension (Priority: High, Effort: M)

The two most common developer questions after reading the README:
1. "How do I actually deploy this?"
2. "How do I connect a real AI model?"

**Deliverables:**
- `docs/deployment.md`
- `docs/backend-integration.md`

### Phase 3 — Design system & home sections (Priority: Low, Effort: M)

Useful once a designer or second developer joins. Low urgency.

**Deliverables:**
- `docs/design-system.md`

---

## Detailed Tasks

### Phase 1

#### P1-T1: Write `CONTRIBUTING.md` — Effort: S
Acceptance criteria:
- Covers: branch naming convention, commit message format (no AI attribution), PR checklist, code style (ESLint), how to run lint/type-check locally
- References CLAUDE.md commit rule explicitly
- Includes "First contribution" section (fork → branch → PR)

#### P1-T2: Fix misleading comment in `docs/components.md` — Effort: XS
Acceptance criteria:
- `ProcessingState` entry removes the "Server Component" directive label (the component has no directive — it's a server component by default but this framing is confusing given it receives live `progress` from a client parent)
- Replace with accurate description: "No directive — renders as a server component. Parent (`app/upload/page.tsx`) is a client component that passes updated `progress` down."

---

### Phase 2

#### P2-T1: Write `docs/deployment.md` — Effort: M
Acceptance criteria:
- Vercel one-click deploy instructions (with button if desired)
- Manual Node.js deploy (build → start)
- Environment variables section (currently none required; documents where to add them when backend is wired)
- CI/CD skeleton (GitHub Actions workflow for `npm run lint && npm run build` on PR)

#### P2-T2: Write `docs/backend-integration.md` — Effort: M
Acceptance criteria:
- Explains the full data-flow from file drop to stem playback
- Documents the exact JSON shape `ResultPlayer` expects (matches `Stem` interface)
- Provides a step-by-step example wiring `app/api/upload/route.ts` to a Demucs subprocess
- Provides a step-by-step example calling a cloud API (generic, e.g. a REST endpoint)
- Notes the `URL.revokeObjectURL` cleanup gap in `UploadZone`

---

### Phase 3

#### P3-T1: Write `docs/design-system.md` — Effort: M
Acceptance criteria:
- Full colour token table with hex, CSS variable, and intended use
- Typography scale (font sizes used across the app)
- Animation catalogue (all keyframes defined in globals.css with visual description)
- Spacing conventions

---

## Risk Assessment

| Risk | Likelihood | Mitigation |
|------|-----------|------------|
| Docs go stale when code changes | High | Note in CONTRIBUTING.md: update docs in same PR as code changes |
| `docs/backend-integration.md` becomes outdated if API route changes | Medium | Keep integration doc tied to the interface contract, not implementation details |
| Phase 3 never gets done (low priority, low urgency) | High | Accept it — defer until a second developer joins |

---

## Success Metrics

- A developer with no prior context can run the project locally in < 5 minutes using only `README.md`
- A developer can submit a correct PR without asking questions, using only `CONTRIBUTING.md`
- A developer can wire a real ML model using only `docs/backend-integration.md`
- Zero "how do I deploy this?" questions from new contributors

---

## Timeline Estimates

| Phase | Tasks | Estimated time |
|-------|-------|----------------|
| Phase 1 | P1-T1, P1-T2 | 30 minutes |
| Phase 2 | P2-T1, P2-T2 | 1.5 hours |
| Phase 3 | P3-T1 | 45 minutes |
