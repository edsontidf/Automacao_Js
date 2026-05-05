const { test, expect } = require('@playwright/test');
const LoginPage = require('../pages/LoginPage');

test.describe('Testes de Login Inválido', () => {
    let page, loginPage;

    test.beforeEach(async ({ browser }) => {
        page = await browser.newPage();
        loginPage = new LoginPage(page);
        await loginPage.navigate();
    });

    test.afterEach(async () => {
        await page.close();
    });

    test('Login com e-mail inválido deve mostrar mensagem de erro', async () => {
        // Executa o login esperando falha
        await loginPage.login('invalido@teste.com', '123456', { expectSuccess: false });
        
        // Verifica se a mensagem de erro está visível
        const isErrorDisplayed = await loginPage.isLoginErrorDisplayed();
        await page.screenshot({ path: 'screenshots/login_email_invalido.png' });
        
        expect(isErrorDisplayed).toBe(true);
    });
});











