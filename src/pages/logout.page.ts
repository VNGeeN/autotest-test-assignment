import BasePage from './base.page';

class LogoutPage extends BasePage {
    async getSignOutForm() {
        return await $('form[action="/logout"]');
    }

    async getSignOutButton() {
        return await $('input[type="submit"][name="commit"][value="Sign out"]');
    }

    async open() {
        await super.open('https://github.com/logout');
        await browser.pause(2000);
        await this.waitForPageLoaded();
    }

    async isSignOutFormDisplayed(): Promise<boolean> {
        try {
            const form = await this.getSignOutForm();
            return await form.isDisplayed();
        } catch (error) {
            return false;
        }
    }

    async clickSignOut() {
        const signOutButton = await this.getSignOutButton();
        await this.waitForElementDisplayed(signOutButton);
        await signOutButton.click();
    }

    async clickUserSignOut() {
        await this.clickSignOut();
    }

    async isLoggedOut(): Promise<boolean> {
    const currentUrl = await browser.getUrl();
    
    // После выхода мы должны быть на главной странице или странице входа
    const isOnHomePage = currentUrl === 'https://github.com/';
    const isOnLoginPage = currentUrl === 'https://github.com/login';
    
    // Или URL может содержать параметры, проверим базовое соответствие
    const isOnGitHub = currentUrl.includes('github.com');
    const isNotOnLogout = !currentUrl.includes('logout');
    
    return (isOnHomePage || isOnLoginPage) && isOnGitHub && isNotOnLogout;
  }
}

export const logoutPage = new LogoutPage();