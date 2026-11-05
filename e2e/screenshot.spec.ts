import { test } from '@playwright/test';

test('capture light mode screenshots', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://localhost:5173');
  await page.waitForSelector('.react-flow__node', { timeout: 10000 });
  await page.waitForTimeout(1000);

  // 1. Full canvas in light mode
  await page.screenshot({ path: 'scratch-light-canvas.png' });

  // 2. Click node to show lineage focus
  const firstNode = page.locator('.react-flow__node').first();
  await firstNode.click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'scratch-light-focus.png' });

  // 3. Click edge to show Putuskan button
  const edge = page.locator('.react-flow__edge path').first();
  await edge.click({ force: true });
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'scratch-light-edge-selected.png' });
});
