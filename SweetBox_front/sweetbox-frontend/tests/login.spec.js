const { test, expect } = require('@playwright/test');

test('teste de login SweetBox', async ({ page }) => {

  await page.goto('http://localhost:5173');

  await page.fill('input[type="email"]', 'teste@email.com');

  await page.fill('input[type="password"]', '123456');

  await page.click('button[type="submit"]');

  await expect(page).toHaveURL(/home/);

});