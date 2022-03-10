const UTILS = require('../utils');

const MENU_ITEMS = [
    {
        name: 'Developer portal',
        selector: '[data-qa="help-item-developer-portal"]',
        tabTitle: 'HSPC Developers | The Healthcare Innovation Ecosystem'
    },
    {
        name: 'Snadbox docs',
        selector: '[data-qa="help-item-sandbox-docs"]',
        tabTitle: 'Collaboration Site'
    },
    {
        name: 'Code samples',
        selector: '[data-qa="help-item-code-samples"]',
        tabTitle: 'Collaboration Site'
    },
    {
        name: 'Tutorials',
        selector: '[data-qa="help-item-tutorials"]',
        tabTitle: 'Collaboration Site'
    },
    {
        name: 'FHIR',
        selector: '[data-qa="help-item-fhir"]',
        tabTitle: 'Index - FHIR v3.0.1'
    },
    {
        name: 'FAQ',
        selector: '[data-qa="help-item-faq"]',
        tabTitle: 'Collaboration Site'
    },
    {
        name: 'Developer forum',
        selector: '[data-qa="help-item-developer-forum"]',
        tabTitle: 'Google'
    }
];

exports.helpMenuItemsTest = () => [
    describe('Testing if the help menu has all the items in it', function () {
        it('should have all the menu items present', async () => {
            let button = await UTILS.getElementByCss('[data-qa="header-help-button"]');
            button.click();

            //Wait for the animation just in case
            await UTILS.wait(500);
        });
        MENU_ITEMS.map(item => {
            it(`should have "${item.name}"`, async () => {
                let button = await UTILS.getElementByCss(item.selector);
                expect(button).not.toBeNull();
            })
        });
    }),
    describe('Testing if all the menu items open in a new tab', function () {
        MENU_ITEMS.map(item => {
            it(`should open "${item.name}" in a new tab with title: "${item.tabTitle}"`, async () => {
                let button = await UTILS.getElementByCss(item.selector);
                button.click();

                //Wait for some time so that the browser can open the tab
                await UTILS.wait(500);

                await UTILS.moveToTab(1);
                await UTILS.wait(500);
                await UTILS.waitForLoad();
                let tabName = await UTILS.getTabName();
                await UTILS.closeTab(1);
                await UTILS.moveToTab(0);

                expect(tabName).toEqual(expect.stringContaining(item.tabTitle));
            })
        });
    }),
    describe('Closing the menu', function () {
        it('should close the menu', async () => {
            let overlay = await UTILS.getElementByXPath('/html/body/div[5]');
            overlay.click();
        });
    })
];