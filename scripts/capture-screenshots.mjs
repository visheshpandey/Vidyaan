// Captures README screenshots from the production build.
// Usage: npm run build, then `npx vite preview --port 4177` in another terminal, then npm run screenshots
import { mkdir, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from '@playwright/test'
import sharp from 'sharp'

const BASE = process.env.SCREENSHOT_URL ?? 'http://localhost:4177'
const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'docs', 'screenshots')
const MAX_BYTES = 380 * 1024

const VIEWPORTS = [
  { width: 360, height: 800 },
  { width: 768, height: 1024 },
  { width: 1280, height: 800 },
]

const PAGES = [
  { name: 'discover', path: '/discover', widths: [360, 768, 1280] },
  { name: 'dashboard', path: '/dashboard', widths: [360, 768, 1280] },
  { name: 'applications', path: '/applications', widths: [360, 1280] },
  { name: 'scholarship', path: '/scholarship/demo-merit-engineering', widths: [360, 1280] },
  { name: 'help', path: '/help', widths: [360, 1280] },
]

async function save(page, name, width) {
  const file = path.join(OUT, `${name}-${width}.png`)
  let buffer = await page.screenshot({ type: 'png' })
  if (buffer.length > MAX_BYTES) {
    buffer = await sharp(buffer).png({ palette: true, quality: 80, effort: 8 }).toBuffer()
  }
  await writeFile(file, buffer)
  const size = (await stat(file)).size
  if (size > MAX_BYTES) throw new Error(`${file} is ${size} bytes`)
  console.log(`${name}-${width}.png ${(size / 1024).toFixed(0)} KB`)
}

await mkdir(OUT, { recursive: true })
const browser = await chromium.launch({ channel: 'chrome' })
let count = 0
try {
  for (const viewport of VIEWPORTS) {
    const context = await browser.newContext({ viewport, serviceWorkers: 'block' })
    const page = await context.newPage()
    await page.goto(`${BASE}/welcome`)
    await page.getByRole('heading', { level: 1 }).waitFor()
    await page.waitForLoadState('networkidle')
    await save(page, 'welcome', viewport.width)
    count++
    await page
      .getByRole('button', { name: /Try the demo/ })
      .first()
      .click()
    await page.waitForURL('**/dashboard')
    for (const p of PAGES) {
      if (!p.widths.includes(viewport.width)) continue
      await page.goto(`${BASE}${p.path}`)
      await page.getByRole('heading', { level: 1 }).first().waitFor()
      await page.waitForTimeout(600)
      await save(page, p.name, viewport.width)
      count++
    }
    await context.close()
  }
} finally {
  await browser.close()
}
console.log(`captured ${count} screenshots into ${path.relative(process.cwd(), OUT)}`)
