# Deployment

## Prerequisites

- Node.js 18+
- npm 9+

## Running locally

```bash
npm install
npm run dev   # → http://localhost:3000
```

## Hosting options

### Recommended: self-hosted (Railway / Fly.io / Render)

Self-hosting is the recommended path for StemAI because it imposes no body-size limit on incoming requests. This matters: `UploadZone` accepts files up to 200 MB, and audio files are commonly 30–80 MB.

#### Railway (simplest)

1. Push the repo to GitHub.
2. Create a project at [railway.app](https://railway.app) and connect the GitHub repo.
3. Railway auto-detects Next.js. Set:
   - Build command: `npm run build`
   - Start command: `npm run start`
4. Deploy. No environment variables are required for the current mock implementation.

#### Fly.io

```bash
npm install -g flyctl
flyctl auth login
flyctl launch      # accept defaults; choose the nearest region
flyctl deploy
```

#### Render

1. Create a **Web Service** at [render.com](https://render.com).
2. Connect the GitHub repo.
3. Build command: `npm run build`
4. Start command: `npm run start`
5. Runtime: Node.

---

### Vercel — works with caveats

Vercel deploys Next.js with zero configuration, but its Hobby plan limits request bodies to **4.5 MB** (Pro plan raises this to ~50 MB depending on region and runtime). The current `UploadZone` allows files up to 200 MB — those uploads will fail on Vercel Hobby.

**Deploy command:**

```bash
npx vercel
```

Or connect the GitHub repo at [vercel.com](https://vercel.com) for auto-deploys on push.

**If you stay on Vercel and need large files**, use a presigned direct upload:

1. Add a lightweight route handler (`POST /api/presign`) that returns a presigned S3/Cloudflare R2 URL.
2. Client uploads the file directly to S3/R2 — bypassing the Vercel request body entirely.
3. Client POSTs `{ fileKey, stemType }` to `/api/upload`.
4. The route handler calls your ML service with the S3 key or a public URL.

This is the standard pattern for audio/video processing on Vercel and requires S3 or R2 credentials.

> **Note:** The 4.5 MB limit is a Vercel platform constraint, not a Next.js App Router constraint. Route handlers have no built-in body size limit — the platform enforces it.

---

## Environment variables

No environment variables are required for the current mock implementation.

When wiring a real backend (see [Backend Integration](./backend-integration.md)), add these:

| Variable | Example | Description |
|----------|---------|-------------|
| `STEM_API_URL` | `http://localhost:8000` | Base URL of the Python stem-separation service |
| `STEM_API_KEY` | `sk_prod_...` | Optional API key if your service requires auth |

**Where to set them:**

| Environment | Location |
|-------------|----------|
| Local dev | `.env.local` (already in `.gitignore` — never commit this) |
| Vercel | Project Settings → Environment Variables |
| Railway | Service → Variables |
| Render | Service → Environment |
| Fly.io | `fly secrets set STEM_API_URL=http://...` |

Access them in route handlers via `process.env.STEM_API_URL`.

---

## CI/CD — GitHub Actions

Create `.github/workflows/ci.yml` to run lint and type-check on every pull request:

```yaml
name: CI

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Lint
        run: npm run lint

      - name: Type check
        run: npx tsc --noEmit
```

This catches ESLint violations and TypeScript type errors before they reach `main`. Add `npm run build` as an additional step if you want to catch build-time errors too (slower, but catches more).
