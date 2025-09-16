import BasePage from './base.page';

class HomePage extends BasePage {
  async getUserAvatar() { return await $('.avatar-user'); }
  async getDashboardHeader() { return await $('[data-testid="dashboard"]'); }
  async getUserMenuButton() {
    return await $('button[aria-label="Open user navigation menu"]');
  }
  async getSignOutLink() { return await $('a[href*="logout"]'); }
  async getUserMenuPanel() {
    return await $('react-partial[partial-name="global-user-nav-drawer"]');
  }

  async isUserLoggedIn(): Promise<boolean> {
    const avatar = await this.getUserAvatar();
    return avatar.isDisplayed();
  }

  async openUserMenu() {
    // Кликаем на кнопку меню пользователя
    const menuButton = await this.getUserMenuButton();
    await this.waitForElementDisplayed(menuButton);
    await menuButton.click();

    // Ждем появления меню (может потребоваться время для загрузки React)
    await browser.pause(2000); // небольшая пауза для загрузки

    const menuPanel = await this.getUserMenuPanel();
    await menuPanel.waitForDisplayed({ timeout: 10000 });
  }

  async clickSignOut() {
    const signOutLink = await this.getSignOutLink();
    await this.waitForElementDisplayed(signOutLink);
    await signOutLink.click();
  }

  async navigateToLogout() {
    await this.openUserMenu();
    await this.clickSignOut();
  }

  async navigateToLogoutDirect() {
    await browser.url('https://github.com/logout');
  }
}

export const homePage = new HomePage();