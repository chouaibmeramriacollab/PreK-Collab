import { expect } from '@playwright/test';

import { openHomePage } from '../libs/load-page';
import { test } from '../libs/playwright';

test.describe('subpage', () => {
  test('Create subpage', async ({ page }) => {
    await openHomePage(page);
    await page.getByTestId('sliderBar-arrowButton-collapse').click();
    const sliderBarArea = page.getByTestId('sliderBar');
    await expect(sliderBarArea).not.toBeVisible();
  });
});
