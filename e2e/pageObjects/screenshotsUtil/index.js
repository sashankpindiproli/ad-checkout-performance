const fs = require('fs');
const PNG = require('pngjs').PNG;
const pixelmatch = require('pixelmatch');
const testDir ='images/screenshot';
const goldenDir ='images/screenshot-golden';
const diffDir ='images/screenshot-diff';
const perfDir ='perf';
const traceDir ='images/trace';

export const takeAndCompareScreenshot = async (page, route, filePrefix) => {
  const currentDate = new Date().toISOString().slice(0, 10);
  // If you didn't specify a file, use the name of the route.
  let fileName = filePrefix + '__' + (route ? route : 'index');
  if (!fs.existsSync(perfDir)) fs.mkdirSync(perfDir,{ recursive: true });
  if (!fs.existsSync(`${traceDir}/${currentDate}`)) fs.mkdirSync(`${traceDir}/${currentDate}`,{ recursive: true });
  // Start the browser, go to that page, and take a screenshot.
  await page.screenshot({path: `${testDir}/${currentDate}/${fileName}.png`, fullPage: true});

  // Test to see if it's right.
  return compareScreenshots(fileName, currentDate);
}

export const compareScreenshots = (fileName, currentDate, testDir = 'images/screenshot', goldenDir = 'images/screenshot-golden', diffDir = 'images/screenshot-diff') =>{
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(`${testDir}/${currentDate}`)) fs.mkdirSync(`${testDir}/${currentDate}`,{ recursive: true });
    if (!fs.existsSync(goldenDir)) fs.mkdirSync(goldenDir,{ recursive: true });
    if (!fs.existsSync(`${diffDir}/${currentDate}`)) fs.mkdirSync(`${diffDir}/${currentDate}`,{ recursive: true });
    const img1 = fs.createReadStream(`${testDir}/${currentDate}/${fileName}.png`).pipe(new PNG()).on('parsed', doneReading);
    const img2 = fs.createReadStream(`${goldenDir}/${fileName}.png`).pipe(new PNG()).on('parsed', doneReading);

    let filesRead = 0;
    function doneReading() {
      // Wait until both files are read.
      if (++filesRead < 2) return;

      // Do the visual diff.
      const diff = new PNG({width: img1.width, height: img2.height});
      const numDiffPixels = pixelmatch(
          img1.data, img2.data, diff.data, img1.width, img1.height,
          {threshold: 0.1});
      fs.writeFileSync(`${diffDir}/${currentDate}/${fileName}.png`, PNG.sync.write(diff));

      // The files should look the same.
      return resolve(numDiffPixels);
    }
  });
}

export const  scrollIntoViewIfOutOfView = async (xpath) => {
  await page.evaluate(async (xpath) => {
    const el =  document.querySelector(xpath);
    var topOfPage = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
    var heightOfPage = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    var elY = 0;
    var elH = 0;
    if (document.layers) { // NS4
        elY = el.y;
        elH = el.height;
    }
    else {
        for(var p=el; p&&p.tagName!='BODY'; p=p.offsetParent){
            elY += p.offsetTop;
        }
        elH = el.offsetHeight;
    }
    if ((topOfPage + heightOfPage) < (elY + elH)) {
        el.scrollIntoView(false);
    }
    else if (elY < topOfPage) {
        el.scrollIntoView(true);
    }
  }, xpath);
}
