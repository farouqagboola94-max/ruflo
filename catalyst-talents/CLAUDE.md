# Catalyst Talents Lagos

Next.js 14 marketing website for a Lagos-based talent agency. Deployed to Netlify via static export.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14.2.5 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 3 |
| Runtime | React 18 |
| Node | 20 |
| Deploy | Netlify (static export) |

---

## Directory Structure

```
catalyst-talents/
├── app/
│   ├── layout.tsx          # Root layout (metadata, fonts)
│   ├── page.tsx            # Home page (14KB)
│   ├── loading.tsx         # Global loading state
│   ├── not-found.tsx       # 404 page
│   ├── robots.ts           # Robots.txt generator
│   ├── sitemap.ts          # Sitemap generator
│   ├── globals.css         # Global styles
│   ├── about/              # About page
│   ├── apply/              # Talent application page
│   ├── contact/            # Contact page
│   ├── models/             # Model listings
│   ├── news/               # News/press releases
│   ├── press/              # Press page
│   ├── privacy/            # Privacy policy
│   └── services/           # Services page
├── components/             # Shared UI components
├── data/                   # Static data (JSON/TS)
├── netlify.toml            # Netlify deploy config
├── next.config.js          # Next.js config (static export)
├── tailwind.config.js      # Tailwind configuration
├── tsconfig.json           # TypeScript config
└── package.json            # Dependencies
```

---

## Routes

| Route | File | Purpose |
|-------|------|---------|
| `/` | `app/page.tsx` | Home — hero, talent showcase |
| `/about` | `app/about/` | Agency overview |
| `/apply` | `app/apply/` | Talent application form |
| `/contact` | `app/contact/` | Contact information |
| `/models` | `app/models/` | Model portfolio listings |
| `/news` | `app/news/` | Latest news and updates |
| `/press` | `app/press/` | Press coverage |
| `/privacy` | `app/privacy/` | Privacy policy |
| `/services` | `app/services/` | Agency services |

---

## Development

```bash
cd catalyst-talents
npm install

# Dev server
npm run dev      # http://localhost:3000

# Production build (static export → out/)
npm run build

# Preview production build locally
npx serve out

# Lint
npm run lint
```

---

## Netlify Deployment

**Config:** `catalyst-talents/netlify.toml`

```toml
[build]
  command = "npm run build"
  publish = "out"
  base    = "catalyst-talents"

[build.environment]
  NODE_VERSION = "20"
  NPM_VERSION  = "10"
```

**Triggered by:** `.github/workflows/deploy-catalyst.yml` on push to `main`

**Security headers** (applied to all routes):
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`

**404 redirect:** All unmatched routes → `/404/index.html` (status 404)

---

## Code Quality

- No hardcoded API keys or secrets — use Netlify environment variables
- All pages must be statically renderable (no `getServerSideProps` — Next.js static export)
- Keep `app/page.tsx` under 500 lines — extract sections to `components/`
- TypeScript strict mode — no `any`
- Tailwind for all styling — no inline style blocks
- SEO: `layout.tsx` must include `metadata` export with title and description
- Accessibility: images require `alt` attributes; interactive elements require keyboard focus styles

---

## Adding a New Page

1. Create `app/<route>/page.tsx`
2. Export a React component as default
3. Add metadata export:
   ```typescript
   export const metadata = {
     title: 'Page Title | Catalyst Talents',
     description: 'Page description',
   };
   ```
4. Add route to `app/sitemap.ts`
5. Link from navigation in `components/`
