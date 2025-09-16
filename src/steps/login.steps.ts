import { expect } from '@wdio/globals';
import { loginPage } from '../pages/login.page';
import { homePage } from '../pages/home.page';
import { passwordResetPage } from '../pages/password-reset.page';
import { logoutPage } from '../pages/logout.page';
import { config } from '../utils/config';

class LoginSteps {
  async performSuccessfulLogin(username: string, password: string) {
    await loginPage.open();
    await loginPage.login(username, password);
    const avatar = await homePage.getUserAvatar();
    await avatar.waitForDisplayed({ timeout: 15000 });
  }

  async performUnsuccessfulLogin(username: string, password: string) {
    await loginPage.open();
    await loginPage.login(username, password);
    const errorElement = await loginPage.getErrorMessage();
    await errorElement.waitForDisplayed({ timeout: 15000 });
  }

  async clickForgotPasswordLink() {
    await loginPage.open();
    await loginPage.clickForgotPasswordLink();
  }

  async verifyPasswordResetPageDisplayed() {
    await browser.waitUntil(
      async () => (await browser.getUrl()) === config.urls.password_reset,
      { timeout: 10000 }
    );
    const emailInput = await passwordResetPage.getEmailInput();
    await emailInput.waitForDisplayed({ timeout: 10000 });
  }

  async performLogout(username?: string) {
    // Переходим на страницу выхода
    await logoutPage.open();

    // Ждем загрузки страницы
    await browser.waitUntil(
      async () => await logoutPage.isSignOutFormDisplayed(),
      { timeout: 15000 }
    );

    // Нажимаем кнопку выхода
    if (username) {
      await logoutPage.clickUserSignOut();
    } else {
      await logoutPage.clickSignOut();
    }
  }

  async navigateToLogoutViaMenu() {
    // Переходим к выходу через меню пользователя
    await homePage.navigateToLogout();
  }

  async navigateToLogoutDirect() {
    // Прямой переход на страницу выхода
    await homePage.navigateToLogoutDirect();
  }

  async verifyLoggedOut() {
    // Более гибкая проверка выхода
    await browser.waitUntil(
      async () => {
        const currentUrl = await browser.getUrl();
        return currentUrl.includes('github.com') &&
          !currentUrl.includes('logout');
      },
      {
        timeout: 15000,
        timeoutMsg: 'User was not properly logged out'
      }
    );
  }

}

export const loginSteps = new LoginSteps();