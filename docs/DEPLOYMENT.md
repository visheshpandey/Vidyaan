# Deployment

GRANTLY is a static site. The live deployment is https://grantly-delta.vercel.app.

## Vercel steps

1. Push the repository to GitHub.
2. In Vercel choose Add New, Project, and import the repository.
3. Keep the defaults: framework Vite, build command `npm run build`, output directory `dist`.
4. Add environment variables only if needed (see below), then Deploy.
5. Every push to `main` deploys to production. Other branches get preview URLs.

## vercel.json

| Section | Purpose |
| --- | --- |
| `rewrites` | Sends every path except assets, fonts, icons, illustrations, data, `robots.txt`, `sitemap.xml`, `manifest.webmanifest` and `sw.js` to `index.html`, so deep links work |
| Security headers | Strict Content-Security-Policy (same origin only), HSTS, `X-Frame-Options: DENY`, `nosniff`, Referrer-Policy, Permissions-Policy |
| `/assets/` and `/fonts/` | `Cache-Control: public, max-age=31536000, immutable` because file names are hashed |
| `/icons/` and `/illustrations/` | One week cache |
| `/sw.js` | `no-cache` so browsers always check for a new service worker |
| `/manifest.webmanifest` | Correct content type and one day cache |

Because the CSP has `connect-src 'self'`, a backend on another origin must be added to `connect-src` before it will work.

## Service worker

`scripts/serviceWorkerPlugin.ts` generates `sw.js` at build time, and `src/main.tsx` registers it in production only. It makes the app installable and lets it open offline. After a deploy the new worker installs on the next visit. See [TROUBLESHOOTING.md](TROUBLESHOOTING.md) if old content persists.

## Environment variables

Set in Vercel under Settings, Environment Variables. They are public in the built site.

| Variable | Default |
| --- | --- |
| `VITE_APP_NAME` | `GRANTLY` |
| `VITE_API_BASE_URL` | empty |
| `VITE_API_TIMEOUT_MS` | `8000` |
| `VITE_API_CACHE_MS` | `600000` |

Details are in [API.md](API.md). Changing a variable needs a new build.

## Verify a deployment

```bash
curl -sI https://grantly-delta.vercel.app | grep -i -E "content-security|strict-transport|x-frame"
curl -s https://grantly-delta.vercel.app/data/scholarships.json | head -c 300
curl -sI https://grantly-delta.vercel.app/sw.js | grep -i cache-control
curl -s -o /dev/null -w "%{http_code}\n" https://grantly-delta.vercel.app/discover
```

Expected: the headers are present, the JSON starts with `[`, `sw.js` is `no-cache`, and the deep link returns 200.

Lighthouse: open the site in Chrome, DevTools, Lighthouse, mobile, then run. Targets are accessibility 100, SEO 100 and best practices above 95. Or run `npx lighthouse https://grantly-delta.vercel.app --form-factor=mobile --view`.

Before releasing run `npm run check` and `npm run e2e`.
