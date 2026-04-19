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
