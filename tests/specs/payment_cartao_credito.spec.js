const { test, expect } = require('@playwright/test');
const PaymentPage = require('../pages/PaymentPage');

test.describe('Fluxo de Pagamento via Cartão de Crédito', () => {
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

  test('Pagamento com Cartão de Crédito deve confirmar matrícula', async () => {
    // Arrange
    const customerData = {
      name: 'Teste Automação 2',
      email: 'teste+qa@email.com',
      phone: '(61) 99111-4795'
    };

    const cardInfo = {
      number: '5162 9203 4814 8604',
      expiryMonth: '04',
      expiryYear: '33',
      cvv: '043',
      name: 'Edson santos'
    };

    // Act
    await paymentPage.fillCustomerInfo(
      customerData.name,
      customerData.email,
      customerData.phone
    );
    await paymentPage.selectCreditCardPayment(cardInfo, '213.891.100-44');

    // Assert
    const isSuccessful = await paymentPage.isPaymentSuccessful();
    await paymentPage._takeScreenshot('credit-card-payment');

    expect(isSuccessful).toBe(true);
  });
});