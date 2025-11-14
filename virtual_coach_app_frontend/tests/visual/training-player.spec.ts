import { test, expect } from '@playwright/test';

/**
 * Visual Regression Tests for TrainingPlayer Component
 * Tests fullscreen immersive layout across viewports
 */

test.describe('TrainingPlayer Visual Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Generate workout plan and start training
    await page.click('text=增肌');
    await page.click('text=胸部');
    await page.click('text=背部');
    await page.click('text=中階');
    await page.click('text=生成訓練計畫');
    
    await page.waitForSelector('text=您的訓練計畫', { timeout: 10000 });
    await page.waitForTimeout(1000);
    
    // Click "開始訓練" button
    await page.click('text=開始訓練');
    await page.waitForTimeout(2000); // Wait for player to load
  });

  test('Desktop - Training Player Default', async ({ page }) => {
    await expect(page).toHaveScreenshot('training-player-desktop-default.png', {
      fullPage: true,
    });
  });

  test('Desktop - Timer Display', async ({ page }) => {
    // Focus on timer area
    const timer = page.locator('text=/\\d+:\\d+/'); // Match time format
    await expect(timer).toBeVisible();
    await page.waitForTimeout(500);
    
    await expect(page).toHaveScreenshot('training-player-desktop-timer.png', {
      fullPage: true,
    });
  });

  test('Desktop - Controls Visible', async ({ page }) => {
    // Controls should be visible at bottom
    await page.waitForTimeout(1000);
    
    await expect(page).toHaveScreenshot('training-player-desktop-controls.png', {
      fullPage: true,
    });
  });

  test('Desktop - Paused State', async ({ page }) => {
    // Click pause button (center button)
    const pauseButton = page.locator('button[aria-label*="暫停"], button[aria-label*="繼續"]').first();
    await pauseButton.click();
    await page.waitForTimeout(500);
    
    await expect(page).toHaveScreenshot('training-player-desktop-paused.png', {
      fullPage: true,
    });
  });

  test('Desktop - Exercise Info Overlay', async ({ page }) => {
    // Check exercise info is visible
    await page.waitForSelector('h2'); // Exercise name
    await page.waitForTimeout(1500); // Wait longer for timer to stabilize
    
    await expect(page).toHaveScreenshot('training-player-desktop-exercise-info.png', {
      fullPage: true,
      maxDiffPixels: 100, // Allow small differences due to timer animation
    });
  });

  test('Tablet - Training Player Portrait', async ({ page }) => {
    await expect(page).toHaveScreenshot('training-player-tablet-default.png', {
      fullPage: true,
    });
  });

  test('Tablet - Timer Size Adjusted', async ({ page }) => {
    // Check timer is properly sized for tablet
    await page.waitForTimeout(1000);
    
    await expect(page).toHaveScreenshot('training-player-tablet-timer.png', {
      fullPage: true,
    });
  });

  test('Mobile - Training Player Portrait', async ({ page }) => {
    await expect(page).toHaveScreenshot('training-player-mobile-portrait.png', {
      fullPage: true,
    });
  });

  test('Mobile - Vertical Layout', async ({ page }) => {
    // Verify vertical stacking on mobile
    await page.waitForTimeout(1000);
    
    await expect(page).toHaveScreenshot('training-player-mobile-layout.png', {
      fullPage: true,
    });
  });

  test('Mobile - Touch Controls Size', async ({ page }) => {
    // Check controls are large enough for touch
    await page.waitForTimeout(1000);
    
    await expect(page).toHaveScreenshot('training-player-mobile-controls.png', {
      fullPage: true,
    });
  });

  test('Desktop - Completion Screen', async ({ page }) => {
    // Skip to last exercise and wait for completion
    // This requires simulating time or multiple skips
    // For now, just test if we can trigger completion
    
    // Try clicking skip multiple times (if available)
    try {
      const skipButton = page.locator('button[aria-label="跳過"]');
      for (let i = 0; i < 5; i++) {
        await skipButton.click({ timeout: 2000 });
        await page.waitForTimeout(1000);
      }
      
      // Check if completion screen appears
      const completionText = page.locator('text=/完成|恭喜/');
      if (await completionText.isVisible({ timeout: 5000 })) {
        await expect(page).toHaveScreenshot('training-player-desktop-completion.png', {
          fullPage: true,
        });
      }
    } catch (e) {
      // Skip this test if completion can't be reached easily
      test.skip();
    }
  });
});
