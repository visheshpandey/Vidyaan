// Renders the SVG illustrations in public/illustrations to WebP at three widths.
// Run with: npm run images
import { readdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'public', 'illustrations')
const WIDTHS = [480, 960, 1440]

const files = (await readdir(dir)).filter((f) => f.endsWith('.svg') && f !== 'empty.svg')
for (const file of files) {
  const name = file.replace(/\.svg$/, '')
  for (const width of WIDTHS) {
    const out = path.join(dir, `${name}-${width}.webp`)
    await sharp(path.join(dir, file), { density: 300 })
      .resize({ width })
      .webp({ quality: 82 })
      .toFile(out)
    console.log('wrote', path.relative(process.cwd(), out))
  }
}
