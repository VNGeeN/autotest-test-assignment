export default class BasePage {
  async open(path: string) {
    await browser.url(path);
  }

  async waitForElementDisplayed(element: WebdriverIO.Element, timeout: number = 15000) {
    await element.waitForDisplayed({ timeout });
    await element.waitForEnabled({ timeout });
    await element.waitForClickable({ timeout });
  }

  async clickElement(element: WebdriverIO.Element) {
    await this.waitForElementDisplayed(element);
    await element.click();
  }

  async setValue(element: WebdriverIO.Element, value: string) {
    await this.waitForElementDisplayed(element);
    await element.clearValue();
    await element.setValue(value);
  }

  async waitForPageLoaded() {
    await browser.waitUntil(
      async () => {
        const state = await browser.execute('return document.readyState;');
        return state === 'complete';
      },
      {
        timeout: 15000,
        timeoutMsg: 'Page failed to load within 15 seconds'
      }
    );
  }

  async verifyUrl(expectedUrl: string) {
    await browser.waitUntil(
      async () => (await browser.getUrl()) === expectedUrl,
      {
        timeout: 10000,
        timeoutMsg: `Expected URL to be ${expectedUrl} but found ${await browser.getUrl()}`
      }
    );
  }

  async takeScreenshot(filename: string) {
    await browser.saveScreenshot(`./screenshots/${filename}.png`);
  }
  
  async getPageSource() {
    return await browser.getPageSource();
  }
}