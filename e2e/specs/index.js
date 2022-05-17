import { load, getTitle, loginUser } from "../pageObjects";
import { autoScrollDownToEle } from '../pageObjects/screenshotsUtil';

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
    await loginUser('sashank.pindiproli+mm@appdirect.com','sashank_08%');
  });

  it('Verify login',async () => {
    //var links = await page.$$('.ad-uniheader__container--section > .company-dropdown');
  //await links[1].click();
    //await page.keyboard.press("Tab");
    await autoScrollDownToEle('[data-testid="slider:title"]',1);
    
    
    /*await page.waitFor(2000);
    await page.$eval("ul > li[data-testid='unav:Engage19_menu']", el => el.click() );
    const pageClicked = await page.evaluate(() => {
      return !!document.querySelector('.js-dropdown-active') // !! converts anything to boolean
    })
    if (pageClicked) { // you had the condition reversed. Not sure if it was intended.
      console.log('True')
    } else {
      console.log('False')
    }*/
  })
});
