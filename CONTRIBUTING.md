# Contributing

1. `npm install`, then `npm run dev`.
2. Before opening a change run `npm run lint && npm run typecheck && npm test && npm run build`.
3. Keep matching logic pure and covered by tests. Components must not read or write localStorage; use a store.
4. Never add a scholarship amount, deadline or URL you have not confirmed on the official site. Mark unverified records `dataType: "sample"`. Mark a record `verified` only with `lastVerifiedAt`.
5. Use short, plain commit messages in the form `type: summary` (`feat`, `fix`, `test`, `docs`, `chore`).
