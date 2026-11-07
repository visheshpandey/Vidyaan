import { defineConfig, devices } from '@playwright/test'

/**
 * End-to-end tests run against the production build served by `vite preview`.
 * They use the Chrome already installed on the machine (`channel: 'chrome'`); in CI, run
 * `npx playwright install --with-deps chromium` and set `E2E_CHANNEL=chromium`.
 */
export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list']],
  use: {
    baseURL: 'http://localhost:4173',
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'desktop',
      use: { ...devices['Desktop Chrome'], channel: process.env.E2E_CHANNEL ?? 'chrome' },
    },
    {
      name: 'mobile',
      use: { ...devices['Pixel 7'], channel: process.env.E2E_CHANNEL ?? 'chrome' },
    },
  ],
  webServer: {
    command: 'npm run build && npm run preview -- --port 4173 --strictPort',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
