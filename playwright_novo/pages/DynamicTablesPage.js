class DynamicTablesPage {
  constructor(page) {
    this.page = page;

    this.navTables = page.getByTestId('nav-item-tabelas');
    this.cookieAccept = page.getByTestId('cookie-accept-all');
    this.searchInput = page.getByTestId('input-search');
    this.toast1 = page.getByTestId('toast-1');
  }

  async goto() {
    await this.page.goto('https://test-automation-practice.com.br/auth');
    await this.navTables.click();
    if (await this.cookieAccept.isVisible()) {
      await this.cookieAccept.click();
    }
    await this.page.waitForLoadState('networkidle');
    await this.searchInput.waitFor({ state: 'visible' });
  }

  async filterName(name) {
    await this.searchInput.waitFor({ state: 'visible' });
    await this.searchInput.fill(name);
  }

  userName(index) {
    return this.page.getByTestId(`stats-value-user-name-${index}`);
  }

  userCheckbox(index) {
    return this.page.getByTestId(`checkbox-select-user-${index}`);
  }

  editUserButton(index) {
    return this.page.getByTestId(`btn-edit-user-${index}`);
  }

  editAgeInput(index) {
    return this.page.getByTestId(`input-edit-age-${index}`);
  }

  saveUserButton(index) {
    return this.page.getByTestId(`btn-save-user-${index}`);
  }

  deleteUserButton(index) {
    return this.page.getByTestId(`btn-delete-user-${index}`);
  }

  async selectUser(index) {
    await this.userCheckbox(index).click();
  }

  async editUserAge(index, age) {
    await this.selectUser(index);
    await this.editUserButton(index).click();
    await this.editAgeInput(index).fill(age);
    await this.saveUserButton(index).click();
  }

  async deleteUser(index) {
    await this.userCheckbox(index).click();
    await this.userCheckbox(index).click();
    await this.deleteUserButton(index).click();
  }
}

module.exports = DynamicTablesPage;
