const { test, expect } = require('@playwright/test');
const DynamicTablesPage = require('../pages/DynamicTablesPage');

test.describe('Dynamic Tables Tests', () => {
  test('should filter user by name', async ({ page }) => {
    const tablePage = new DynamicTablesPage(page);

    await tablePage.goto();
    await tablePage.filterName('joao');
    await tablePage.userName(1).click();

    await expect(tablePage.userName(1)).toContainText('João Silva');
    await page.screenshot({ path: 'table-filter-name.png' });
  });

  test('should edit user age successfully', async ({ page }) => {
    const tablePage = new DynamicTablesPage(page);

    await tablePage.goto();
    await tablePage.editUserAge(1, '29');

    await expect(tablePage.toast1).toContainText('Usuário atualizadoOs dados foram salvos com sucesso.');
    await page.screenshot({ path: 'table-edit-age.png' });
  });

  test('should delete user successfully', async ({ page }) => {
    const tablePage = new DynamicTablesPage(page);

    await tablePage.goto();
    await tablePage.deleteUser(1);

    await expect(tablePage.toast1).toContainText('Usuário removidoO usuário foi removido com sucesso.');
    await page.screenshot({ path: 'table-delete-user.png' });
  });
});
