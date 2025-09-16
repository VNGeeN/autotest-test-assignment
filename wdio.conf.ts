import { browser } from '@wdio/globals';

export const config = {
    autoCompileOpts: {
        autoCompile: true,
        tsNodeOpts: {
            transpileOnly: true,
            project: './tsconfig.json'
        }
    },
    specs: ['./src/tests/**/*.test.ts'], 
    maxInstances: 1, // Уменьшим для стабильности (было 5)
    capabilities: [{
        browserName: 'chrome',
        'goog:chromeOptions': {
            args: [
                'window-size=1366,768',
                '--disable-web-security',
                '--disable-extensions',
                '--disable-notifications',
                '--no-sandbox',
                '--incognito', 
                // '--headless' // Добавим headless режим
            ],
        },
        acceptInsecureCerts: true
    }],
    logLevel: 'error',
    waitforTimeout: 20000,
    connectionRetryTimeout: 60000,
    connectionRetryCount: 3,
    services: [['chromedriver', {
        chromedriverCustomPath: '/usr/bin/chromedriver'
    }]],
    reporters: ['spec'],
    framework: 'mocha',
    mochaOpts: {
        ui: 'bdd',
        timeout: 60000
    },
    // Добавим базовый URL и хук для инициализации
    baseUrl: 'https://github.com',
    before: function () {
        require('ts-node').register({ files: true });
        browser.setTimeout({ 'implicit': 10000 });
    },
    afterTest: async function (test, context, { error, result, duration, passed, retries }) {
        // Очищаем cookies и localStorage после каждого теста
        await browser.deleteAllCookies();
        await browser.execute('window.localStorage.clear();');
        await browser.execute('window.sessionStorage.clear();');

        await browser.pause(1000);
    }
};