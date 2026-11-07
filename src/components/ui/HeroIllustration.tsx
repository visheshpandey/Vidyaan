interface IllustrationProps {
  className?: string
}

/**
 * Landing page hero artwork (an optimised SVG served from /illustrations).
 * Width and height are set so the browser reserves the space (no layout shift); it loads with high
 * priority because it sits above the fold. The alt text describes the picture for screen readers.
 */
export function HeroIllustration({ className }: IllustrationProps) {
  return (
    <img
      src="/illustrations/hero.svg"
      width={640}
      height={400}
      alt="Two students walking a path from a stack of books to a completed scholarship checklist."
      decoding="async"
      fetchPriority="high"
      className={className}
    />
  )
}

/**
 * Small decorative picture for empty states. It repeats nothing the heading already says, so it is
 * hidden from assistive technology (empty alt). Loaded lazily because empty states are below the fold.
 */
export function EmptyIllustration({ className }: IllustrationProps) {
  return (
    <img
      src="/illustrations/empty.svg"
      width={200}
      height={140}
      alt=""
      loading="lazy"
      decoding="async"
      className={className}
    />
  )
}
