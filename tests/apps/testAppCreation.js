let { Key } = require('selenium-webdriver');
const UTILS = require('../utils');

exports.testAppCreation = () => describe('Testing app creation', function () {
    it('should show the app creation modal when the plus button is clicked', async () => {
        let button = await UTILS.getElementByCss('[data-qa="create-app-button"]', 2000);
        button.click();

        // Wait for animation and stuff
        await UTILS.wait(500);

        let wrapper = await UTILS.getElementByCss('[data-qa="create-app-modal-wrapper"]', 2500);
        expect(wrapper).not.toBeNull();
    });
    it('should fill in the new app details', async () => {
        let appName = await UTILS.getElementByCss('[data-qa="name-input"]');
        appName.sendKeys('Sample app name');

        let appDescription = await UTILS.getElementByCss('[data-qa="description-input"]');
        appDescription.sendKeys('Sample app description');

        let appLaunchUri = await UTILS.getElementByCss('[data-qa="launch-uri-input"]');
        appLaunchUri.sendKeys('http://localhost:3001/launch.html', Key.TAB);

        let redirectUris = await UTILS.getElementByCss('[data-qa="redirect-uris-input"]');
        let urisValue = await redirectUris.getAttribute('value');
        expect(urisValue).toBe('http://localhost:3001/');
    });
    it('should should create the app and display the new app id and the new app in the list', async () => {
        let saveButton = await UTILS.getElementByCss('[data-qa="app-modal-save-button"]');
        saveButton.click();

        let clientId = await UTILS.getElementByCss('[data-qa="new-app-client-id"]', 10000);
        expect(clientId).not.toBeNull();

        clientId = await clientId.getText();
        let appInList = await UTILS.getElementByCss(`[data-qa="app-${clientId}"]`, 2000, false);
        expect(appInList).not.toBeNull();
    });
    it('should close the modal when clicking on the close button', async () => {
        let closeButton = await UTILS.getElementByCss('[data-qa="modal-close-button"]');
        closeButton.click();

        closeButton = await UTILS.getElementByCss('[data-qa="modal-close-button"]');
        expect(closeButton).toBeNull();
    });
});