const { By, until } = require('selenium-webdriver');

let driver;
const waitUntilTime = 500;

exports.setDriver = function (newDriver) {
    driver = newDriver;
};

exports.getElementByCss = async function getElementByCss (selector, waitTime = waitUntilTime) {
    try {
        const el = await driver.wait(until.elementLocated(By.css(selector)), waitTime);
        return await driver.wait(until.elementIsVisible(el), waitTime);
    } catch (e) {
        return null;
    }
};

exports.getElementById = async function getElementById (id, waitTime = waitUntilTime) {
    try {
        const el = await driver.wait(until.elementLocated(By.id(id)), waitTime);
        return await driver.wait(until.elementIsVisible(el), waitTime);
    } catch (e) {
        return null;
    }
};

exports.getElementByXPath = async function getElementByXPath (xpath, waitTime = waitUntilTime) {
    try {
        const el = await driver.wait(until.elementLocated(By.xpath(xpath)), waitTime);
        return await driver.wait(until.elementIsVisible(el), waitTime);
    } catch (e) {
        return null;
    }
};

exports.wait = async function wait (time) {
    return await driver.sleep(time);
};

exports.moveToTab = async function moveToTab (index) {
    let handles = await driver.getAllWindowHandles();
    return await driver.switchTo().window(handles[index]);
};

exports.closeTab = async function closeTab (index) {
    let handles = await driver.getAllWindowHandles();
    return await driver.close(handles[index]);
};

exports.getTabName = async function getTabName () {
    return await driver.getTitle();
};

exports.waitForLoad = async function waitForLoad () {
    return await driver.wait(() => driver.executeScript('return document.readyState').then(state => state === 'complete'));
};

exports.waitForLoader = async function waitForLoader (loaderSelector) {
    return await driver.wait(async () => {
        let loader = await this.getElementByCss(loaderSelector);
        return !!loader;
    });
};

exports.getCurrentURL = async function getCurrentURL() {
    return await driver.getCurrentUrl();
};