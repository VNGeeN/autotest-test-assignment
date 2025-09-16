import BasePage from './base.page';

class LoginPage extends BasePage {
  async getUsernameInput() { return await $('#login_field'); }
  async getPasswordInput() { return await $('#password'); }
  async getSignInButton() { return await $('input[type="submit"]'); }
  async getErrorMessage() { return await $('#js-flash-container .flash-error'); }
  async getForgotPasswordLink() { return await $('a[href="/password_reset"]'); }

  async open() {
    await super.open('https://github.com/login');
  }

  async login(username: string, password: string) {
    await this.setValue(await this.getUsernameInput(), username);
    await this.setValue(await this.getPasswordInput(), password);
    await this.clickElement(await this.getSignInButton());
  }

  async getErrorMessageText(): Promise<string> {
    const errorElement = await this.getErrorMessage();
    await this.waitForElementDisplayed(errorElement);
    return errorElement.getText();
  }

  async isErrorMessageDisplayed(): Promise<boolean> {
    const errorElement = await this.getErrorMessage();
    return errorElement.isDisplayed();
  }

  async clickForgotPasswordLink() {
    const link = await this.getForgotPasswordLink();
    await this.waitForElementDisplayed(link);
    await link.click();
  }
}

export const loginPage = new LoginPage();