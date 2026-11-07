# Vidyaan

**Find your fit. Follow through.**

Vidyaan is a scholarship discovery and application tracker for Indian students. It checks every scholarship against your profile, explains each result in plain language, and helps you follow each application through to the end.

It is a frontend-only app. There is no backend and no account: everything is stored in your browser.

## What it does

| Problem | Feature |
| --- | --- |
| Hard to know which scholarships you qualify for | Eligibility engine with three outcomes: **Eligible**, **Needs information**, **Not eligible**, each with the exact reasons |
| Skipped answers wrongly treated as failures | A missing answer is never "not eligible". It becomes "Needs information" with a link to add it |
| Too many scholarships to browse | Discover: debounced search, filters kept in the URL (shareable), removable chips, sorting by match, deadline or amount |
| Applications get lost | Tracker from Saved to Disbursed with notes and history. Change status with the "Move to" menu, or drag cards on the board (mouse, touch or keyboard) |
| Missing paperwork | Documents page with expiry dates and per-application readiness |
| Missed dates | Deadlines calendar, upcoming list, `.ics` export and an optional once-a-day browser reminder |
| Choosing between options | Compare up to three scholarships side by side |
| Different languages and lighting | Dark mode, and English or Hindi for the main screens |
| Data lock-in | Export everything as JSON, applications as CSV, or clear it all |

Vidyaan never submits an application for you. "View official application" always opens the provider's own site.

## Data honesty

No scholarship in the bundled dataset is marked "verified". Five records describe real schemes (AICTE Pragati, AICTE Saksham, Central Sector, MP Medhavi Vidyarthi, Reliance Foundation UG) with links to the official portals. Ten are fictional demo records. All are labelled **Demo data** in the UI. Where an official deadline is unknown the app shows "Check official site" and never invents one. A test fails the build if a record claims to be verified without a check date.

## Quick start

```bash
npm install
npm run dev          # http://localhost:5173
```

Press **Try the demo (Priya)** on the landing page to load a sample student with applications and documents.

| Script | Purpose |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Typecheck and build for production |
| `npm run preview` | Serve the production build |
| `npm run lint` | Lint with oxlint |
| `npm run typecheck` | TypeScript strict check |
| `npm test` | Run unit and accessibility tests |
| `npm run test:coverage` | Tests with coverage |

## Environment

No configuration is required. To change defaults, copy [.env.example](.env.example) to `.env.local`. All variables are optional and validated at startup in `src/config/env.ts`; a missing or malformed value falls back to a safe default. Code reads config from `env`, never from `import.meta.env` directly.

| Variable | Default | Purpose |
| --- | --- | --- |
| `VITE_APP_NAME` | `Vidyaan` | Product name in the UI |
| `VITE_API_BASE_URL` | empty | Our own backend. Empty means bundled data only |
| `VITE_API_TIMEOUT_MS` | `8000` | Request timeout |
| `VITE_API_CACHE_MS` | `600000` | Response cache time (10 minutes) |

`VITE_` variables are public in the built site, so never put secrets in them. The browser only calls our own backend, with a fallback to bundled data if it is down (`src/api/`).

## Stack

React 19, TypeScript (strict), Vite, Tailwind CSS v4, React Router, Zustand, Zod, Radix UI primitives, date-fns, Vitest, Testing Library and jest-axe.

## Architecture in short

```
src/
  app/          router, route guard, error boundaries
  pages/        one file per route, thin
  features/     business logic and feature components (matching, discover, applications, ...)
  components/   generic ui/ and layout/
  store/        Zustand stores, one per domain
  services/     storage, exports, scholarship source
  api/          HTTP client for a future backend (timeout, validation, cache, fallback)
  config/       validated environment variables
  i18n/         English and Hindi
```

Match results are derived from the profile on every render and never stored. Stored data is validated on read and falls back to safe defaults if it is corrupt. See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Accessibility

Skip link, labelled form fields with associated errors, status shown with icon and text (never colour alone), keyboard-operable menus and dialogs, live regions for results and toasts, reduced-motion support, 44px touch targets. Every page is checked with axe in the test suite. See [docs/ACCESSIBILITY.md](docs/ACCESSIBILITY.md).

## Performance

Routes are code-split and lazy loaded, dependencies are split into vendor, UI and data chunks, fonts use `display=swap`, and search input is debounced.

## Security and privacy

- No backend, no tracking, no third-party calls other than Google Fonts.
- Content-Security-Policy and other headers are set in `vercel.json`.
- All stored data is parsed with Zod; corrupt data is discarded, not trusted.
- External links use `rel="noopener noreferrer"`.
- CSV export neutralises spreadsheet formula injection.
- Documents are tracked by name and date only; files are never read or stored.

## Deploying

The build output in `dist/` is a static site. On Vercel, import the repository and keep the defaults (build `npm run build`, output `dist`). `vercel.json` already contains the single-page-app rewrite and security headers.

## Roadmap

Full Hindi coverage of every screen, and replacing the bundled dataset with verified records.

## License

MIT
