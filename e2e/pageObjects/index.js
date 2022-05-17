const fs = require('fs');
const puppeteer = require('puppeteer');
const rootSelector = '#root';

export const root = async () => await page.$(rootSelector);

export const load = async () => {
  await page.goto("http://localhost:3000/checkout/cart", {
    waitUntil: "networkidle0",
    timeout: 60000
  });
};

export const loginUser = async (userName, password) => {
  const loginDir ='images/login';
  const currentDate = new Date().toISOString().slice(0, 10);
  await page.goto("https://engage19billing.test.devappdirect.me/login", {
    waitUntil: "networkidle0",
    timeout: 60000
  });
  //await page.screenshot({path: `${loginDir}/${currentDate}/loginUser.png`, fullPage: true});
  await page.waitForSelector('input[class="adb-text__full_width"]');
  await page.$eval('label[for="username"] + .adb-text__full_width', (el,value) => el.value = value, userName);
  await page.$eval('label[for="password"] + .adb-text__full_width', (el,value) => el.value = value, password);
  await page.keyboard.press("Tab");
  await page.$eval( 'button[type="submit"]', el => el.click() );
  await page.waitForTimeout(2000);
  await page.goto("https://engage19billing.test.devappdirect.me/en-US/home");
  await page.waitForTimeout(2000);
  if (!fs.existsSync(`${loginDir}/${currentDate}`)) fs.mkdirSync(`${loginDir}/${currentDate}`,{ recursive: true });
  await page.screenshot({path: `${loginDir}/${currentDate}/loginUser.png`, fullPage: true});
  /*const [link] = await page.$x("//a[contains(., 'XO Test Company 4')]");
  if (link) {
    await link.click();
  }*/
};

export const getTitle = async () => await page.title();
