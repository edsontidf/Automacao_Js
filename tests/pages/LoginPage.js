class LoginPage {
  constructor(page) {
    this.page = page;
    
   
    this.emailInput = this.page.getByPlaceholder('E-mail').or(this.page.locator('input[type="email"]')).first();
    this.passwordInput = this.page.getByPlaceholder('Senha').or(this.page.locator('input[type="password"]')).first();
    this.loginButton = this.page.getByRole('button', { name: /entrar agora/i }).or(this.page.locator('button:has-text("entrar")')).first();
    this.errorMessage = this.page.getByText(/atenção, usuário ou senha/i)
      .or(this.page.locator('div.alert-danger'))
      .first();
    

    this.dashboardElement = this.page.locator('xpath=//*[@id="root"]/main/div[2]/div/div/div/div/div[1]/div/div[1]/h5');
    
  
    this._dashboardFallback = this.page.locator('h5:has-text("Dashboard")');
  }


  async navigate() {
    await this.page.goto('https://painel.firepay.com.br/', {
      waitUntil: 'networkidle',
      timeout: 30000
    });
  }

  async login(email, password, { expectSuccess = true } = {}) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();

    if (expectSuccess) {
      await this.page.waitForURL(/dashboard|painel|home/i, { timeout: 15000 });
    } else {
      await this.errorMessage.waitFor({ state: 'visible', timeout: 10000 });
    }
  }

 
  async isLoginSuccessful() {
    try {
      
      const isVisible = await this.dashboardElement.isVisible({ timeout: 8000 });
      const textMatch = (await this.dashboardElement.textContent()).includes('Dashboard');
      
      if (isVisible && textMatch) return true;
      
     
      return await this._dashboardFallback.isVisible({ timeout: 2000 });
    } catch {
      return false;
    }
  }

  
  async isLoginErrorDisplayed() {
    try {
      return await this.errorMessage.isVisible({ timeout: 5000 });
    } catch {
      return false;
    }
  }
}

module.exports = LoginPage;