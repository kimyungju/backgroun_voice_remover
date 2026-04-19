# Contributing to StemAI

## Prerequisites

```bash
node --version   # 18+
npm --version    # 9+
```

## Local setup

```bash
git clone https://github.com/kimyungju/backgroun_voice_remover.git
cd backgroun_voice_remover
npm install
npm run dev      # → http://localhost:3000
```

## Before you commit

```bash
npm run lint          # ESLint
npx tsc --noEmit      # TypeScript type check
```

Both must pass with zero errors.

## Branch naming

```
feat/short-description      # new feature
fix/short-description       # bug fix
docs/short-description      # documentation only
refactor/short-description  # code change with no behaviour change
```

## Commit messages

Use the imperative mood: "add vocal remover page" not "added vocal remover page".

**Required format:**
```
<type>: <short description>

Optional longer body explaining why, not what.
```

Types: `feat` `fix` `docs` `refactor` `style` `test` `chore`

**Prohibited in commit messages:**
- `Co-Authored-By: Claude` or any AI attribution line
- `Generated with Claude Code` or similar
- Generic messages like "update files", "fix stuff"

## Pull request checklist

Before opening a PR:

- [ ] `npm run lint` passes
- [ ] `npx tsc --noEmit` passes
- [ ] If you changed a shared component, `docs/components.md` is updated
- [ ] If you changed routing or data flow, `docs/architecture.md` is updated
- [ ] If you added a new page or feature, `README.md` is updated

## Code style

- No comments unless the *why* is non-obvious
- No `console.log` left in committed code
- Prefer editing existing files over creating new ones
- `"use client"` is required on any component that uses event handlers (`onClick`, `onMouseEnter`, etc.) or React hooks
- Keep components focused — one clear responsibility per file

## First contribution

1. Fork the repo
2. Create a branch: `git checkout -b feat/your-feature`
3. Make your changes
4. Run lint and type-check (see above)
5. Commit with a descriptive message
6. Open a PR against `main`

Keep PRs small and focused. A PR that changes one thing is easier to review than one that changes ten.
