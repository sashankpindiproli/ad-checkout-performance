import { load } from "../pageObjects";
import { traceScreenshots } from '../pageObjects/perfUtil'

describe("Performance measurement", () => {
  it('Home page load', async (done) => {
    const currentDate = new Date().toISOString().slice(0, 10);
    await page.tracing.start({ path: `perf/profile.json`, screenshots: true });
    await load();
    await page.tracing.stop();
    await traceScreenshots('home',currentDate);
    done();
  });
});
