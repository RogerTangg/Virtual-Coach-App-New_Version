import { test, expect } from '@playwright/test';

/**
 * Visual Regression Tests for WorkoutList Component
 * Tests responsive design and card expand states across viewports
 */

test.describe('WorkoutList Visual Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Generate a workout plan first
    await page.click('text=增肌');
    await page.click('text=胸部');
    await page.click('text=背部');
    await page.click('text=中階');
    await page.click('text=生成訓練計畫');
    
    // Wait for workout list to appear
    await page.waitForSelector('text=您的訓練計畫', { timeout: 10000 });
    await page.waitForTimeout(1000); // Extra wait for animations
  });

  test('Desktop - Workout List Default', async ({ page }) => {
    await expect(page).toHaveScreenshot('workout-list-desktop-default.png', {
      fullPage: true,
    });
  });

  test('Desktop - First Card Expanded', async ({ page }) => {
    // Click first workout card to expand
    const firstCard = page.locator('[data-testid="workout-card"]').first();
    await firstCard.click();
    await page.waitForTimeout(500); // Wait for expand animation
    
    await expect(page).toHaveScreenshot('workout-list-desktop-card-expanded.png', {
      fullPage: true,
    });
  });

  test('Desktop - Multiple Cards Expanded', async ({ page }) => {
    // Expand first 3 cards
    const cards = page.locator('[data-testid="workout-card"]');
    await cards.nth(0).click();
    await page.waitForTimeout(300);
    await cards.nth(1).click();
    await page.waitForTimeout(300);
    await cards.nth(2).click();
    await page.waitForTimeout(500);
    
    await expect(page).toHaveScreenshot('workout-list-desktop-multiple-expanded.png', {
      fullPage: true,
    });
  });

  test('Desktop - Card Hover State', async ({ page }) => {
    const firstCard = page.locator('[data-testid="workout-card"]').first();
    await firstCard.hover();
    await page.waitForTimeout(300);
    
    await expect(page).toHaveScreenshot('workout-list-desktop-card-hover.png', {
      fullPage: true,
    });
  });

  test('Desktop - Action Buttons Visible', async ({ page }) => {
    // Scroll to bottom to show action buttons
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(300);
    
    await expect(page).toHaveScreenshot('workout-list-desktop-action-buttons.png', {
      fullPage: true,
    });
  });

  test('Desktop - Scrollable Card List', async ({ page }) => {
    // Scroll through the card list
    await page.evaluate(() => window.scrollBy(0, 400));
    await page.waitForTimeout(300);
    
    await expect(page).toHaveScreenshot('workout-list-desktop-scrolled.png', {
      fullPage: true,
    });
  });

  test('Tablet - Workout List Default', async ({ page }) => {
    await expect(page).toHaveScreenshot('workout-list-tablet-default.png', {
      fullPage: true,
    });
  });

  test('Tablet - Card Expanded', async ({ page }) => {
    const firstCard = page.locator('[data-testid="workout-card"]').first();
    await firstCard.click();
    await page.waitForTimeout(500);
    
    await expect(page).toHaveScreenshot('workout-list-tablet-card-expanded.png', {
      fullPage: true,
    });
  });

  test('Mobile - Workout List Default', async ({ page }) => {
    await expect(page).toHaveScreenshot('workout-list-mobile-default.png', {
      fullPage: true,
    });
  });

  test('Mobile - Full Width Cards', async ({ page }) => {
    // Expand a card to check mobile layout
    const firstCard = page.locator('[data-testid="workout-card"]').first();
    await firstCard.click();
    await page.waitForTimeout(500);
    
    await expect(page).toHaveScreenshot('workout-list-mobile-card-expanded.png', {
      fullPage: true,
    });
  });

  test('Mobile - Bottom Fixed Action Buttons', async ({ page }) => {
    // Scroll to bottom
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(300);
    
    await expect(page).toHaveScreenshot('workout-list-mobile-action-buttons.png', {
      fullPage: true,
    });
  });
});
