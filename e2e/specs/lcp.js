import { load } from "../pageObjects";
import { lighthouseFromPuppeteer } from '../pageObjects/perfUtil/lighthouse'

xdescribe('LCP Measurement',() => {
  beforeAll(async () => {
    await load();
  });

  it('Home page LCP localhost',async (done)=> {
    await lighthouseFromPuppeteer('http://localhost:3000/checkout/cart');
    done();
  });
});
