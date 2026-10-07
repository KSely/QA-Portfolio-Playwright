import { test, expect } from '@playwright/test';

// DEF-001: Register before navigation to capture shared-footer startup errors.
test('project page should load without JavaScript page errors', async ({ page }) => {
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(`${error.name}: ${error.message}`));

  await page.goto('/project', { waitUntil: 'load' });

  expect(pageErrors, 'Unexpected JavaScript page errors on /project').toEqual([]);
});

test('automation page should load without JavaScript page errors', async ({ page }) => {
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(`${error.name}: ${error.message}`));

  await page.goto('/project/automation', { waitUntil: 'load' });

  expect(pageErrors, 'Unexpected JavaScript page errors on /project/automation').toEqual([]);
});
