const { expect } = require('@playwright/test');

class PaymentPage {
  constructor(page) {
    this.page = page;
    
    // Elementos do formulário (MANTIDO ORIGINAL)
    this.nameInput = page.getByRole('textbox', { name: /Seu nome/i });
    this.emailInput = page.getByRole('textbox', { name: /melhor e-mail/i });
    this.phoneInput = page.getByRole('textbox', { name: /\(XX\) XXXXX-XXXX/i });
    this.nextButton = page.getByRole('button', { name: /Próximo|Next/i });
    this.documentInput = page.locator('#document, [id*="cpf"], [id*="document"]');
    this.payButton = page.getByRole('button', { name: /Pagar e Receber Agora|Pay Now/i });
    
    // Métodos de pagamento (MANTIDO ORIGINAL)
    this.pixOption = page.locator('div,span').filter({ hasText: /^Pix$/i }).first();
    this.boletoOption = page.locator('div,span').filter({ hasText: /^Boleto$/i }).first();
    this.creditCardOption = page.locator('span').filter({ hasText: /^Cartão de Crédito$/i }).first();
    
    // Elementos do cartão de crédito (MANTIDO ORIGINAL)
    this.cardNumberInput = page.locator('#numero_cartao');
    this.cardExpiryInput = page.locator('#mes');
    this.cardCvvInput = page.locator('#cvv');
    this.cardNameInput = page.locator('#titular');
    this.cardInstallmentsSelect = page.getByRole('combobox');
    
    // Confirmações (MANTIDO ORIGINAL)
    this.copyCodeButton = page.getByRole('button', { name: /Copiar Código|Copy Code/i });
    this.successMessage = page.getByText(/Falta pouco|Pagamento aprovado|Success/i);
    this.openBoletoButton = page.getByRole('button', { name: /Abrir Boleto|View Boleto/i });
    this.boletoIframe = page.frameLocator('iframe[title*="boleto"]').first();
    this.successHeader = page.getByRole('heading', { name: '✅ Sua matrícula foi' });
    this.successConfirmationText = page.locator('body');
    
    // Upsell (MANTIDO ORIGINAL)
    this.upsellDeclineButtons = [
      page.getByRole('button', { name: 'NÃO QUERO ESSA OFERTA' }),
      page.getByRole('button', { name: 'Não quero esta oferta' })
    ];

    // ÚNICA ADIÇÃO: Elemento do dialog do PIX da versão que funciona
    this.pixDialog = page.getByRole('dialog');
  }

  // MÉTODOS ORIGINAIS (MANTIDOS INTACTOS)
  async navigateToProduct(productUrl) {
    await this.page.goto(productUrl, {
      waitUntil: 'domcontentloaded',
      timeout: 45000
    });
    await this.page.waitForLoadState('networkidle', { timeout: 10000 });
  }

  async fillCustomerInfo(name, email, phone) {
    await this.nameInput.fill(name);
    await this.emailInput.fill(email);
    await this.phoneInput.fill(phone.replace(/\D/g, '').slice(0, 11));
    await this.nextButton.click();
    await this.page.waitForTimeout(1000);
  }

  // MÉTODO PIX ATUALIZADO (ÚNICA MODIFICAÇÃO)
  async selectPixPayment(documentNumber) {
    await this.pixOption.click({ timeout: 15000 });
    await this.documentInput.fill(documentNumber.replace(/\D/g, ''));
    await this.payButton.click();
    
    // Espera específica para o dialog do PIX
    await this.pixDialog.waitFor({ state: 'visible', timeout: 20000 });
  }

  // Método de validação do PIX da versão que funciona
  async isPixPaymentSuccessful() {
    try {
      await expect(this.pixDialog).toBeVisible({ timeout: 15000 });
      await expect(this.pixDialog).toContainText('Copiar Código');
      return true;
    } catch (error) {
      await this._takeScreenshot('pix-validation-failed');
      console.error('Erro na validação do PIX:', error);
      return false;
    }
  }

  // MÉTODOS ORIGINAIS (MANTIDOS SEM ALTERAÇÃO)
  async selectBoletoPayment(documentNumber) {
    await this.boletoOption.click({ timeout: 10000 });
    await this.documentInput.fill(documentNumber.replace(/\D/g, ''));
    await this.payButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async selectCreditCardPayment(cardInfo, documentNumber) {
    await this.creditCardOption.click({ timeout: 10000 });
    await this.cardNumberInput.fill(cardInfo.number.replace(/\s/g, ''));
    await this.cardExpiryInput.fill(`${cardInfo.expiryMonth}/${cardInfo.expiryYear}`);
    await this.cardCvvInput.fill(cardInfo.cvv);
    await this.cardNameInput.fill(cardInfo.name);
    await this.cardInstallmentsSelect.selectOption('1');
    await this.documentInput.fill(documentNumber.replace(/\D/g, ''));
    await this.payButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async handleUpsell() {
    try {
      await this.page.waitForURL('**/upsell', { timeout: 15000 });
      for (const button of this.upsellDeclineButtons) {
        if (await button.isVisible({ timeout: 5000 })) {
          await button.click();
          await this.page.waitForTimeout(1000);
        }
      }
    } catch (error) {
      console.log('Upsell não encontrado ou já tratado:', error.message);
    }
  }

  async isPaymentSuccessful() {
    try {
      await this.handleUpsell();
      const isSuccess = await this.successMessage.isVisible({ timeout: 5000 }) || 
                       await this.successHeader.isVisible({ timeout: 5000 }) ||
                       await this.copyCodeButton.isVisible({ timeout: 10000 });
      return isSuccess;
    } catch (error) {
      await this._takeScreenshot('payment-failed');
      console.error('Falha na verificação do pagamento:', error);
      return false;
    }
  }

  async isBoletoGenerated() {
    try {
      await expect(this.openBoletoButton).toBeVisible({ timeout: 20000 });
      return true;
    } catch (error) {
      await this._takeScreenshot('boleto-failed');
      console.error('Falha na verificação do boleto:', error);
      return false;
    }
  }

  async _takeScreenshot(prefix) {
    if (!this.page.isClosed()) {
      await this.page.screenshot({
        path: `screenshots/${prefix}-${Date.now()}.png`,
        fullPage: true
      });
    }
  }
}

module.exports = PaymentPage;