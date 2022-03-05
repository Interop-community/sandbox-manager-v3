let {Key} = require('selenium-webdriver');

const UTILS = require('../utils');

exports.createSandbox = () => describe('Testing sandbox creation', function () {
    it('should show the creation modal when the button is clicked', async () => {
        let button = await UTILS.getElementByCss('[data-qa="create-sandbox"]', 2000);
        button.click();

        //Wait for the animation just in case
        await UTILS.wait(500);

        let dialog = await UTILS.getElementByCss('[data-qa="create-sandbox-dialog"]');
        expect(dialog).not.toBeNull();
    });

    it('should close when the close button is pressed', async () => {
        let closeButton = await UTILS.getElementByCss('[data-qa="modal-close-button"]');
        closeButton.click();

        //Wait for the animation just in case
        await UTILS.wait(500);

        let dialog = await UTILS.getElementByCss('[data-qa="create-sandbox-dialog"]');
        expect(dialog).toBeNull();
    });

    it('should update the sandbox id based on the entered name', async () => {
        let button = await UTILS.getElementByCss('[data-qa="create-sandbox"]');
        button.click();

        //Wait for the animation just in case
        await UTILS.wait(500);

        let name = await UTILS.getElementById('name');
        name.sendKeys(process.env.SANDBOX_NAME, Key.TAB);

        // let id = await UTILS.getElementByCss('[data-qa="sandbox-create-id"]');
        // let generatedId = await id.getAttribute('value');

        // expect(generatedId).toBe('AUTOTESTSANDBOX3');

        let description = await UTILS.getElementById('description');
        description.sendKeys('Sample auto description');
    });

    it('should select the correct FHIR version', async () => {
        let versionSelect = await UTILS.getElementByCss('[data-qa="sandbox-version"]');
        versionSelect.click();

        let fhir_ver = ['fhir-dstu2', "fhir-stu3", "fhir-r4", 'fhir-r5'][Math.floor(Math.random() * 4)]
        await UTILS.waitForElementCSS(`[data-qa="${fhir_ver}"]`);
        let stu3 = await UTILS.getElementByCss(`[data-qa="${fhir_ver}"]`);
        stu3.click();
        await UTILS.wait(500);
    });

    it('should create a sandbox', async () => {
        await UTILS.waitForElementCSS('[data-qa="sandbox-submit-button"]');
        let createButton = await UTILS.getElementByCss('[data-qa="sandbox-submit-button"]');
        createButton.click();

        await UTILS.wait(2500);
        await UTILS.waitForElementCSS(`[data-qa="sandbox-${process.env.SANDBOX_NAME.replace(/ /g, '')}"]`);
        // await UTILS.waitForElementCSS('[data-qa="sandbox-creating-loader"]');
        await UTILS.wait(1500);

        // await UTILS.waitForElementCSS('[data-qa="app-page-wrapper"]');
        // let appsPageWraooer = await UTILS.getElementByCss('[data-qa="app-page-wrapper"]', 5000);
        // expect(appsPageWraooer).not.toBeNull();
        // let currentUrl = await UTILS.getCurrentURL();
        // expect(currentUrl.toString()).toEqual(expect.stringContaining('STRESSTEST'));
    });
});
