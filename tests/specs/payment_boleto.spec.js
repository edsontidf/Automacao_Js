const { test, expect } = require('@playwright/test');
const PaymentPage = require('../pages/PaymentPage');

test.describe('Fluxo de Pagamento via Boleto', () => {
  let page, paymentPage;
  const productUrl = 'https://pay.cursobeta.com.br/cart/grafo-40-pos-graduacao-em-pericia-grafotecnica-279';

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
    paymentPage = new PaymentPage(page);
    await paymentPage.navigateToProduct(productUrl);
  });

  test.afterEach(async () => {
    if (!page.isClosed()) {
      await page.close();
    }
  });

  test('Pagamento com Boleto deve gerar documento válido', async () => {
    // Arrange
    const customerData = {
      name: 'Teste Automação',
      email: 'teste+qa@email.com',
      phone: '(61) 99111-4795'
    };

    // Act
    await paymentPage.fillCustomerInfo(
      customerData.name,
      customerData.email,
      customerData.phone
    );
    await paymentPage.selectBoletoPayment('213.891.100-44');

    // Assert - Parte 1: Confirmação na página principal
    const isBoletoGenerated = await paymentPage.isBoletoGenerated();
    await paymentPage._takeScreenshot('boleto-main-page');
    expect(isBoletoGenerated).toBe(true);

    // Assert - Parte 2: Validação da janela do boleto
    const [newPage] = await Promise.all([
      page.waitForEvent('popup', { timeout: 20000 }),
      paymentPage.openBoletoButton.click()
    ]);
    
    await expect(newPage).toHaveURL(/boleto|pagar\.me|banco/i);
    await expect(newPage.locator('body')).toContainText(/boleto|pagável|banco/i);
    
    await newPage.close();
  });
});