# Accessibility

Target: WCAG 2.1 AA.

## Built in

- Skip link to the main content; one `h1` per page with ordered headings.
- Every form field has a visible label; hints and errors are linked with `aria-describedby`, errors use `role="alert"`.
- Status is always icon plus text. Colour is never the only signal.
- Dialogs and menus use Radix primitives: focus trap, Escape to close, focus return, arrow-key navigation.
- Live regions announce search result counts and toasts.
- The deadlines calendar exposes each day's events to screen readers.
- Visible focus ring on every interactive element; touch targets are at least 40 to 44px.
- `prefers-reduced-motion` disables animation.
- The gold accent is used only as a fill, never as text on white (it fails contrast).
- Layouts reflow with no horizontal scrolling at 360px.

## Testing

`tests/pages.a11y.test.tsx` renders every page with demo data and runs axe. It already caught a heading-order issue that was fixed. Automated checks do not replace a manual pass: before release, walk each page by keyboard and test with a screen reader.
