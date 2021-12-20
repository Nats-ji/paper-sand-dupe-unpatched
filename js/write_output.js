// output results
const fs = require("fs");

function write_output(aUpdate, aVersion, aBuild) {
  let data = { Update: aUpdate };

  if (aUpdate && aVersion && aBuild) {
    data.Version = `${aVersion}-${aBuild}`;
    data.FileName = `paper-sand-dupe-unpatched-${aVersion}-${aBuild}.jar`;
  }

  const json = JSON.stringify(data);

  fs.writeFileSync("output.json", json);
  console.log("Result wrote to output.json.");
}

module.exports = { write_output };
