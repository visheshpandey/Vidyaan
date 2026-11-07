import { createHash } from 'node:crypto'
import { readdirSync } from 'node:fs'
import path from 'node:path'
import type { Plugin } from 'vite'

/**
 * Builds the service worker source. It is a plain string so it can be emitted as /sw.js at build time
 * with the exact list of hashed files to precache.
 *
 * Strategy:
 *  - install: precache the app shell (HTML, JS, CSS, fonts, icons, illustrations, manifest).
 *  - navigations: network first, fall back to the cached shell so every route opens offline.
 *  - /data/*.json and /fonts/*: stale-while-revalidate (instant from cache, refreshed in the background).
 *  - other same-origin GETs: cache first for precached files, otherwise network with cache fallback.
 */
export function buildServiceWorker(precacheUrls: string[], version: string): string {
  return `/* GRANTLY service worker. Generated at build time: do not edit. */
const VERSION = ${JSON.stringify(version)}
const SHELL_CACHE = 'grantly-shell-' + VERSION
const RUNTIME_CACHE = 'grantly-runtime-v1'
const PRECACHE = ${JSON.stringify(precacheUrls)}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then((cache) => cache.addAll(PRECACHE)).then(() => self.skipWaiting()),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith('grantly-shell-') && key !== SHELL_CACHE)
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  )
})

const isOk = (response) => response && response.status === 200

async function staleWhileRevalidate(request) {
  const cache = await caches.open(RUNTIME_CACHE)
  const cached = await cache.match(request)
  const refresh = fetch(request)
    .then((response) => {
      if (isOk(response)) void cache.put(request, response.clone())
      return response
    })
    .catch(() => cached)
  return cached || refresh
}

async function navigationHandler(request) {
  try {
    const response = await fetch(request)
    if (isOk(response)) {
      const cache = await caches.open(SHELL_CACHE)
      void cache.put('/index.html', response.clone())
    }
    return response
  } catch {
    const cached = await caches.match('/index.html')
    return cached || Response.error()
  }
}

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return
  const url = new URL(request.url)
  if (url.origin !== self.location.origin) return

  if (request.mode === 'navigate') {
    event.respondWith(navigationHandler(request))
    return
  }
  if (url.pathname.startsWith('/data/') || url.pathname.startsWith('/fonts/')) {
    event.respondWith(staleWhileRevalidate(request))
    return
  }
  event.respondWith(
    caches.match(request).then((cached) => cached || fetch(request)),
  )
})
`
}

/** Lists files in a public sub-folder as URLs (for example /fonts/inter-latin-400.woff2). */
function listPublic(root: string, folder: string, extensions: RegExp): string[] {
  try {
    return readdirSync(path.join(root, 'public', folder))
      .filter((file) => extensions.test(file))
      .map((file) => `/${folder}/${file}`)
  } catch {
    return []
  }
}

/**
 * Vite plugin that emits /sw.js during `vite build`, listing every built script and stylesheet plus the
 * static files the first screen needs. The cache name changes whenever the file list changes, so a new
 * deploy replaces the old cache. Hand-made on purpose: no extra runtime dependency to keep patched.
 */
export function serviceWorkerPlugin(): Plugin {
  let root = process.cwd()
  return {
    name: 'grantly-service-worker',
    apply: 'build',
    configResolved(config) {
      root = config.root
    },
    generateBundle(_options, bundle) {
      const built = Object.keys(bundle)
        .filter((file) => /\.(js|css)$/.test(file))
        .map((file) => `/${file}`)
      const staticFiles = [
        ...listPublic(root, 'fonts', /\.woff2$/),
        ...listPublic(root, 'icons', /\.png$/),
        ...listPublic(root, 'illustrations', /\.svg$/),
        '/manifest.webmanifest',
        '/favicon.svg',
      ]
      const urls = ['/', '/index.html', ...built, ...staticFiles].sort()
      const version = createHash('sha1').update(urls.join('|')).digest('hex').slice(0, 10)
      this.emitFile({ type: 'asset', fileName: 'sw.js', source: buildServiceWorker(urls, version) })
    },
  }
}
