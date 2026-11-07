import path from 'node:path'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { alias: { '@': path.resolve(import.meta.dirname, 'src') } },
  build: {
    target: 'es2022',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        /**
         * Only React and the router get a fixed chunk (they rarely change, so repeat visits reuse the
         * cached file). Everything else splits by route: Radix, dnd-kit and other feature-only code is
         * downloaded only by pages that use it. Forcing "ui"/"data" chunks made the landing page fetch
         * all of it.
         */
        manualChunks(id: string) {
          if (
            /node_modules[\\/](react|react-dom|react-router|react-router-dom|scheduler)[\\/]/.test(
              id,
            )
          ) {
            return 'react'
          }
          return undefined
        },
      },
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    // Playwright end-to-end specs live in e2e/ and run with `npm run e2e`.
    exclude: ['node_modules', 'dist', 'e2e'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/main.tsx', 'src/**/*.test.*'],
      // Fails `npm run test:coverage` (and CI) if coverage drops below these floors.
      thresholds: { statements: 80, branches: 75, functions: 80, lines: 80 },
    },
  },
})
