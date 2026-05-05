const { test, expect } = require('@playwright/test');
const LoginPage = require('../pages/LoginPage');

test.describe('Testes de Login Válido', () => {
  let page, loginPage;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
    loginPage = new LoginPage(page);
    await loginPage.navigate();
  });

  test.afterEach(async () => {
    await page.close();
  });

  test('Login com credenciais válidas deve redirecionar para dashboard', async () => {
    // Credenciais válidas (usar variáveis de ambiente para segurança)
    const validEmail = process.env.VALID_EMAIL || 'edson.santos@cursobeta.com.br';
    const validPassword = process.env.VALID_PASSWORD || '123456';

    // 1. Execute o login
    await loginPage.login(validEmail, validPassword, { expectSuccess: true });

    // 2. Verificações
    const currentUrl = await page.url();
    const isSuccessful = await loginPage.isLoginSuccessful();

    // 3. Screenshot para documentação com nome dinâmico
    const screenshotName = `screenshots/login_sucesso_${Date.now()}.png`;
    await page.screenshot({ path: screenshotName });

    // 4. Assertions
    expect(currentUrl).toMatch(/dashboard|painel|home/i);
    expect(isSuccessful, 'O login não foi bem-sucedido: elemento do dashboard não encontrado').toBe(true);

    // Verificação adicional do texto
    const dashboardText = await loginPage.dashboardElement.textContent();
    expect(dashboardText.trim()).toBe('Dashboard');
  });
});