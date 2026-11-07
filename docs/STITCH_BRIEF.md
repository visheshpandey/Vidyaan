# Vidyaan: Design Brief for Stitch

Use Part 1 as the project-wide prompt. Then paste one screen prompt from Part 4 at a time. Part 3 lists what is weak in the current build, so the redesign can fix it.

---

## Part 1. Project prompt (paste first)

Design a responsive web app called **Vidyaan**, a scholarship discovery and application tracker for Indian students (school, diploma, undergraduate, postgraduate, PhD). Tagline: **"Find your fit. Follow through."**

**What it does**
1. Checks every scholarship against the student's profile and gives one of three results: **Eligible**, **Needs information**, **Not eligible**. Every result shows the exact reasons in plain language.
2. A skipped answer is never "not eligible". It becomes "Needs information" with a link to add it.
3. Lets the student save scholarships, track each application from Saved to Disbursed, keep a documents checklist, and see deadlines on a calendar.
4. Never applies on the student's behalf. It always links to the official site.
5. No account. Data stays in the browser.

**Audience:** first-generation and low-income students, 17 to 25, mostly on mid-range Android phones, some on shared laptops. Many are anxious about missing deadlines and about getting rejected. The tone is calm, clear and trustworthy, not startup-flashy.

**Feel:** calm, credible, warm, modern. Think "trusted public service made with care", not fintech neon. Lots of breathing room. One memorable moment per screen, everything else quiet.

**Platforms:** mobile first (360 to 430 px), then tablet (768) and desktop (1024 to 1440). Desktop has a left sidebar. Mobile has a bottom bar.

**Languages:** English and Hindi (Devanagari must look good in headings and body). Light and dark themes.

---

## Part 2. Design system

### Colour
**Stitch chooses the palette.** Do not use any colours from earlier versions of this app. Pick one cohesive palette that fits the feel in Part 1, for both a light and a dark theme, and keep it identical across every screen. Only these limits apply:
- Text meets WCAG AA contrast (4.5:1 for body text, 3:1 for large text) in both themes.
- Three meanings need clearly different colours: positive (eligible, ready), caution (needs information, expiring), negative (not eligible, errors). They must never be the only signal, because every one is also shown with an icon and text.
- One main action colour for primary buttons and active navigation, and one accent used sparingly.
- Avoid purple or pink gradients and neon.

### Type
- Headings: **DM Serif Display**. H1 36 to 48, H2 24 to 30, H3 20. Slightly tight leading.
- UI and body: **Inter**, 15 to 16 px, line height 1.5. Numbers use tabular figures.
- Hindi: Noto Sans Devanagari for body, Noto Serif Devanagari for headings.
- Body line length 60 to 75 characters. Sentence case everywhere. No all-caps labels.

### Shape and space
- 4 px grid. Cards radius 12, buttons and inputs radius 10, badges fully round.
- Cards: 1 px line border, very soft tinted shadow. Use dividers instead of cards where a card adds nothing.
- Sidebar 244 px, top header 72 px, content max width 1152 px, 16 px side padding on mobile.
- Touch targets at least 44 px.

### Components
- **Buttons:** primary (filled main colour), secondary (outlined), ghost (text only), danger. Pressed state scales to 98 percent.
- **Verdict badge:** icon plus text, never colour alone. Eligible (check circle, positive colour), Needs information (alert circle, caution colour), Not eligible (x circle, negative colour). Soft tinted fill.
- **Status pill** for applications: Saved (neutral), Preparing (caution), Submitted and Under review (informational), Approved and Disbursed (positive), Not selected (negative).
- **Scholarship card** (the signature component): verdict badge and "Demo data" tag on top, serif title, provider in muted text, amount (bold, tabular, with "per year"), deadline with clock icon and "In 18 days", then a row with "See why" link, Compare checkbox, Save button.
- **Eligibility breakdown:** list of rows, each with an icon, one plain sentence ("Your income ₹2.4L is under the ₹2.5L limit"), and for unknowns an "Add this to your profile" link.
- **Form fields:** label above, hint below, error below with an icon. Native selects.
- **Dialog and bottom sheet:** title in serif, close button, clear primary action. Used for filters on mobile and for confirmations.
- **Toast:** high-contrast pill at the bottom, auto-dismiss in 4 seconds, with a dismiss button.
- **Progress bar:** label left, percentage right, 8 px track.
- **Empty state:** icon, serif title, one helpful sentence, one action button.
- **Skeleton loaders** that match the card shape.

### Navigation
Desktop sidebar: Dashboard, Discover, Compare, Saved, Applications, Documents, Deadlines, Profile. Mobile bottom bar: Dashboard, Discover, Applications, More (Compare, Saved, Documents, Deadlines, Profile). Header has a language select, a dark mode toggle and a profile chip.

### Rules for the designer
- No em dashes or en dashes in any text. Use a hyphen or restructure.
- No purple gradients, no neon, no emoji as icons, no fake product screenshots made of boxes.
- One icon family, one stroke width.
- Real content in every state, no lorem ipsum.
- Every status shows an icon or text, never colour alone.

---

## Part 3. What to improve in the current build

These are the weak spots. Ask Stitch to fix them.

1. **Landing page is thin.** Only a headline, one card and three text rows. Add a stronger hero, a short "how it works" in three steps, a real-looking preview of the dashboard, a trust section (no account, data stays in your browser, official links only), and a clear final call to action.
2. **No imagery or illustration.** The whole app is text and cards. Add a restrained illustration style or warm photography of students, plus meaningful empty-state art.
3. **Cards are all identical.** Differentiate by verdict, for example a thin colour edge or tint, and give "closing soon" scholarships stronger emphasis.
4. **Dashboard is a plain list.** Add a progress ring or bar for "applications ready", a next-deadline highlight card, a "profile completeness" meter that explains how many more scholarships it unlocks, and a small timeline for upcoming dates.
5. **Discover feels like a catalogue.** Add a summary strip ("9 eligible, 4 need information"), quick filter tabs by verdict, a clearer sort, and a sticky mobile filter bar.
6. **Detail page is dense.** Add a sticky summary box (amount, deadline, verdict, Save, Start tracking), an at-a-glance checklist at the top, and collapsible sections for steps and documents.
7. **Onboarding is a plain form.** Make it conversational, one question group per screen, a friendly progress indicator, and a final review that shows "You may match N scholarships" before finishing.
8. **Applications board is bare.** Add column accents matching the status pills, card counts, deadline warnings on cards, and a calmer mobile version (status tabs, no board).
9. **Deadlines calendar is basic.** Show event dots that differ by type (scholarship or document), tap a day to see its events, and a "this week" strip.
10. **Documents page lacks guidance.** Add which applications each document unlocks, expiry warnings with a clear date, and a readiness ring per application.
11. **Hindi is partial.** Design every screen with Devanagari in mind (longer strings, taller line height).
12. **Micro-interactions.** Save bookmark animation, status change confirmation, subtle card hover lift, all respecting reduced motion.

---

## Part 4. Screen-by-screen prompts

Each prompt assumes Part 1 and Part 2 are loaded. Design desktop (1440) and mobile (390) for each.

### 1. Landing
Hero on the left: serif headline "Find your fit. Follow through.", one sentence ("Vidyaan checks scholarships against your profile, explains every result in plain language, and helps you track each application to the end."), primary button "Check my eligibility", secondary "Try the demo (Priya)", small note "No account needed. Everything stays in your browser." On the right: a real scholarship card for "Demo Merit Award for Engineering Students" (Demo Education Trust, ₹40,000 per year, 15 Dec 2026, In 38 days, Eligible) with caption "An example result for a sample student." Below: three steps (Tell us about you, See your results with reasons, Track every application). Then a section "Every result comes with a reason" with the three verdict badges and one sentence each. Then a trust band and a closing call to action. Footer: "Vidyaan never applies for you. Always confirm details on the official site."

### 2. Onboarding (4 steps)
Steps: About you (name, gender optional, state), Education (level, course, year, institution type), Eligibility details (category, family income, last exam percentage, disability, minority, preferences chips: Merit-based, Need-based, Government, Private, Women-focused, Research), Review. Top: progress bar "Step 2 of 4: Education". Helper line: "Answer what you can. Anything you skip is marked 'needs information', never 'not eligible'." Review shows each answer, with skipped ones highlighted as "Not provided". Final button "Show my matches". Show error and filled states.

### 3. Dashboard
Greeting "Welcome, Priya". Four metric tiles: Eligible scholarships 9, Need more information 0, Active applications 4, Deadlines in 30 days 2. "Your next steps" list: Get your Domicile certificate (needed for 1 application), Get your Statement of purpose, Income certificate expires in 20 days, Demo Madhya Pradesh Student Support closes in 18 days. "Recent activity" feed with timestamps. "Best matches for you" three scholarship cards with "See all". Add the improvements from Part 3, item 4.

### 4. Discover
Title, search box ("Search by name, provider or course…"), left filter panel on desktop (Eligibility, Education level, Provider, Closing within, Sort by), "Filters" button opening a bottom sheet on mobile. Removable chips for active filters. Live count "15 scholarships found". Two-column card grid. Empty state: "No scholarships match" with "Clear search and filters".

### 5. Scholarship detail
Back link. Verdict badge and "Demo data" tag, serif title, provider, description. Buttons: Save, Start tracking (or Open tracker), "View official application". Note: "Vidyaan never submits applications for you." Left column: "Why this result" breakdown and "How to apply" numbered steps. Right column: "At a glance" (amount, deadline, benefits), "Documents you will need", and a source line ("Demo data: details are illustrative. Confirm on the official site.").

### 6. Compare
Table with up to three scholarships as columns. Rows: Your result, Provider, Amount, Deadline, Levels, Income limit, Minimum marks, Documents, Not met. Remove link under each title and "Clear all". Horizontal scroll on mobile with a sticky first column. Empty state: "Nothing to compare yet" with "Choose scholarships".

### 7. Saved
Grid of scholarship cards sorted by soonest deadline. Empty state with "Browse scholarships".

### 8. Applications
List view: status filter chips with counts (All, Saved, Preparing, Submitted, Under review, Approved, Disbursed, Not selected), each application a card with status pill, title, provider, deadline, and a "Move to" menu. Board view (desktop only): seven columns, draggable cards with a grip handle. Show a drag in progress.

### 9. Application detail
Status pill, title, provider and deadline, "Move to" menu, "View scholarship". Notes textarea with a 1000 character counter. Document checklist (Ready or Missing per item) with "Manage documents". History timeline. "Stop tracking" with a confirmation dialog ("Your notes for it will be deleted.").

### 10. Documents
Left: add-a-document input, list with Available or Missing badge, expiry date picker, "Mark missing or available", remove (with confirmation). Right: "Application readiness", one card per application with a progress bar "2 of 3 documents ready" and "Missing: Domicile certificate".

### 11. Deadlines
Month calendar with event markers, month navigation, today highlighted. "Upcoming" list with relative labels (In 18 days). Scholarships with no known date show "Check official site". Button "Add to calendar (.ics)".

### 12. Profile
Editable form for every profile field. "Preferences" card (Dark mode, Deadline reminders). "Your data" card: Export everything (JSON), Export applications (CSV), Load demo data, Clear all my data (danger, with confirmation: "This deletes your profile, saved scholarships, applications, notes and documents from this browser. It cannot be undone.").

### 13. States to design once
Loading skeletons, empty states for every list, error page ("Something went wrong. Your saved data is safe. Reload the page to continue."), 404 ("Page not found"), toasts, confirmation dialogs.

---

## Part 5. Sample data to use

**Student (demo):** Priya, undergraduate, B.Tech year 2, Madhya Pradesh, government college, female, OBC, family income ₹2,40,000, last exam 78 percent.

**Scholarships (all labelled "Demo data"):**
- Demo Madhya Pradesh Student Support, Demo State Education Dept, ₹35,000 per year, 25 Nov 2026, Eligible
- Demo Need-based Grant for Undergraduates, Demo Community Fund, ₹25,000 one-time, 28 Nov 2026, Eligible
- Demo Merit Award for Engineering Students, Demo Education Trust, ₹40,000 per year, 15 Dec 2026, Eligible
- Demo Category Scholarship (OBC, SC, ST), Demo State Welfare Board, ₹18,000 per year, 10 Jan 2027, Eligible
- AICTE Pragati, AICTE, deadline "Check official site", official portal link
- Central Sector Scholarship for College Students, deadline "Check official site"
- MP Medhavi Vidyarthi Yojana, Reliance Foundation UG (real schemes, shown as Demo data)

**Application stages:** Need-based Grant (Preparing), MP Student Support (Preparing), Central Sector (Submitted), Open Merit (Under review), Women in STEM Fellowship (Saved).

**Documents:** Marksheet (available), Income certificate (available, expires in 20 days), Bank passbook (available), Domicile certificate (missing), College ID (available), Statement of purpose (missing).
