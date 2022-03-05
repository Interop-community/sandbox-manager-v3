const UTILS = require('../utils');

const PAGES = {
    APPS: {
        button: '[data-qa="nav-apps"]',
        check: '[data-qa="app-page-wrapper"]'
    },
    LAUNCH_SCENARIOS: {
        button: '[data-qa="nav-launch"]',
        check: '[data-qa="launch-scenarios-wrapper"]'
    },
    PERSONAS: {
        button: '[data-qa="nav-personas"]',
        check: '[data-qa="Persona-wrapper"]'
    },
    PATIENT: {
        button: '[data-qa="nav-patients"]',
        check: '[data-qa="Patient-wrapper"]'
    },
    PRACTITIONER: {
        button: '[data-qa="nav-practitioners"]',
        check: '[data-qa="Practitioner-wrapper"]'
    },
    DATA_MANAGER: {
        button: '[data-qa="nav-data-manager"]',
        check: '[data-qa="data-manager-wrapper"]'
    },
    SETTINGS: {
        button: '[data-qa="nav-settings"]',
        check: '[data-qa="settings-wrapper"]'
    }
};

exports.PAGES = PAGES;

exports.navigateTo = async (page) => {
    let button = await UTILS.getElementByCss(page.button);
    button.click();

    await UTILS.wait(500);

    let pageWrapper = await UTILS.getElementByCss(page.check, 2500);
    expect(pageWrapper).not.toBeNull();
} ;