/** First focusable element on every page; jumps keyboard users to the main content. */
export function SkipLink() {
  return (
    <a
      href="#main"
      className="fixed left-3 top-3 z-[70] -translate-y-20 rounded-control bg-primary px-4 py-2 text-sm text-white focus:translate-y-0"
    >
      Skip to main content
    </a>
  )
}
