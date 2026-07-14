import { test, expect } from '@playwright/test'

test('loads demo and shows React Things header', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByText('React Things')).toBeVisible()
  await expect(page.getByText('by Micky Balladelli')).toBeVisible()
})

test('can search for a component', async ({ page }) => {
  await page.goto('/')
  await page.getByPlaceholder(/search components/i).fill('GlassBox')
  await expect(page.getByText('GlassBox')).toBeVisible()
})
