import { test, expect } from '@playwright/test';
import { loadPage } from './libs/load-page';

loadPage();

test.describe('Local first delete page', () => {
  test('New a page ,then open it and show delete modal', async ({ page }) => {
    await page.getByText('New Page').click();
    await page.getByPlaceholder('Title').click();
    await page.getByPlaceholder('Title').fill('this is a new page to delete');
    await page.getByRole('link', { name: 'All pages' }).click();
    const cell = page.getByRole('cell', {
      name: 'this is a new page to delete',
    });
    expect(cell).not.toBeUndefined();

    await cell.click();
    await page
      .getByTestId('editor-header-items')
      .getByRole('button')
      .nth(2)
      .click();
    const deleteBtn = page.getByTestId('editor-option-menu-delete');
    await deleteBtn.click();
    const confirmTip = page.getByText('Delete page?');
    expect(confirmTip).not.toBeUndefined();
  });

  test('New a page ,then go to all pages and show delete modal', async ({
    page,
  }) => {
    await page.getByText('New Page').click();
    await page.getByPlaceholder('Title').click();
    await page.getByPlaceholder('Title').fill('this is a new page to delete');
    const newPageId = page.url().split('/').reverse()[0];
    await page.getByRole('link', { name: 'All pages' }).click();
    const cell = page.getByRole('cell', {
      name: 'this is a new page to delete',
    });
    expect(cell).not.toBeUndefined();

    await page
      .getByTestId('more-actions-' + newPageId)
      .getByRole('button')
      .first()
      .click();
    const deleteBtn = page.getByRole('button', { name: 'Delete' });
    await deleteBtn.click();
    const confirmTip = page.getByText('Delete page?');
    expect(confirmTip).not.toBeUndefined();
  });

  test('New a page , then delete it in all pages, finally find it in trash', async ({
    page,
  }) => {
    await page.getByText('New Page').click();
    await page.getByPlaceholder('Title').click();
    await page.getByPlaceholder('Title').fill('this is a new page to delete');
    const newPageId = page.url().split('/').reverse()[0];
    await page.getByRole('link', { name: 'All pages' }).click();
    const cell = page.getByRole('cell', {
      name: 'this is a new page to delete',
    });
    expect(cell).not.toBeUndefined();

    await page
      .getByTestId('more-actions-' + newPageId)
      .getByRole('button')
      .first()
      .click();
    const deleteBtn = page.getByRole('button', { name: 'Delete' });
    await deleteBtn.click();
    const confirmTip = page.getByText('Delete page?');
    expect(confirmTip).not.toBeUndefined();

    await page.getByRole('button', { name: 'Delete' }).click();

    await page.getByRole('link', { name: 'Trash' }).click();
    expect(
      page.getByRole('cell', { name: 'this is a new page to delete' })
    ).not.toBeUndefined();
  });

  test('New a page , then delete it in all pages, restore it', async ({
    page,
  }) => {
    await page.getByText('New Page').click();
    await page.getByPlaceholder('Title').click();
    await page.getByPlaceholder('Title').fill('this is a new page to restore');
    const originPageUrl = page.url();
    const newPageId = page.url().split('/').reverse()[0];
    await page.getByRole('link', { name: 'All pages' }).click();
    const cell = page.getByRole('cell', {
      name: 'this is a new page to restore',
    });
    expect(cell).not.toBeUndefined();

    await page
      .getByTestId('more-actions-' + newPageId)
      .getByRole('button')
      .first()
      .click();
    const deleteBtn = page.getByRole('button', { name: 'Delete' });
    await deleteBtn.click();
    const confirmTip = page.getByText('Delete page?');
    expect(confirmTip).not.toBeUndefined();

    await page.getByRole('button', { name: 'Delete' }).click();

    await page.getByRole('link', { name: 'Trash' }).click();
    // restore it
    await page
      .getByTestId('more-actions-' + newPageId)
      .getByRole('button')
      .first()
      .click();

    // go to page detail
    expect(page.url()).toBe(originPageUrl);

    await page.getByRole('link', { name: 'All pages' }).click();
    const restoreCell = page.getByRole('cell', {
      name: 'this is a new page to restore',
    });
    expect(restoreCell).not.toBeUndefined();
  });

  test('New a page , then delete it in all pages, permanently delete it', async ({
    page,
  }) => {
    await page.getByText('New Page').click();
    await page.getByPlaceholder('Title').click();
    await page.getByPlaceholder('Title').fill('this is a new page to restore');
    const originPageUrl = page.url();
    const newPageId = page.url().split('/').reverse()[0];
    await page.getByRole('link', { name: 'All pages' }).click();
    const cell = page.getByRole('cell', {
      name: 'this is a new page to restore',
    });
    expect(cell).not.toBeUndefined();

    await page
      .getByTestId('more-actions-' + newPageId)
      .getByRole('button')
      .first()
      .click();
    const deleteBtn = page.getByRole('button', { name: 'Delete' });
    await deleteBtn.click();
    const confirmTip = page.getByText('Delete page?');
    expect(confirmTip).not.toBeUndefined();

    await page.getByRole('button', { name: 'Delete' }).click();

    await page.getByRole('link', { name: 'Trash' }).click();
    // permanently delete it
    await page
      .getByTestId('more-actions-' + newPageId)
      .getByRole('button')
      .nth(1)
      .click();
    await page.getByText('Delete permanently?').dblclick();

    // show empty tip
    expect(
      page.getByText(
        'Tips: Click Add to Favourites/Trash and the page will appear here.'
      )
    ).not.toBeUndefined();
  });
});
