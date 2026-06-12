import { test, expect } from '@playwright/test';

const CONDITIONS = ['Clear', 'Cloudy', 'Rain', 'Snow', 'Storm', 'Fog', 'Wind'] as const;
const TIMES = ['Day', 'Night'] as const;

for (const condition of CONDITIONS) {
  for (const time of TIMES) {
    test(`${condition} ${time}`, async ({ page }) => {
      await page.goto('/');
      await page.getByRole('button', { name: condition, exact: true }).click();
      await page.getByRole('button', { name: time, exact: true }).click();
      await page.waitForTimeout(1800);
      await expect(page).toHaveScreenshot(`${condition.toLowerCase()}-${time.toLowerCase()}.png`, {
        maxDiffPixelRatio: 0.05,
      });
    });
  }
}
