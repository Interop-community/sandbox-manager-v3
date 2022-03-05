const UTILS = require('../utils');

exports.signOut = () => describe('Testing if the user sign out process works', function () {
    it('should show the menu when user menu button is clicked', async () => {
        let button = await UTILS.getElementByCss('[data-qa="header-user-button"]');
        button.click();

        //Wait for the animation
        await UTILS.wait(500);

        let menu = await UTILS.getElementByCss('[data-qa="user-menu-popover"]');
        expect(menu).not.toBeNull();
    });
    it('should sign out the app and redirect to another page when done', async () => {
        let signOutButton = await UTILS.getElementByCss('[data-qa="sign-out-button"]');
        signOutButton.click();

        //Wait for the animation
        UTILS.wait(500);

        // let menu = await UTILS.getElementByCss('[data-qa="user-menu-popover"]');
        // expect(menu).toBeNull();
    });
});