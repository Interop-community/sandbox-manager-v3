const UTILS = require('../utils');

exports.toggleSideMenu = () => describe('Testing if the side menu button will toggle the navigation menu', function () {
    it('should hide the navigation when hamburger clicked', async () => {
        let button = await UTILS.getElementByCss('[data-qa="side-nav-toggle"]');
        button.click();

        //Wait for the animation
        await UTILS.wait(500);

        let menu = await UTILS.getElementByCss('[data-qa="side-nav"]');
        expect(menu).toBeNull();
    });
    it('should show the navigation when hamburger clicked', async () => {
        let button = await UTILS.getElementByCss('[data-qa="side-nav-toggle"]');
        button.click();

        //Wait for the animation
        await UTILS.wait(1000);

        let menu = await UTILS.getElementByCss('[data-qa="nav-apps"]');
        expect(menu).not.toBeNull();
    });
});