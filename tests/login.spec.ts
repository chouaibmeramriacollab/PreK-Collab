import { test, expect, type Page } from '@playwright/test';
import { loadPage } from './libs/load-page';

loadPage();

test.describe('Login Flow', () => {
  test('Open login modal by click current workspace', async ({ page }) => {
    await page.getByTestId('current-workspace').click();
    await page.waitForTimeout(800);
    // why don't we use waitForSelector, It seems that waitForSelector not stable?
    await page.getByTestId('open-login-modal').click();
    await page.waitForTimeout(800);
    await page
      .getByRole('heading', { name: 'Currently not logged in' })
      .click();
  });

  test('Open login modal by click cloud-unsync-icon', async ({ page }) => {
    await page.getByTestId('cloud-unsync-icon').click();

    await page.waitForTimeout(800);
    await page
      .getByRole('heading', { name: 'Currently not logged in' })
      .click();
  });

  test('Open google firebase page', async ({ page }) => {
    await page.getByTestId('current-workspace').click();
    await page.waitForTimeout(800);
    // why don't we use waitForSelector, It seems that waitForSelector not stable?
    await page.getByTestId('open-login-modal').click();
    await page.waitForTimeout(800);
    const [firebasePage] = await Promise.all([
      page.waitForEvent('popup'),
      page
        .getByRole('button', {
          name: 'Google Continue with Google Set up an AFFINE account to sync data',
        })
        .click(),
    ]);

    expect(await firebasePage.url()).toContain(
      '.firebaseapp.com/__/auth/handler'
    );
  });
});
