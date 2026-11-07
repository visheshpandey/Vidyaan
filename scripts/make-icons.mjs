// Generates the PWA icons as PNG files using only Node built-ins (no image library needed).
// Run once with `node scripts/make-icons.mjs`; the output in public/icons is committed.
// The mark matches public/favicon.svg: a gold "G" ring on a forest-green square.
import { mkdirSync, writeFileSync } from 'node:fs'
import { deflateSync } from 'node:zlib'

const GREEN = [24, 59, 50]
const GOLD = [228, 183, 123]
const SAMPLES = 3 // supersampling per axis for smooth edges

/** CRC32 table for PNG chunks. */
const CRC_TABLE = Array.from({ length: 256 }, (_, n) => {
  let c = n
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
  return c >>> 0
})
const crc32 = (buf) => {
  let c = 0xffffffff
  for (const b of buf) c = CRC_TABLE[(c ^ b) & 0xff] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}
const chunk = (type, data) => {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length)
  const body = Buffer.concat([Buffer.from(type), data])
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(body))
  return Buffer.concat([len, body, crc])
}
const encodePng = (size, rgba) => {
  const header = Buffer.alloc(13)
  header.writeUInt32BE(size, 0)
  header.writeUInt32BE(size, 4)
  header.set([8, 6, 0, 0, 0], 8) // 8-bit RGBA
  const rows = Buffer.alloc((size * 4 + 1) * size)
  for (let y = 0; y < size; y++) {
    rows[y * (size * 4 + 1)] = 0
    rgba.copy(rows, y * (size * 4 + 1) + 1, y * size * 4, (y + 1) * size * 4)
  }
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', header),
    chunk('IDAT', deflateSync(rows, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

/**
 * Is the point (x, y), in 0..1 units, inside the gold "G" mark?
 * `scale` shrinks the mark toward the centre (used for the maskable icon's safe zone).
 */
function inMark(x, y, scale) {
  const cx = 0.5
  const cy = 0.5
  const dx = (x - cx) / scale
  const dy = (y - cy) / scale
  const r = Math.hypot(dx, dy)
  const outer = 0.34
  const inner = 0.34 - 0.095
  const angle = (Math.atan2(dy, dx) * 180) / Math.PI // 0 = right, 90 = down
  const inRing = r <= outer && r >= inner && !(angle > -52 && angle < 8)
  const inBar = dx >= 0.0 && dx <= outer && Math.abs(dy) <= 0.0475 && r <= outer
  return inRing || inBar
}

/** Is the point inside the (optionally rounded) icon square? */
function inSquare(x, y, radius) {
  if (radius === 0) return true
  const px = Math.min(x, 1 - x)
  const py = Math.min(y, 1 - y)
  if (px >= radius || py >= radius) return true
  return Math.hypot(radius - px, radius - py) <= radius
}

function render(size, { radius, markScale }) {
  const out = Buffer.alloc(size * size * 4)
  for (let py = 0; py < size; py++) {
    for (let px = 0; px < size; px++) {
      let cover = 0
      let gold = 0
      for (let sy = 0; sy < SAMPLES; sy++) {
        for (let sx = 0; sx < SAMPLES; sx++) {
          const x = (px + (sx + 0.5) / SAMPLES) / size
          const y = (py + (sy + 0.5) / SAMPLES) / size
          if (!inSquare(x, y, radius)) continue
          cover++
          if (inMark(x, y, markScale)) gold++
        }
      }
      const total = SAMPLES * SAMPLES
      const i = (py * size + px) * 4
      const g = cover === 0 ? 0 : gold / cover
      for (let c = 0; c < 3; c++) out[i + c] = Math.round(GREEN[c] * (1 - g) + GOLD[c] * g)
      out[i + 3] = Math.round((cover / total) * 255)
    }
  }
  return encodePng(size, out)
}

mkdirSync('public/icons', { recursive: true })
const icons = [
  ['icon-192.png', 192, { radius: 0.22, markScale: 1 }],
  ['icon-512.png', 512, { radius: 0.22, markScale: 1 }],
  // Maskable icons are cropped by the OS into any shape, so keep the mark inside the central 60 percent.
  ['maskable-512.png', 512, { radius: 0, markScale: 0.72 }],
  ['apple-touch-icon.png', 180, { radius: 0, markScale: 0.9 }],
]
for (const [name, size, options] of icons) {
  writeFileSync(`public/icons/${name}`, render(size, options))
  console.log('wrote public/icons/' + name)
}
