import { test, expect } from '@playwright/test';

/**
 * Visual Regression Tests for PreferenceForm Component
 * Tests responsive design across desktop, tablet, and mobile viewports
 */

test.describe('PreferenceForm Visual Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for page to fully load
    await page.waitForLoadState('networkidle');
  });

  test('Desktop - Default State', async ({ page }) => {
    await expect(page).toHaveScreenshot('preference-form-desktop-default.png', {
      fullPage: true,
    });
  });

  test('Desktop - Training Goal Selected', async ({ page }) => {
    // Select "增肌" goal
    await page.click('text=增肌');
    await page.waitForTimeout(500); // Wait for animation
    
    await expect(page).toHaveScreenshot('preference-form-desktop-goal-selected.png', {
      fullPage: true,
    });
  });

  test('Desktop - Multiple Muscles Selected', async ({ page }) => {
    // Select training goal
    await page.click('text=增肌');
    
    // Select multiple muscle groups
    await page.click('text=胸部');
    await page.click('text=背部');
    await page.click('text=手臂');
    await page.waitForTimeout(500);
    
    await expect(page).toHaveScreenshot('preference-form-desktop-muscles-selected.png', {
      fullPage: true,
    });
  });

  test('Desktop - Hover State on Option Button', async ({ page }) => {
    // Hover over muscle gain button
    const button = page.locator('text=增肌').first();
    await button.hover();
    await page.waitForTimeout(300); // Wait for hover animation
    
    await expect(page).toHaveScreenshot('preference-form-desktop-hover.png', {
      fullPage: true,
    });
  });

  test('Desktop - Duration Slider Interaction', async ({ page }) => {
    // Interact with Mantine Slider (use role="slider" instead of input[type="range"])
    const slider = page.locator('[role="slider"]').first();
    await slider.click(); // Focus the slider
    // Press ArrowRight 15 times to move from 30 to 45 (step=1)
    for (let i = 0; i < 15; i++) {
      await slider.press('ArrowRight');
    }
    await page.waitForTimeout(300);
    
    await expect(page).toHaveScreenshot('preference-form-desktop-slider.png', {
      fullPage: true,
    });
  });

  test('Desktop - Form Validation Error', async ({ page }) => {
    // Try to submit without selecting required fields
    await page.click('text=生成訓練計畫');
    await page.waitForTimeout(500);
    
    await expect(page).toHaveScreenshot('preference-form-desktop-validation-error.png', {
      fullPage: true,
    });
  });

  test('Tablet - Default State', async ({ page }) => {
    await expect(page).toHaveScreenshot('preference-form-tablet-default.png', {
      fullPage: true,
    });
  });

  test('Tablet - All Fields Selected', async ({ page }) => {
    await page.click('text=減脂');
    await page.click('text=核心');
    await page.click('text=腿部');
    await page.click('text=中階');
    // Mantine Slider is already at default value 30, no need to adjust
    await page.waitForTimeout(500);
    
    await expect(page).toHaveScreenshot('preference-form-tablet-complete.png', {
      fullPage: true,
    });
  });

  test('Mobile - Default State', async ({ page }) => {
    await expect(page).toHaveScreenshot('preference-form-mobile-default.png', {
      fullPage: true,
    });
  });

  test('Mobile - Single Column Layout', async ({ page }) => {
    await page.click('text=耐力');
    await page.click('text=肩膀');
    await page.waitForTimeout(500);
    
    await expect(page).toHaveScreenshot('preference-form-mobile-selected.png', {
      fullPage: true,
    });
  });
});
