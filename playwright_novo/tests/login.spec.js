const { test, expect } = require('@playwright/test');
const LoginPage = require('../pages/LoginPage');

test.describe('Login Tests', () => {

  test('should login with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();

    await loginPage.login(
      'admin@test.com',
      'admin123'
    );

    await expect(page.getByTestId('toast-1')).toContainText('Login realizadoBem-vindo, Admin User!');

    await page.screenshot({ path: 'screenshots/login-valid.png' });
  });

  test('should show error with invalid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();

    await loginPage.login(
      'invalid@test.com',
      '123456'
    );

    await expect(page.getByTestId('toast-title-1')).toContainText('Credenciais inválidas');

    await page.screenshot({ path: 'screenshots/login-invalid.png' });
  });

});