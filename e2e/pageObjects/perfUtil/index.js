const fs = require('fs');

export const traceScreenshots = (folderName,date) => {

  const traceSubDir = `images/trace/${date}/${folderName}`;
  const currentDate = new Date().toISOString().slice(0, 10);
  if (!fs.existsSync(traceSubDir)) fs.mkdirSync(traceSubDir,{recursive: true});
  
  const tracing = JSON.parse(fs.readFileSync(`perf/profile.json`, 'utf8'));

  const traceScreenshots = tracing.traceEvents.filter(x => (
    x.cat === 'disabled-by-default-devtools.screenshot' &&
    x.name === 'Screenshot' &&
    typeof x.args !== 'undefined' &&
    typeof x.args.snapshot !== 'undefined'
  ));

  traceScreenshots.forEach((snap, index) => {
    fs.writeFile(`${traceSubDir}/trace-screenshot-${index}.png`, snap.args.snapshot, 'base64', (err) => {
      if (err) {
        console.log('writeFile error', err);
      }
    });
  });
}