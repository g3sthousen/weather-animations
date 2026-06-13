import { test, expect } from '@playwright/test';

const CONDITIONS = ['clear', 'cloudy', 'rain', 'snow', 'storm', 'fog', 'wind', 'hail'] as const;
const TIMES = ['day', 'night'] as const;

const SEED = 12345;
const FRAMES = 150;

for (const condition of CONDITIONS) {
  for (const time of TIMES) {
    test(`${condition} ${time}`, async ({ page }) => {
      await page.goto(
        `/?seed=${SEED}&frames=${FRAMES}&condition=${condition}&time=${time}&intensity=medium`,
      );
      await page.waitForTimeout(100);
      await expect(page).toHaveScreenshot(`${condition}-${time}.png`, {
        maxDiffPixelRatio: 0.02,
      });
    });
  }
}

// Rich variants of the most distinctive states.
const RICH = ['rain', 'storm', 'fog', 'hail'] as const;
for (const condition of RICH) {
  test(`${condition} day rich`, async ({ page }) => {
    await page.goto(
      `/?seed=${SEED}&frames=${FRAMES}&condition=${condition}&time=day&intensity=heavy&fidelity=rich`,
    );
    await page.waitForTimeout(100);
    await expect(page).toHaveScreenshot(`${condition}-day-rich.png`, {
      maxDiffPixelRatio: 0.02,
    });
  });
}
