# Requirements and acceptance criteria

GRANTLY answers the challenge **"Rethinking the Scholarship Experience"**: build a modern digital solution that makes discovering and managing educational financial assistance simpler, more intuitive and accessible, and turns a complex experience into a seamless digital journey.

The brief names four struggles. Each becomes a requirement with acceptance criteria, the code that delivers it, and the tests that prove it.

## R1. Finding relevant opportunities (Discover)

| ID   | Acceptance criterion                                                                                           | Implementation                                                                                  | Tests                                                           |
| ---- | -------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| R1.1 | A student can search scholarships by name, provider or course, and results update as they type                 | `pages/Discover.tsx`, `features/discover/useDiscoverFilters.ts`, `features/discover/filters.ts` | `tests/discover.test.tsx`, `features/discover/filters.test.ts`  |
| R1.2 | Results can be filtered (eligibility, level, provider, closing date) and sorted (best match, deadline, amount) | `features/discover/FilterControls.tsx`, `features/matching/rank.ts`                             | `tests/discover.test.tsx`, `features/matching/engine.test.ts`   |
| R1.3 | Filters live in the URL so a search can be shared or bookmarked                                                | `features/discover/filters.ts` (`filtersFromParams`, `filtersToParams`)                         | `features/discover/filters.test.ts`                             |
| R1.4 | The best matches for the student appear first, without the student searching                                   | `pages/Dashboard.tsx`, `features/matching/rank.ts`                                              | `features/dashboard/selectors.test.ts`                          |
| R1.5 | A student can compare up to three scholarships side by side                                                    | `pages/Compare.tsx`, `store/compareStore.ts`                                                    | `tests/save-and-compare.test.tsx`, `store/compareStore.test.ts` |
| R1.6 | An empty search explains what to do next                                                                       | `pages/Discover.tsx` empty state                                                                | `tests/discover.test.tsx`                                       |

## R2. Understanding available options (Eligibility and plain language)

| ID   | Acceptance criterion                                                                    | Implementation                                                              | Tests                                 |
| ---- | --------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- | ------------------------------------- |
| R2.1 | Every scholarship shows one of three results: Eligible, Needs information, Not eligible | `features/matching/engine.ts`, `features/matching/StatusBadge.tsx`          | `features/matching/engine.test.ts`    |
| R2.2 | Every result lists the exact reasons in plain language                                  | `features/matching/rules.ts`, `features/matching/EligibilityBreakdown.tsx`  | `features/matching/engine.test.ts`    |
| R2.3 | A question the student skipped is never treated as a failure; the app says what to add  | `features/matching/engine.ts` (`unknown` rules), `EligibilityBreakdown.tsx` | `features/matching/engine.test.ts`    |
| R2.4 | Amounts, deadlines, benefits and required documents are shown together on one page      | `pages/ScholarshipDetail.tsx`                                               | `tests/pages.a11y.test.tsx`           |
| R2.5 | Difficult words are explained, and common questions are answered                        | `pages/Help.tsx`, `data/glossary.ts`                                        | `tests/pages.a11y.test.tsx`           |
| R2.6 | Unverified data is labelled and unknown deadlines say "Check official site"             | `data/scholarships.json`, `services/scholarshipService.ts`                  | `services/scholarshipService.test.ts` |

## R3. Navigating application processes (Apply and track)

| ID   | Acceptance criterion                                                                                                                          | Implementation                                                        | Tests                                                                      |
| ---- | --------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| R3.1 | Each scholarship has numbered steps for how to apply and a link to the official site                                                          | `pages/ScholarshipDetail.tsx`                                         | `tests/pages.a11y.test.tsx`, `e2e/journey.spec.ts`                         |
| R3.2 | A student can start tracking a scholarship and move it through Saved, Preparing, Submitted, Under review, Approved, Disbursed or Not selected | `features/applications/transitions.ts`, `StatusMenu.tsx`, `Board.tsx` | `features/applications/transitions.test.ts`, `tests/applications.test.tsx` |
| R3.3 | Status can be changed by menu, and by drag and drop with mouse, touch or keyboard                                                             | `features/applications/Board.tsx`                                     | `tests/applications.test.tsx`                                              |
| R3.4 | The app never applies for the student                                                                                                         | `pages/ScholarshipDetail.tsx` (links only)                            | `e2e/journey.spec.ts`                                                      |

## R4. Keeping track of important information (Documents, deadlines, notes)

| ID   | Acceptance criterion                                                                                | Implementation                                                                          | Tests                                                 |
| ---- | --------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| R4.1 | The student can list documents, mark them available or missing, and set expiry dates                | `pages/Documents.tsx`, `store/documentStore.ts`                                         | `tests/documents.test.tsx`                            |
| R4.2 | Each application shows how many of its required documents are ready                                 | `features/documents/readiness.ts`                                                       | `features/documents/readiness.test.ts`                |
| R4.3 | Deadlines for saved and tracked scholarships appear on a calendar and in an upcoming list           | `pages/Deadlines.tsx`, `features/deadlines/events.ts`                                   | `features/deadlines/*.test.ts`                        |
| R4.4 | Deadlines can be exported to a calendar and trigger an optional daily reminder                      | `features/deadlines/ics.ts`, `features/deadlines/reminders.ts`, `hooks/useReminders.ts` | `features/deadlines/ics.test.ts`, `reminders.test.ts` |
| R4.5 | Notes and a full status history are kept per application                                            | `pages/ApplicationDetail.tsx`, `store/trackerStore.ts`                                  | `tests/applications.test.tsx`                         |
| R4.6 | The dashboard turns this data into next steps (missing documents, expiring papers, close deadlines) | `features/dashboard/selectors.ts`                                                       | `features/dashboard/selectors.test.ts`                |
| R4.7 | Data survives a refresh, can be exported (JSON, CSV) and can be cleared                             | `services/storage.ts`, `services/exportService.ts`, `pages/Profile.tsx`                 | `services/storage.test.ts`, `tests/profile.test.tsx`  |

## R5. Simpler, more intuitive and accessible

| ID   | Acceptance criterion                                                                            | Implementation                                      | Tests                                                  |
| ---- | ----------------------------------------------------------------------------------------------- | --------------------------------------------------- | ------------------------------------------------------ |
| R5.1 | A new student reaches personalised results in four short steps, and can try a demo in one click | `pages/Onboarding.tsx`, `features/demo/demoMode.ts` | `tests/onboarding.test.tsx`, `e2e/journey.spec.ts`     |
| R5.2 | Every page works with a keyboard and a screen reader, with no axe violations                    | `components/layout/*`, `components/ui/*`            | `tests/pages.a11y.test.tsx`, `tests/keyboard.test.tsx` |
| R5.3 | Text meets WCAG AA contrast in light and dark themes                                            | `src/index.css` tokens                              | `docs/ACCESSIBILITY.md`                                |
| R5.4 | The app works from 360 px phones to desktops with no sideways scrolling                         | Tailwind responsive layout                          | `e2e/journey.spec.ts` (desktop and phone projects)     |
| R5.5 | Available in English and Hindi, light and dark                                                  | `src/i18n`, `store/settingsStore.ts`                | `tests/reliability.test.tsx`                           |

## Traceability check

Every requirement ID above is carried in the `describe(...)` titles of the tests that prove it, for example `R2.3 skipped answers...` or `R1.3 url state`. To see what proves a requirement, search the repository for its ID (`grep -rn "R2.3" src tests e2e`). Each requirement also maps to user stories in [USER_STORIES.md](USER_STORIES.md), and R6 criteria are evidenced by the files listed in the table below. A requirement with no test title carrying its ID is a gap and should be fixed before release.

## R6. Quality attributes

| ID   | Criterion       | Evidence                                                                                                                    |
| ---- | --------------- | --------------------------------------------------------------------------------------------------------------------------- |
| R6.1 | Fast first load | Self-hosted fonts, route-level code splitting, immutable caching (`vercel.json`), Lighthouse results in README              |
| R6.2 | Secure          | Input sanitising, https-only links, strict CSP, no secrets; see `SECURITY.md`                                               |
| R6.3 | Reliable        | Validated storage with safe fallback, error boundaries, route error pages                                                   |
| R6.4 | Maintainable    | Layered architecture, ESLint with zero errors, strict TypeScript, tests and coverage thresholds; see `docs/ARCHITECTURE.md` |
