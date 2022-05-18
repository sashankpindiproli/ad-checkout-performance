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
  await page.goto("https://engage19billing.test.devappdirect.me/login", {
    waitUntil: "networkidle0",
    timeout: 60000
  });
  await page.waitForSelector('input[class="adb-text__full_width"]');
  await page.$eval('label[for="username"] + .adb-text__full_width', (el,value) => el.value = value, userName);
  await page.$eval('label[for="password"] + .adb-text__full_width', (el,value) => el.value = value, password);
  await page.keyboard.press("Tab");
  await page.$eval( 'button[type="submit"]', el => el.click() );
  await page.waitForTimeout(2000);
  await page.goto("https://engage19billing.test.devappdirect.me/en-US/home");
  await page.waitForTimeout(2000);
};

export const getTitle = async () => await page.title();
