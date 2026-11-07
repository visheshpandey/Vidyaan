interface ResponsiveImageProps {
  /** Base name in /illustrations, for example "discover" (files discover.svg and discover-480.webp). */
  name: string
  alt: string
  width: number
  height: number
  className?: string
  /** Sizes attribute for the WebP sources. */
  sizes?: string
  /** Widths of the generated WebP files. Pass an empty array for SVG-only mode. */
  widths?: readonly number[]
  priority?: boolean
}

const DEFAULT_WIDTHS = [480, 960, 1440] as const

/**
 * A responsive picture: WebP sources at several widths with an SVG fallback. Width and height are
 * always set so the browser reserves space and the page does not shift while images load.
 */
export function ResponsiveImage({
  name,
  alt,
  width,
  height,
  className,
  sizes = '(min-width: 1024px) 480px, (min-width: 640px) 50vw, 100vw',
  widths = DEFAULT_WIDTHS,
  priority = false,
}: ResponsiveImageProps) {
  const fallback = `/illustrations/${name}.svg`
  const img = (
    <img
      src={fallback}
      width={width}
      height={height}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      className={className}
    />
  )
  if (widths.length === 0) return img
  const srcSet = widths.map((w) => `/illustrations/${name}-${w}.webp ${w}w`).join(', ')
  return (
    <picture>
      <source type="image/webp" srcSet={srcSet} sizes={sizes} />
      {img}
    </picture>
  )
}
