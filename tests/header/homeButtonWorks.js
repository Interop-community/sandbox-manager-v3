const UTILS = require('../utils');

exports.testHomeButton = () => describe('Testing home button functionality', function () {
    it('should navigate to the dashboard when home clicked', async () => {
        let button = await UTILS.getElementByCss('[data-qa="header-logo"]');
        button.click();

        await UTILS.wait(1000);

        let currentUrl = await UTILS.getCurrentURL();
        expect(currentUrl.toString()).toEqual(expect.stringContaining('dashboard'));
    });
});