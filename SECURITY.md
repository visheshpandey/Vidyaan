# Security

## Reporting a problem

Please do not open a public issue for a security problem. Use GitHub's private "Report a vulnerability" option on this repository's Security tab, or contact the repository owner directly. Include the steps to reproduce and the page involved. Reports are acknowledged within a few days.

## What the app stores, and where

Vidyaan has no backend and no accounts. Everything is kept in this browser's `localStorage`, under keys that start with `vidyaan:v1:`:

| Key | Contents |
| --- | --- |
| `profile`, `onboarded` | The answers the student gave (name, education, state, category, income band, marks) |
| `saved`, `applications` | Saved scholarship ids, application status, notes and history |
| `documents` | Document names, available or missing, and expiry dates. Files are never read or stored |
| `settings` | Theme, language, reminder preference |

Nothing is sent to a server. "Clear all my data" on the Profile page removes every key.

## Threat model

1. **No backend, no secrets.** There is no server to attack and no API key in the code. Environment variables with a `VITE_` prefix are public by design and must never hold secrets.
2. **No third-party scripts.** All JavaScript is served from the same origin. A Content-Security-Policy in `vercel.json` blocks everything else, plus framing (`frame-ancestors 'none'`), `nosniff`, a strict referrer policy and a locked-down permissions policy.
3. **Cross-site scripting.** React escapes all rendered text, and the code never uses `dangerouslySetInnerHTML`, `innerHTML`, `eval` or `document.write`. Free text is also cleaned (control, zero-width and bidi-override characters removed, length capped) before it is saved.
4. **Untrusted stored data.** Every value read from `localStorage` is validated with Zod. Corrupt, oversize or wrongly shaped data is discarded and replaced with safe defaults.
5. **Unsafe links.** Scholarship links must be `http:` or `https:` URLs. Records with any other scheme (for example `javascript:`) are dropped. External links open with `rel="noopener noreferrer"`.
6. **Spreadsheet injection.** Cells in the CSV export that start with `=`, `+`, `-`, `@`, a tab or a carriage return are prefixed so they cannot run as formulas.
7. **Dependencies.** `npm audit` is clean, Dependabot proposes weekly updates, and CI runs lint, type checks and tests on every change.
8. **Out of scope.** Anyone with access to the device or the browser profile can read the stored data. Use a private window on a shared computer and clear your data afterwards.
