import { test, expect } from '@playwright/test';

const CONDITIONS = ['clear', 'cloudy', 'rain', 'snow', 'storm', 'fog', 'wind'] as const;
const TIMES = ['day', 'night'] as const;

const SEED = 12345;
const FRAMES = 150;

for (const condition of CONDITIONS) {
  for (const time of TIMES) {
    test(`${condition} ${time}`, async ({ page }) => {
      await page.goto(
        `/?seed=${SEED}&frames=${FRAMES}&condition=${condition}&time=${time}&intensity=medium`,
      );
      // Manual mode renders synchronously on load; give the canvas one paint tick.
      await page.waitForTimeout(100);
      await expect(page).toHaveScreenshot(`${condition}-${time}.png`, {
        maxDiffPixelRatio: 0.02,
      });
    });
  }
}
