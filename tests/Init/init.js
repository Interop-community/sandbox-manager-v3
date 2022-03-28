const {Builder} = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const {setDriver} = require('../utils');
require('selenium-webdriver/chrome');
const firefox = require('selenium-webdriver/firefox');
// require('chromedriver');
require('geckodriver');

// const cap = Capabilities.chrome();
// cap.set('chromeOptions', {
//     'args': ["--disable-extensions", "--disable-gpu", "--disable-dev-shm-usage", "--no-sandbox", "--headless"]
//     //'args': ["--disable-extensions", "--disable-gpu", "--disable-dev-shm-usage", "--no-sandbox"]
// });
// const d = new Builder().forBrowser('chrome').withCapabilities(cap).build();
// const d = new Builder().forBrowser('chrome').setChromeOptions(new chrome.Options().addArguments('--headless')).build();

const d = new Builder().forBrowser('firefox').build();
// const d = new Builder().forBrowser('firefox').setFirefoxOptions(new firefox.Options().addArguments('--headless')).build();

// let d = new Builder()
//     .forBrowser('firefox')
//     .usingServer('http://localhost:4444/wd/hub')
//     .build();

// const rootURL = 'http://localhost:3001';
const rootURL = 'https://dev-meld.interop.community';
let driver;
jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000 * 30 * 3;

exports.init = describe(`Initialize the test suite for user: ${process.env.USERNAME}`, function () {
    it('should wait for the driver to start', () => d.then(_d => driver = _d));

    it('should initialize the context', async () => {
        // await driver.manage().window().maximize();
        await driver.get(rootURL)
        setDriver(driver);
    });
});
