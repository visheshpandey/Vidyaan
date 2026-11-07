# User stories

Stories are grouped by the four verbs in the brief "Rethinking the Scholarship Experience" (Discover, Understand, Navigate, Track), plus Accessibility and Reliability. Personas are described in [PERSONAS.md](PERSONAS.md). Requirement IDs refer to [REQUIREMENTS.md](REQUIREMENTS.md), and test titles carry the same IDs.

## Discover

### US-01 Search by name, provider or course
As **Priya**, I want to type a word and see matching scholarships so that I do not scroll through the whole list.

- Given I am on Discover, when I type "AICTE", then only scholarships whose name, provider or course match are listed.
- Given I clear the search, when the box is empty, then the full list returns.
- Given nothing matches, when the list is empty, then a message tells me to loosen the search.

Satisfies: R1.1, R1.6. Files: `src/pages/Discover.tsx`, `src/features/discover/filters.ts`, `src/features/discover/useDiscoverFilters.ts`.

### US-02 Filter and sort
As **Meera**, I want to filter by level, provider and closing date and sort by deadline or amount so that I see only what fits.

- Given I choose a level and provider, when results update, then every row satisfies both filters and removable chips show them.
- Given I pick "Deadline", when results update, then the nearest closing date is first and unknown deadlines come last.

Satisfies: R1.2. Files: `src/features/discover/FilterControls.tsx`, `src/features/matching/rank.ts`.

### US-03 Share a search
As **Arjun**, I want my filters stored in the web address so that I can send the same search to a friend.

- Given I set a search and filters, when I copy the URL, then the address contains them.
- Given someone opens that URL, when Discover loads, then the same filters are applied.

Satisfies: R1.3. Files: `src/features/discover/filters.ts` (`filtersFromParams`, `filtersToParams`).

### US-04 Best matches first
As **Priya**, I want the dashboard to show my best matches without searching so that I start from what I can win.

- Given my profile is complete, when I open the dashboard, then eligible scholarships are ranked first.
- Given I have no profile, when I open the dashboard, then I am asked to finish onboarding.

Satisfies: R1.4. Files: `src/pages/Dashboard.tsx`, `src/features/matching/rank.ts`, `src/features/dashboard/selectors.ts`.

### US-05 Compare options
As **Meera**, I want to compare up to three scholarships side by side so that I can choose.

- Given I add three scholarships, when I try a fourth, then I am told the limit is three.
- Given I open Compare, when the table loads, then amount, deadline and documents are in aligned columns.

Satisfies: R1.5. Files: `src/pages/Compare.tsx`, `src/store/compareStore.ts`.

## Understand

### US-06 Clear eligibility result
As **Arjun**, I want each scholarship to say Eligible, Needs information or Not eligible so that I know where I stand.

- Given my profile, when I view a scholarship, then exactly one of the three results is shown with an icon and text.
- Given I fail a rule, when I open the breakdown, then the failing rule is listed in plain words.

Satisfies: R2.1, R2.2. Files: `src/features/matching/engine.ts`, `rules.ts`, `StatusBadge.tsx`, `EligibilityBreakdown.tsx`.

### US-07 Skipped answers are not failures
As **Priya**, I want a question I skipped to be treated as unknown so that I am not wrongly rejected.

- Given I skipped my marks, when a scholarship needs a minimum percentage, then the result is Needs information.
- Given the result, when I read it, then it tells me which answer to add and links to my profile.

Satisfies: R2.3. Files: `src/features/matching/engine.ts`, `EligibilityBreakdown.tsx`.

### US-08 Everything on one page
As **Meera**, I want amount, deadline, benefits and required documents together so that I do not open five tabs.

- Given I open a scholarship, when the page loads, then amount, deadline, benefits and documents are visible.
- Given the deadline is unknown, when it is shown, then it reads "Check official site".

Satisfies: R2.4, R2.6. Files: `src/pages/ScholarshipDetail.tsx`, `src/services/scholarshipService.ts`.

### US-09 Plain-language help
As **Arjun**, I want difficult words explained so that I can follow the rules.

- Given I open Help, when I search a term such as "domicile", then a short explanation appears.
- Given I read the FAQ, when I expand a question, then the answer is in plain language.

Satisfies: R2.5. Files: `src/pages/Help.tsx`, `src/data/glossary.ts`.

### US-10 What-if simulator
As **Priya**, I want to change one answer and see which scholarships it unlocks so that I know what to improve or check.

- Given I open the What-if panel on Profile, when I change my category or income, then the count of newly eligible scholarships updates.
- Given I leave the panel, when I return, then my saved profile is unchanged.

Satisfies: R2.1, R2.3. Files: `src/features/matching/whatIf.ts`, `src/pages/Profile.tsx`.

## Navigate

### US-11 Step-by-step application
As **Arjun**, I want numbered steps and an official link so that I know how to apply.

- Given I open a scholarship, when I read "How to apply", then numbered steps are listed.
- Given I tick a step in my checklist, when I reload, then it stays ticked and progress is shown.

Satisfies: R3.1. Files: `src/pages/ScholarshipDetail.tsx`, `src/features/applications/steps.ts`.

### US-12 Track each application
As **Priya**, I want to move an application from Saved to Disbursed so that I always know its stage.

- Given I start tracking, when I choose "Move to Submitted", then the status and history update.
- Given the board, when I drag a card with mouse, touch or keyboard, then its status changes.

Satisfies: R3.2, R3.3. Files: `src/features/applications/transitions.ts`, `StatusMenu.tsx`, `Board.tsx`.

### US-13 The app never applies for me
As **Arjun**, I want GRANTLY to send me to the official site so that my data and application stay in my control.

- Given I choose "View official application", when the link opens, then it is the provider's own site in a new tab.
- Given I browse any page, when I look for a submit button, then none submits to a provider.

Satisfies: R3.4. Files: `src/pages/ScholarshipDetail.tsx`.

## Track

### US-14 Documents and readiness
As **Meera**, I want to list documents with expiry dates so that I know what is ready.

- Given I add a document marked available with an expiry, when it is near expiry, then a warning is shown.
- Given an application, when I view it, then "x of y documents ready" is shown.

Satisfies: R4.1, R4.2. Files: `src/pages/Documents.tsx`, `src/features/documents/readiness.ts`, `src/store/documentStore.ts`.

### US-15 Deadlines, calendar and reminders
As **Meera**, I want deadlines on a calendar I can export so that I never miss a date.

- Given I saved scholarships, when I open Deadlines, then they appear in a calendar and upcoming list.
- Given I press export, when the file downloads, then it is a valid `.ics` file.
- Given I allow notifications, when a deadline is near, then I get one reminder per day.

Satisfies: R4.3, R4.4, R4.6. Files: `src/pages/Deadlines.tsx`, `src/features/deadlines/ics.ts`, `reminders.ts`, `src/hooks/useReminders.ts`.

### US-16 Notes, history and my data
As **Priya**, I want notes and history per application, and to export or clear my data, so that I stay in control.

- Given an application, when I add a note, then it is saved with the status history.
- Given Profile, when I export, then I receive JSON or CSV; when I clear, then all data is removed.

Satisfies: R4.5, R4.7. Files: `src/pages/ApplicationDetail.tsx`, `src/store/trackerStore.ts`, `src/services/exportService.ts`, `src/services/storage.ts`.

## Accessibility

### US-17 Usable by everyone
As **Arjun**, I want a keyboard-friendly, Hindi-capable, mobile-first app so that I can use it on a shared laptop or a small phone.

- Given I use only the keyboard, when I tab through any page, then every control is reachable and visible.
- Given I switch to Hindi or dark mode, when I reload, then my choice is kept.
- Given a 360 px screen, when I open any page, then nothing scrolls sideways.

Satisfies: R5.1, R5.2, R5.3, R5.4, R5.5. Files: `src/components/layout/*`, `src/i18n/*`, `src/store/settingsStore.ts`, `src/pages/Onboarding.tsx`.

## Reliability

### US-18 Works offline and survives bad data
As **Priya**, I want the app to keep working with no signal or corrupt saved data so that I never lose my place.

- Given I am offline, when I open the app, then bundled data loads and a banner says so.
- Given saved data is corrupt, when the app starts, then it falls back to safe defaults without a crash.
- Given a page throws, when it renders, then an error page offers a way back.

Satisfies: R6.1, R6.3, R2.6. Files: `src/api/*`, `src/app/ErrorBoundary.tsx`, `src/app/ScholarshipsProvider.tsx`, `src/services/storage.ts`, `scripts/serviceWorkerPlugin.ts`.
