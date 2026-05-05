const { test, expect } = require('@playwright/test');
const PaymentPage = require('../pages/PaymentPage');

test.describe('Fluxo de Pagamento via PIX', () => {
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

  test('Pagamento com PIX deve gerar código válido', async () => {
    const testData = {
      name: 'Teste Automação',
      email: 'edsontidf+99@gmail.com',
      phone: '(61) 99111-4795',
      document: '213.891.100-44'
    };

    await paymentPage.fillCustomerInfo(testData.name, testData.email, testData.phone);
    await paymentPage.selectPixPayment(testData.document);

    const isSuccessful = await paymentPage.isPixPaymentSuccessful();
    expect(isSuccessful).toBe(true);
  });
});
