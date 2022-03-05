const UTILS = require('../utils');

exports.notificationsWork = () => describe('Testing if the notifications button is there', function () {
    it('should show the menu when notifications button is clicked', async () => {
        let button = await UTILS.getElementByCss('[data-qa="header-notifications-button"]');
        button.click();

        //Wait for the animation
        await UTILS.wait(500);

        let menu = await UTILS.getElementByCss('[data-qa="notifications-menu-popover"]');
        expect(menu).not.toBeNull();
    });
    it('should close the menu by clicking on the invisible overlay', async () => {
        let overlay = await UTILS.getElementByCss('[style="position: fixed; top: 0px; bottom: 0px; left: 0px; right: 0px; z-index: 2000;"]');
        overlay.click();

        //Wait for the animation
        UTILS.wait(500);

        let menu = await UTILS.getElementByCss('[data-qa="notifications-menu-popover"]');
        expect(menu).toBeNull();
    });
});