import { expect, test, type Page } from '@playwright/test'

/** Loads the demo student from the landing page and lands on the dashboard. */
async function startDemo(page: Page) {
  await page.goto('/')
  await page.getByRole('button', { name: /try the demo/i }).click()
  await expect(page).toHaveURL(/\/dashboard$/)
}

test.describe('student journey', () => {
  test('landing page explains the product and has no horizontal scroll', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await expect(page).toHaveTitle(/GRANTLY/)
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    )
    expect(overflow).toBe(false)
  })

  test('demo student sees matches and next steps on the dashboard', async ({ page }) => {
    await startDemo(page)
    await expect(
      page.getByRole('heading', { name: /good (morning|afternoon|evening), priya/i }),
    ).toBeVisible()
    await expect(page.getByRole('heading', { name: /your next steps/i })).toBeVisible()
  })

  test('search narrows scholarships and the filter lives in the URL', async ({ page }) => {
    await startDemo(page)
    await page.goto('/discover')
    await page
      .getByRole('searchbox', { name: /search scholarships/i })
      .last()
      .fill('aicte')
    await expect(page).toHaveURL(/q=aicte/)
    await expect(page.getByText(/showing \d+ of \d+ scholarships/i)).toBeVisible()
  })

  test('a scholarship can be opened, saved and tracked', async ({ page }) => {
    await startDemo(page)
    await page.goto('/scholarship/demo-merit-engineering')
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/merit award/i)
    await page.getByRole('button', { name: /start tracking/i }).click()
    await expect(page).toHaveURL(/\/applications\/app-demo-merit-engineering$/)
  })

  test('unknown pages show a helpful 404', async ({ page }) => {
    await page.goto('/this-page-does-not-exist')
    await expect(page.getByRole('heading', { name: /page not found/i })).toBeVisible()
  })

  test('the app never logs errors to the console', async ({ page }) => {
    const errors: string[] = []
    page.on('console', (m) => {
      if (m.type() === 'error') errors.push(m.text())
    })
    await startDemo(page)
    for (const path of ['/discover', '/applications', '/documents', '/deadlines', '/profile']) {
      await page.goto(path)
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    }
    expect(errors).toEqual([])
  })
})
