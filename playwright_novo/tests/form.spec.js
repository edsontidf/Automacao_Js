const { test, expect } = require('@playwright/test');
const FormPage = require('../pages/FormPage');

test.describe('Form Tests', () => {

  test('should submit form successfully with valid data', async ({ page }) => {
    const formPage = new FormPage(page);

    await formPage.gotoForm();

    const formData = {
      firstName: 'teste qa',
      lastName: 'teste',
      email: 'teste@gmail.com',
      phone: '(61) 9999-9999',
      cpf: '011.155.455-658',
      birthday: '1986-09-22',
      gender: 'Masculino',
      address: 'quadra 313 conjunto a casa 15',
      city: 'santa maria',
      state: 'Distrito Federal',
      zipCode: '72543-501',
      password: '123456',
      confirmPassword: '123456'
    };

    await formPage.fillForm(formData);
    await formPage.submitForm();

    await expect(formPage.toast).toBeVisible();
    await expect(formPage.toast).toContainText('Formulário enviado com sucesso!Tentativa 1 realizada com sucesso.');
    await page.screenshot({ path: 'form-success.png' });
  });

  test('should show error when submitting empty form', async ({ page }) => {
    const formPage = new FormPage(page);

    await formPage.gotoForm();

    await formPage.submitForm();

    await expect(formPage.toast).toContainText('Erro na validaçãoCorrija os erros antes de enviar.');
    await page.screenshot({ path: 'form-error.png' });
  });

});