const { Key } = require('selenium-webdriver');
const UTILS = require('../utils');

exports.login = describe('Login into the system', function () {
    it('should enter the correct username and password', async () => {
        await UTILS.wait(3000);
        let username = await UTILS.getElementById('username');
        let password = await UTILS.getElementById('password');
        // await username.sendKeys('testuser90', Key.TAB);
        await username.sendKeys(process.env.USERNAME, Key.TAB);

        // await password.sendKeys('test', Key.ENTER);
        await password.sendKeys(process.env.PASSWORD, Key.ENTER);

    });
    
    it('should agree Terms of Use & Privacy Statement', async ()=> {
        await UTILS.wait(5000);

        let accept = await UTILS.getElementByCss('div.MuiDialogActions-root.MuiDialogActions-spacing > button', 5000)
        if (accept !== null) {
            accept.click()
        }
        let dashboard = UTILS.getElementByCss('[data-qa="dashboard-page"]');
        expect(dashboard).not.toBeNull();
 
 
     });

    it('should redirect to the dashboard after login', async () => {
        await UTILS.wait(2500);

        let handles = await UTILS.driver.getAllWindowHandles();
        await UTILS.driver.switchTo().window(handles[0]);

        await UTILS.waitForElementCSS('[data-qa="dashboard-page"]');
        let dashboard = UTILS.getElementByCss('[data-qa="dashboard-page"]');
        expect(dashboard).not.toBeNull();
    });



});

// exports.login = describe('Login into the system', function () {
//     it('should enter the correct username and password', async () => {
//         await UTILS.waitForElementXPATH('/html/body/div/div[2]/div/div/div[1]/div/form/div[1]/input');
//         let username = await UTILS.getElementByXPath('/html/body/div/div[2]/div/div/div[1]/div/form/div[1]/input');
//         let password = await UTILS.getElementByXPath('/html/body/div/div[2]/div/div/div[1]/div/form/div[2]/input');
//         await username.sendKeys(process.env.USERNAME, Key.TAB);
//         await password.sendKeys(process.env.PASSWORD, Key.ENTER);
//         UTILS.shoot();
//     });
//
//     it('should redirect to the dashboard after login', async () => {
//         await UTILS.wait(5000);
//
//         let handles = await UTILS.driver.getAllWindowHandles();
//         await UTILS.driver.switchTo().window(handles[0]);
//
//         await UTILS.waitForElementCSS('[data-qa="dashboard-page"]');
//         let dashboard = UTILS.getElementByCss('[data-qa="dashboard-page"]');
//         expect(dashboard).not.toBeNull();
//     });
// });

// exports.login = describe('Login into the system', function () {
//     it('should open the login page', async () => {
//         await UTILS.waitForElementXPATH('//*[@id="root"]/div/div/div/div[2]/div[1]/div/div[3]/div[1]/div/form/div[1]/button');
//         let loginButton = await UTILS.getElementByXPath('//*[@id="root"]/div/div/div/div[2]/div[1]/div/div[3]/div[1]/div/form/div[1]/button');
//         expect(loginButton).not.toBeNull();
//         loginButton.click();
//     });
//
//     it('should click the see the login credentials form', async () => {
//         await UTILS.wait(2000);
//         let handles = await UTILS.driver.getAllWindowHandles();
//         expect(handles.length).toBe(2);
//         await UTILS.driver.switchTo().window(handles[1]);
//     });
//
//     it('find the username filed and enter the data in it', async () => {
//         await UTILS.waitForElementXPATH('//*[@id="identifierId"]');
//         let username = await UTILS.getElementByXPath('//*[@id="identifierId"]');
//         expect(username).not.toBeNull();
//         await username.sendKeys(process.env.USERNAME, Key.ENTER);
//     });
//
//     it('should find the password fields and enter the data in it', async () => {
//         await UTILS.waitForElementXPATH('//*[@id="password"]/div[1]/div/div[1]/input');
//         let password = await UTILS.getElementByXPath('//*[@id="password"]/div[1]/div/div[1]/input');
//         expect(password).not.toBeNull();
//         await password.sendKeys(process.env.PASSWORD, Key.ENTER);
//     });
//
//     it('should redirect to the dashboard after login', async () => {
//         await UTILS.wait(10000);
//
//         let handles = await UTILS.driver.getAllWindowHandles();
//         await UTILS.driver.switchTo().window(handles[0]);
//
//         await UTILS.waitForElementCSS('[data-qa="header-user-button"]');
//         let dashboard = UTILS.getElementByCss('[data-qa="header-user-button"]');
//         await UTILS.wait(10000);
//         expect(dashboard).not.toBeNull();
//     });
// });
