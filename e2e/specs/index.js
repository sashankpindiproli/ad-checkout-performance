const fs = require('fs');
import { load, getTitle, loginUser } from "../pageObjects";
import { scrollIntoViewIfOutOfView, compareScreenshots  } from '../pageObjects/screenshotsUtil';

const marketplaceDir ='images/marketplace-flow';
const currentDate = new Date().toISOString().slice(0, 10);

const saveAddress = async () => {
  await page.waitForTimeout(500);
  const addressEditLink = '[data-testid="sac:editLink"]';
  await page.waitForTimeout(500);
  await scrollIntoViewIfOutOfView('[data-testid="shipping-header-title"]');
  await page.$eval(addressEditLink, el => el.click());
  await page.waitForTimeout(100);

  const shippingAddressName = '[data-testid="form:shippingAddress:name"]';
  const shippingAddressLine = '[data-testid="form:shippingAddress:addressLine1"]';
  const shippingAddressCity = '[data-testid="form:shippingAddress:city"]';
  const shippingAddressPostalCode = '[data-testid="form:shippingAddress:postalCode"]';

  const countryEle = await page.$('[data-testid="form:shippingAddress:countryCode"]');
  await countryEle.type('United States');
  
  await page.waitForTimeout(100);
  const selectElem = await page.$('[data-testid="form:shippingAddress:subdivisionCode"]');
  await selectElem.type('Georgia');
  
  await page.waitForTimeout(100);
  await page.type(shippingAddressName, 'Sashank Pindiproli');
  
  await page.waitForTimeout(100);
  await page.type(shippingAddressLine, '4901 Olde Towne Parkway, Suite 200');
  
  await page.waitForTimeout(100);
  await page.type(shippingAddressCity, 'Marietta');
  
  await page.waitForTimeout(100);
  await page.type(shippingAddressPostalCode, '30068');
  
  await page.waitForTimeout(100);
  await page.$eval('button[data-testid="saveBtn"]', el => el.click());
 }

describe("Checkout | Engage19Billing", () => {
  beforeAll(async () => {
    await load();
  });

  it(`Assert that you can click the profile tab`, async (done) => {
    expect(await getTitle()).toBe("Checkout | Engage19Billing");
    done();
  });

});

describe("Checkout | Engage19Billing", () => {
  beforeAll(async () => {
    if (!fs.existsSync(`${marketplaceDir}/${currentDate}`)) fs.mkdirSync(`${marketplaceDir}/${currentDate}`,{ recursive: true });
    await loginUser('sashank.pindiproli+mm@appdirect.com','sashank_08%');
  });

  it('Verify Marketplace Flow',async () => {
    const productSlider = '#mainContent .pageOrderableContainer_item ~ .pageOrderableContainer_item ~ .pageOrderableContainer_item [data-index="3"] a';
    
    const testDir = 'images/marketplace-flow';
    const goldenDir = 'images/marketplace-flow-golden';
    const diffDir = 'images/marketplace-flow-diff';
    
    await scrollIntoViewIfOutOfView(productSlider);
    await page.waitForTimeout(2000);
    await page.screenshot({path: `${marketplaceDir}/${currentDate}/home.png`, fullPage: true});
    await page.$eval(productSlider, el => el.click() );

    await page.waitForTimeout(2000);
    await page.screenshot({path: `${marketplaceDir}/${currentDate}/storefront.png`, fullPage: true});
    await page.$eval('[data-cta-type="BUY"]', el => el.click() );
    
    await page.waitForTimeout(2000);
    await page.waitForFunction("window.location.pathname == '/checkout/cart'");
    await page.waitForSelector('[data-testid="header-nextButton-configure"]');
    await page.screenshot({path: `${marketplaceDir}/${currentDate}/configure.png`, fullPage: true});
    await page.$eval('[data-testid="header-nextButton-configure"]', el => el.click() );
    
    await page.waitForTimeout(2000);
    await page.waitForFunction("window.location.pathname == '/checkout/billing'");
    await page.waitForTimeout(2000);
    const exists = await page.evaluate(() => {
      return document.querySelector('[data-testid="saved-sac-name"]') ? true : false;
    });

    if(!exists) {
      await saveAddress();
    }
    await page.waitForSelector('[data-testid="saved-sac-name"]');
    await page.screenshot({path: `${marketplaceDir}/${currentDate}/billing.png`, fullPage: true});
    await page.waitForSelector('[data-testid="header-nextButton-billing"]');
    await page.$eval('[data-testid="header-nextButton-billing"]', el => el.click() );

    await page.waitForSelector('[data-testid="complete-purchase"]');
    await page.screenshot({path: `${marketplaceDir}/${currentDate}/review.png`, fullPage: true});

    expect(await compareScreenshots('home', currentDate, testDir, goldenDir, diffDir)).toBeLessThan(50);
    expect(await compareScreenshots('storefront', currentDate, testDir, goldenDir, diffDir)).toBeLessThan(50);
    expect(await compareScreenshots('configure', currentDate, testDir, goldenDir, diffDir)).toBeLessThan(50);
    expect(await compareScreenshots('billing', currentDate, testDir, goldenDir, diffDir)).toBeLessThan(50);
    expect(await compareScreenshots('review', currentDate, testDir, goldenDir, diffDir)).toBeLessThan(50);
  });

  afterAll(async () =>{
    await page.goto("https://engage19billing.test.devappdirect.me/checkout/cartDelete");
  })
});
