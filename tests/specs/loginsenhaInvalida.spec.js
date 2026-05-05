const { test, expect } = require('@playwright/test');
const LoginPage = require('../pages/LoginPage');

test.describe('Testes de Login Inválido', () => {
    let page, loginPage;

    test.beforeEach(async ({ browser }) => {
        page = await browser.newPage();
        loginPage = new LoginPage(page);
        await loginPage.navigate();
    });

    test('Login com senha inválida deve mostrar mensagem de erro', async () => {
        await loginPage.login('valido@teste.com', 'senha_errada', { expectSuccess: false });
        
        const isErrorDisplayed = await loginPage.isLoginErrorDisplayed();
        await page.screenshot({ path: 'screenshots/login_senha_invalida.png' });
        
        expect(isErrorDisplayed).toBe(true);
    });
});