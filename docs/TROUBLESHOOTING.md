# Troubleshooting

## Blank page

- Open the browser console. A red error usually names the file.
- Run `npm install` again, then `npm run dev`. Node 20 or newer is needed.
- On a deployment, a rewrite problem shows as a 404 on deep links. Check `vercel.json` is unchanged.
- A crash inside a page shows an error page with a way back, not a blank screen. A fully blank page is a build or script load failure.

## Old content after a deploy

The service worker keeps a copy of the app so it opens offline, so a browser may show the previous version once.

1. Reload twice. The new worker installs on the first visit and takes over on the next.
2. To force it: DevTools, Application, Service Workers, Unregister, then Storage, Clear site data, then reload.
3. In Chrome you can also use the hard reload (Ctrl+Shift+R).
4. `curl -sI <site>/sw.js` must show `Cache-Control: no-cache`.

## My saved scholarships or applications disappeared

Everything is stored in the browser's localStorage. It is lost if site data is cleared, if you use a private window, or if you switch browser or device. Use Profile, Export, to keep a JSON backup. If stored data is corrupt, the app discards it and starts from safe defaults.

## Reminders do not appear

- Allow notifications when asked. If you blocked them, click the lock icon in the address bar, set Notifications to Allow, and reload.
- Reminders show once a day, only while the app has been opened, and only for deadlines that are near.
- Some phones block notifications from browsers in battery saver mode. Use the `.ics` export as a backup.

## Hindi text looks wrong

Fonts are self-hosted. If boxes appear, clear site data so the fonts download again, and check the network tab for failed requests under `/fonts/`. Update an old browser if it lacks Devanagari support.

## Scholarship list says it is using saved data

The live data file could not be fetched, so bundled data is shown. Check your connection, or the response of `/data/scholarships.json`. See [API.md](API.md).

## Repo checks fail

| Check | Command | Common cause |
| --- | --- | --- |
| Lint | `npm run lint` | Unused variable, missing JSDoc style rule, hook dependency. Try `npm run lint:fix` |
| Types | `npm run typecheck` | Indexed access may be undefined (`noUncheckedIndexedAccess`) |
| Unit tests | `npm test` | A changed data count, or a missing string in the Hindi dictionary |
| End to end | `npm run e2e` | Run `npx playwright install` once to get the browsers |
| Build | `npm run build` | Fix type errors first |

If it still fails, open an issue using the bug report template.
