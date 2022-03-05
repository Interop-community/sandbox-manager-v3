const {By, until} = require('selenium-webdriver');
const fs = require('fs');

let driver;
const waitUntilTime = 500;

exports.setDriver = function (newDriver) {
    driver = newDriver;
    exports.driver = driver;
};

exports.getElementByCss = async function getElementByCss(selector, waitTime = waitUntilTime, shouldWaitForVisibility = true) {
    try {
        const el = await driver.wait(until.elementLocated(By.css(selector)), waitTime);
        return shouldWaitForVisibility
            ? await driver.wait(until.elementIsVisible(el), waitTime)
            : el;
    } catch (e) {
        return null;
    }
};

exports.getElementById = async function getElementById(id, waitTime = waitUntilTime, shouldWaitForVisibility = true) {
    try {
        const el = await driver.wait(until.elementLocated(By.id(id)), waitTime);
        return shouldWaitForVisibility
            ? await driver.wait(until.elementIsVisible(el), waitTime)
            : el;
    } catch (e) {
        return null;
    }
};

exports.getElementByXPath = async function getElementByXPath(xpath, waitTime = waitUntilTime, shouldWaitForVisibility = true) {
    try {
        const el = await driver.wait(until.elementLocated(By.xpath(xpath)), waitTime);
        return shouldWaitForVisibility
            ? await driver.wait(until.elementIsVisible(el), waitTime)
            : el;
    } catch (e) {
        return null;
    }
};

exports.wait = async function wait(time) {
    return await driver.sleep(time);
};

exports.moveToTab = async function moveToTab(index) {
    let handles = await driver.getAllWindowHandles();
    return await driver.switchTo().window(handles[index]);
};

exports.closeTab = async function closeTab(index = 0) {
    let handles = await driver.getAllWindowHandles();
    return await driver.close(handles[index]);
};

exports.getTabName = async function getTabName() {
    return await driver.getTitle();
};

exports.waitForLoad = async function waitForLoad() {
    return await driver.wait(() => driver.executeScript('return document.readyState').then(state => state === 'complete'));
};

exports.waitForElementCSS = async function waitForElementCSS(loaderSelector) {
    return await driver.wait(async () => {
        let loader = await this.getElementByCss(loaderSelector);
        return !!loader;
    });
};

exports.shoot = function shoot() {
    driver.takeScreenshot().then(imgData => {
        fs.writeFileSync('img.png', imgData, 'base64');
    });
};

exports.waitForElementXPATH = async function waitForElementXPATH(xPath) {
    return await driver.wait(async () => {
        let loader = await this.getElementByXPath(xPath, undefined, false);
        return !!loader;
    });
};

exports.getCurrentURL = async function getCurrentURL() {
    return await driver.getCurrentUrl();
};

exports.finish = async function finish() {
    return await driver.quit();
};
