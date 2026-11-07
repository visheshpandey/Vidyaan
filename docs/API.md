# Data layer

All scholarship data reaches the UI through `src/api/`. The browser calls only our own origin or our own backend, never third-party APIs. Every call has a timeout, validation, a 10 minute cache and a fallback.

## How a request flows

```
ScholarshipsProvider -> scholarshipsApi -> TtlCache hit? return
                                         -> getJson (timeout, Zod) -> keep valid records -> cache
                                         -> any failure -> bundled data (source: "fallback")
```

| File | Role |
| --- | --- |
| `src/api/httpClient.ts` | `getJson(path, schema, options)`: GET only, no credentials, abort on timeout, validates with Zod |
| `src/api/cache.ts` | `TtlCache`: in-memory cache with a time to live (default 10 minutes) |
| `src/api/scholarshipsApi.ts` | `createScholarshipsApi`: fetch, per-record validation, cache, fallback |
| `src/api/bundledScholarships.ts` | The offline fallback, built from `src/data/scholarships.json` |
| `src/api/ApiError.ts` | The only error type thrown by the layer |
| `src/config/env.ts` | Validated environment variables |

One invalid record is dropped without hiding the others. If no record is valid, the bundled data is used and the UI shows that it is using saved data.

## Runtime data file

With no backend configured, the app reads `/data/scholarships.json` from its own origin (`public/data/scholarships.json`). Editing that file and redeploying updates the list without a code change. The service worker serves the last copy when the network is down.

## Environment variables

All are optional and public in the built site. Never put secrets in them. Copy `.env.example` to `.env.local` to change them.

| Variable | Default | Meaning |
| --- | --- | --- |
| `VITE_API_BASE_URL` | empty | Our backend. Empty means `/data/scholarships.json` plus bundled fallback |
| `VITE_API_TIMEOUT_MS` | `8000` | Abort a request after this many milliseconds |
| `VITE_API_CACHE_MS` | `600000` | Cache lifetime. `0` turns caching off |

## ApiError codes

| Code | When | Extra |
| --- | --- | --- |
| `network` | No base URL, offline, DNS or connection failure | |
| `timeout` | No response within `VITE_API_TIMEOUT_MS` | |
| `http` | Response status is not 2xx | `status` holds the HTTP status |
| `invalid` | Body is not JSON or does not match the schema | `cause` holds the Zod error |

## Scholarship JSON shape

Defined in `src/types/scholarship.ts` and validated by `scholarshipSchema` in `src/data/schemas.ts`. The endpoint returns an array of these.

```json
{
  "id": "aicte-pragati",
  "title": "AICTE Pragati Scholarship for Girls",
  "provider": "AICTE (Government of India)",
  "providerType": "government",
  "type": "need",
  "description": "Support for girls entering AICTE-approved technical programmes.",
  "benefits": ["Reported annual grant of about 50,000 rupees"],
  "amount": { "value": 50000, "period": "yearly" },
  "deadline": null,
  "rules": { "levels": ["diploma", "ug"], "genders": ["female"], "maxIncome": 800000 },
  "requiredDocuments": ["Admission proof", "Income certificate", "Bank passbook"],
  "steps": ["Register on the National Scholarship Portal", "Fill the application form"],
  "applicationUrl": "https://scholarships.gov.in",
  "sourceUrl": "https://scholarships.gov.in",
  "dataType": "sample"
}
```

Rules: `deadline` is an ISO date or `null` (the UI then says "Check official site"). `providerType` is government, private, university or ngo. `type` is merit, need or special. `amount.period` is one-time, yearly or monthly. URLs must be https. `dataType: "verified"` requires `lastVerifiedAt`.

## Plugging in a real backend

1. Serve `GET {base}/scholarships` returning the JSON array above, with CORS allowing the app origin.
2. Set `VITE_API_BASE_URL=https://api.example.org/v1` and rebuild.
3. If the backend needs third-party data or keys, call those from the server, keep keys in server environment variables, and cache for 10 minutes with a fallback.
4. Test with one request first:

```bash
curl -s https://api.example.org/v1/scholarships | head -c 400
```

5. If the backend is down the app keeps working on bundled data. Tests: `src/api/api.test.ts`, `src/api/cache.test.ts`, `tests/scholarships-provider.test.tsx`.
