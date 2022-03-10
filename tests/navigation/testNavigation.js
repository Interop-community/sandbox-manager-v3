const {PAGES, navigateTo} = require('./navigateTo');
const UTILS = require('../utils');

exports.testNavigation = () => describe('Testing all the sandbox manager\'s pages', function () {
    it('should navigate to launch scenarios page', async () => {
        await navigateTo(PAGES.LAUNCH_SCENARIOS);
        await UTILS.wait(500);
    });
    it('should navigate to personas page', async () => {
        await navigateTo(PAGES.PERSONAS);
        await UTILS.wait(500);
    });
    it('should navigate to patients page', async () => {
        await navigateTo(PAGES.PATIENT);
        await UTILS.wait(500);
    });
    it('should navigate to practitioners page', async () => {
        await navigateTo(PAGES.PRACTITIONER);
        await UTILS.wait(500);
    });
    it('should navigate to data manger page', async () => {
        await navigateTo(PAGES.DATA_MANAGER);
        await UTILS.wait(500);
    });
    it('should navigate to settings page', async () => {
        await navigateTo(PAGES.SETTINGS);
        await UTILS.wait(500);
    });
    it('should navigate to apps page', async () => {
        await navigateTo(PAGES.APPS);
        await UTILS.wait(500);
    });
});