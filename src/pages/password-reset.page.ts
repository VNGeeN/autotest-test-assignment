import BasePage from './base.page';

class PasswordResetPage extends BasePage {
    async getEmailInput() { return await $('#email_field'); }
    async getSendPasswordResetButton() { return await $('input[type="submit"]'); }
    async getSuccessMessage() { return await $('#js-flash-container .flash-notice'); }

    async open() {
        await super.open('https://github.com/password_reset');
    }

    async isEmailInputDisplayed(): Promise<boolean> {
        const emailInput = await this.getEmailInput();
        return emailInput.isDisplayed();
    }

    async isSuccessMessageDisplayed(): Promise<boolean> {
        const successMessage = await this.getSuccessMessage();
        return successMessage.isDisplayed();
    }
}

export const passwordResetPage = new PasswordResetPage();