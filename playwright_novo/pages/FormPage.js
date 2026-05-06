class FormPage {
  constructor(page) {
    this.page = page;

    // Locators
    this.navForm = page.getByTestId('nav-item-formulários');
    this.cookieAccept = page.getByTestId('cookie-accept-all');
    this.firstNameInput = page.getByTestId('input-firstName');
    this.lastNameInput = page.getByTestId('input-lastName');
    this.emailInput = page.getByTestId('input-email');
    this.phoneInput = page.getByTestId('input-phone');
    this.cpfInput = page.getByTestId('input-cpf');
    this.birthdayInput = page.getByTestId('input-birthday');
    this.genderSelect = page.getByTestId('select-gender');
    this.addressInput = page.getByTestId('input-address');
    this.cityInput = page.getByTestId('input-city');
    this.stateSelect = page.getByTestId('select-state');
    this.zipCodeInput = page.getByTestId('input-zipCode');
    this.passwordInput = page.getByTestId('input-password');
    this.confirmPasswordInput = page.getByTestId('input-confirmPassword');
    this.submitButton = page.getByTestId('btn-submit');
    this.toast = page.getByTestId('toast-1');
  }

  async gotoForm() {
    await this.page.goto('https://test-automation-practice.com.br/auth');
    await this.navForm.click();
    await this.cookieAccept.click();
  }

  async fillForm(data) {
    await this.firstNameInput.fill(data.firstName);
    await this.lastNameInput.fill(data.lastName);
    await this.emailInput.fill(data.email);
    await this.phoneInput.fill(data.phone);
    await this.cpfInput.fill(data.cpf);
    await this.birthdayInput.fill(data.birthday);
    await this.genderSelect.click();
    await this.page.getByRole('option', { name: data.gender }).click();
    await this.addressInput.fill(data.address);
    await this.cityInput.fill(data.city);
    await this.stateSelect.click();
    await this.page.getByTestId('select-content').getByText(data.state).click();
    await this.zipCodeInput.fill(data.zipCode);
    await this.passwordInput.fill(data.password);
    await this.confirmPasswordInput.fill(data.confirmPassword);
  }

  async submitForm() {
    await this.submitButton.click();
  }
}

module.exports = FormPage;