import { getCartProgressiveItemText, getdiscountCodeBtnText, getContinueShoppingButtonText, getNextButtonText } from "../pageObjects/app";
import { takeAndCompareScreenshot } from '../pageObjects/screenshotsUtil'
import { load } from "../pageObjects";

xdescribe("Smoke Test", () => {
  xbeforeAll(async () => {
    await load();
  });

  xdescribe("Home Page",() =>{
    it('Home Page Sanity Check', async (done) => {
      await page.waitFor(1000);
      const result = await takeAndCompareScreenshot(page, 'cart', 'Home');
      expect(result).toBeLessThan(50);
      done();
    });
  
    it("should show the buttons on the navbar", async (done) => {
      expect(await getContinueShoppingButtonText()).toBe("Continue Shopping");
      expect(await getNextButtonText()).toBe("Next");
      done();
    });
  
    it("should show the progressive indicator on the navbar", async (done) => {
      expect(await getCartProgressiveItemText()).toStrictEqual(["Cart", "Billing and Shipping", "Review and Buy"]);
      done();
    });
  
    it("should discount code button", async (done) => {
      expect(await getdiscountCodeBtnText()).toBe("Apply");
      done();
    });
   });
  
   xdescribe("Billing Page",() =>{
    it('Billing Page Sanity Check', async (done) => {
      await page.waitFor(1000);
      const result = await takeAndCompareScreenshot(page, 'cart', 'Billing');
      expect(result).toBeLessThan(50);
      done();
    });
  
    /*it("should show the buttons on the navbar", async (done) => {
      expect(await getContinueShoppingButtonText()).toBe("Continue Shopping");
      expect(await getNextButtonText()).toBe("Next");
      done();
    });
  
    it("should show the progressive indicator on the navbar", async (done) => {
      expect(await getCartProgressiveItemText()).toStrictEqual(["Cart", "Billing and Shipping", "Review and Buy"]);
      done();
    });
  
    it("should discount code button", async (done) => {
      expect(await getdiscountCodeBtnText()).toBe("Apply");
      done();
    });*/
   });
});

