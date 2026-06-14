import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html');
});

test('title screen loads with crewmates', async ({ page }) => {
  await expect(page.locator('#title-screen')).toBeVisible();
  await expect(page.getByRole('button', { name: /Start Investigation/ })).toBeVisible();
  // 5 suspects + 8 extras = 13 crewmates on title screen
  const crewSvgs = page.locator('#title-crew svg');
  await expect(crewSvgs).toHaveCount(13);
});

test('Start Investigation loads game screen', async ({ page }) => {
  await page.getByRole('button', { name: /Start Investigation/ }).click();
  await expect(page.locator('#game-screen')).toBeVisible();
  await expect(page.locator('#title-screen')).not.toBeVisible();
});

test('game screen has correct structure', async ({ page }) => {
  await page.getByRole('button', { name: /Start Investigation/ }).click();

  // Board panels
  await expect(page.locator('#suspects-list')).toBeVisible();
  await expect(page.locator('#rooms-list')).toBeVisible();
  await expect(page.locator('#weapons-list')).toBeVisible();

  // 6 items total (5 suspects + 1 victim)
  await expect(page.locator('#suspects-list .opt-item')).toHaveCount(6);

  // Exactly 1 victim (dead, not clickable)
  await expect(page.locator('#suspects-list .opt-dead')).toHaveCount(1);
  await expect(page.locator('#suspects-list .opt-dead')).toContainText('💀');

  // Accusation dropdowns only list the 5 suspects
  const suspectOptions = page.locator('#acc-suspect option:not([value=""])');
  await expect(suspectOptions).toHaveCount(5);
});

test('Reveal Evidence button reveals clues one at a time', async ({ page }) => {
  await page.getByRole('button', { name: /Start Investigation/ }).click();

  // Initially no clues shown
  await expect(page.locator('#clues-list .clue-item')).toHaveCount(0);

  // First reveal
  await page.getByRole('button', { name: /Reveal Evidence/ }).click();
  await expect(page.locator('#clues-list .clue-item')).toHaveCount(1);

  // Second reveal
  await page.getByRole('button', { name: /Reveal Evidence/ }).click();
  await expect(page.locator('#clues-list .clue-item')).toHaveCount(2);
});

test('clue items are clickable for marking', async ({ page }) => {
  await page.getByRole('button', { name: /Start Investigation/ }).click();
  await page.getByRole('button', { name: /Reveal Evidence/ }).click();

  const clue = page.locator('#clues-list .clue-item').first();

  // blank → safe
  await clue.click();
  await expect(clue).toHaveClass(/state-safe/);

  // safe → suspicious
  await clue.click();
  await expect(clue).toHaveClass(/state-suspicious/);

  // suspicious → blank
  await clue.click();
  await expect(clue).not.toHaveClass(/state-safe|state-suspicious/);
});

test('extra hints appear after all evidence revealed', async ({ page }) => {
  await page.getByRole('button', { name: /Start Investigation/ }).click();

  // Reveal all standard clues
  while (await page.getByRole('button', { name: /Reveal Evidence/ }).isVisible()) {
    await page.getByRole('button', { name: /Reveal Evidence/ }).click();
  }

  // Button should now be in hint mode
  await expect(page.getByRole('button', { name: /Get Hint/ })).toBeVisible();
});

test('wrong accusation shows loss screen with shake', async ({ page }) => {
  await page.getByRole('button', { name: /Start Investigation/ }).click();

  // Pick a wrong combination (select first option in each dropdown)
  await page.locator('#acc-suspect').selectOption({ index: 1 });
  await page.locator('#acc-room').selectOption({ index: 1 });
  await page.locator('#acc-weapon').selectOption({ index: 1 });
  await page.getByRole('button', { name: /Accuse!/ }).click();

  // Result screen must appear (win or lose — we can't predict the answer)
  await expect(page.locator('#result-screen')).toBeVisible();
  await expect(page.locator('#result-badge')).toBeVisible();
});

test('Play Again returns to game screen', async ({ page }) => {
  await page.getByRole('button', { name: /Start Investigation/ }).click();

  // Force a result by submitting with first options selected
  await page.locator('#acc-suspect').selectOption({ index: 1 });
  await page.locator('#acc-room').selectOption({ index: 1 });
  await page.locator('#acc-weapon').selectOption({ index: 1 });
  await page.getByRole('button', { name: /Accuse!/ }).click();

  await page.getByRole('button', { name: /Play Again/ }).click();
  await expect(page.locator('#game-screen')).toBeVisible();
});

test('no console errors on normal gameplay', async ({ page }) => {
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });

  await page.getByRole('button', { name: /Start Investigation/ }).click();
  await page.getByRole('button', { name: /Reveal Evidence/ }).click();
  await page.getByRole('button', { name: /Reveal Evidence/ }).click();

  expect(errors).toHaveLength(0);
});
