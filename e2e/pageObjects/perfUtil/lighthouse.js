const fs = require('fs');
const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
import { lighthouseOptionsArray } from './constants';


export const lighthouseFromPuppeteer = async(url) => {
  let results;
  const opts = {
    chromeFlags: ["--no-sandbox", "--headless"]
  };
  for (const optionSet of lighthouseOptionsArray) {
    console.log("****** Starting Lighthouse analysis ******");
    await launchLighthouse(url, optionSet, opts, results);
  }
  return;
}

function wait(val) {
  return new Promise(resolve => setTimeout(resolve, val));
}

async function reportResults(results, optionSet, chrome) {
  if (results.lhr.runtimeError) {
    return console.error(results.lhr.runtimeError.message);
  }
  await writeLocalFile(results, optionSet);
  return await passOrFailA11y(results.lhr, optionSet, chrome);
}

function launchLighthouse(url, optionSet, opts, results) {
  return chromeLauncher
    .launch({ chromeFlags: opts.chromeFlags })
    .then(async chrome => {
      opts.port = chrome.port;
      try {
        results = await lighthouse(url, opts, optionSet);
        if (results) reportResults(results, optionSet, chrome);
      } catch (e) {
        console.error("lighthouse", e);
      }
      
      await wait(500);
      chrome.kill();
      return;
    });
}

function createFileName(emulatedFormFactor) {
  const currentTime = new Date().toISOString().slice(0, 16);
  return `${currentTime}-${emulatedFormFactor}.html`;
}

function writeLocalFile(results, optionSet) {
  const { emulatedFormFactor } = optionSet.settings;
  if (results.report) {
    const fileName = createFileName(emulatedFormFactor);
    fs.mkdirSync('reports/performance/', { recursive: true }, error => {
      if (error) console.error('error creating directory', error);
    });
    const printResults = results.report[0];
    return fs.writeFileSync(`reports/performance/${fileName}`, printResults);
  }
  return null;
}

function passOrFailA11y(results, optionSet, chrome) {
  const targetA11yScore =  95;
  const { windowSize } = optionSet;
  const performanceScore = results.categories.performance.score * 100;
  if (performanceScore) {
    if (windowSize === 'desktop') {
      if (performanceScore < targetA11yScore) {
        console.error(`Target performance score: ${targetA11yScore}, current performance score ${performanceScore}`);
        chrome.kill();
        process.exitCode = 1;
      }
    }
    if (windowSize === 'mobile') {
      if (performanceScore < targetA11yScore) {
        console.error(`Target performance score: ${targetA11yScore}, current performance score ${performanceScore}`);
        chrome.kill();
        process.exitCode = 1;
      }
    }
  }
}