class LoginPage {
  constructor(page) {
    this.page = page;

    // Locators
    this.emailInput = page.getByTestId('input-login-email');
    this.passwordInput = page.getByTestId('input-login-password');
    this.loginButton = page.getByTestId('btn-submit-login');
    this.cookieAccept = page.getByTestId('cookie-accept-all');
    this.errorMessage = page.getByTestId('toast-title-1');
  }

  async goto() {
    await this.page.goto('https://test-automation-practice.com.br/auth');
  }

  async login(username, password) {
    await this.cookieAccept.click();
    await this.emailInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async getErrorMessage() {
    return await this.errorMessage.textContent();
  }
}

module.exports = LoginPage;