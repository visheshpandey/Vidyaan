import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ResponsiveImage } from '@/components/ui/ResponsiveImage'

describe('ResponsiveImage', () => {
  it('renders a picture with a webp srcset and a sized, lazy fallback image', () => {
    const { container } = render(
      <ResponsiveImage name="discover" alt="Discover picture" width={640} height={400} />,
    )
    const source = container.querySelector('source')
    expect(source?.getAttribute('type')).toBe('image/webp')
    expect(source?.getAttribute('srcset')).toContain('/illustrations/discover-480.webp 480w')
    expect(source?.getAttribute('srcset')).toContain('/illustrations/discover-1440.webp 1440w')
    expect(source?.getAttribute('sizes')).toBeTruthy()
    const img = screen.getByRole('img', { name: 'Discover picture' })
    expect(img).toHaveAttribute('src', '/illustrations/discover.svg')
    expect(img).toHaveAttribute('width', '640')
    expect(img).toHaveAttribute('height', '400')
    expect(img).toHaveAttribute('loading', 'lazy')
    expect(img).toHaveAttribute('decoding', 'async')
  })

  it('renders a plain image in SVG-only mode', () => {
    const { container } = render(
      <ResponsiveImage name="track" alt="Track" width={640} height={400} widths={[]} />,
    )
    expect(container.querySelector('picture')).toBeNull()
    expect(screen.getByRole('img', { name: 'Track' })).toHaveAttribute('loading', 'lazy')
  })
})
