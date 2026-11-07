# Contributing

1. `npm install`, then `npm run dev`.
2. Before opening a change run `npm run lint && npm run typecheck && npm test && npm run build`.
3. Read [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) first. It explains where code belongs.

## Rules

- Keep matching and other business logic pure, in `features/`, with tests. Pages and components only render.
- Components never touch localStorage. Use a store, which goes through `services/storage`.
- Read environment variables only in `src/config/env.ts`. Never put secrets in `VITE_` variables or in code.
- Never add a scholarship amount, deadline or URL you have not confirmed on the official site. Mark unverified records `dataType: "sample"`. Mark a record `verified` only with `lastVerifiedAt`.
- Handle failure: wrap anything that can throw (downloads, notifications, network) and show the user a clear message.
- Every new page gets an accessibility test in `tests/pages.a11y.test.tsx` and strings in both languages.

## Naming

| Thing | Convention | Example |
| --- | --- | --- |
| React component file | PascalCase | `ScholarshipRow.tsx` |
| Page file | PascalCase, one per route | `Discover.tsx` |
| Hook | `use` plus camelCase | `useDiscoverFilters.ts` |
| Store | camelCase ending in `Store` | `trackerStore.ts` |
| Pure module | camelCase | `readiness.ts`, `selectors.ts` |
| Test | same name plus `.test` | `readiness.test.ts` |
| Constant | UPPER_SNAKE_CASE | `SEARCH_DEBOUNCE_MS` |
| Type or interface | PascalCase | `Application` |
| Storage key | `grantly:v1:<name>` | `grantly:v1:profile` |
| i18n key | `area.name` | `dash.nextSteps` |

## Commits

Short, plain messages in the form `type: summary` (`feat`, `fix`, `test`, `docs`, `refactor`, `chore`).
