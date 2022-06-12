// output results
const fs = require("fs");

function write_output(aUpdate, aInfo) {
  let data = { Update: aUpdate };

  if (aUpdate && aInfo.paper_release) {
    data.Version = aInfo.paper_release;
    data.PreRelease = aInfo.pre_release;
    data.FileName = `paper-sand-dupe-unpatched-${aInfo.latest_version}-${aInfo.latest_build}.jar`;
    data.Title = `PaperMC Sand Duplication Glitch Unpatched ${aInfo.latest_version}-${aInfo.latest_build}`;
    data.Body = `## Upstream release message\n${aInfo.commit_msg}`;
  }

  const json = JSON.stringify(data);

  fs.writeFileSync("output.json", json);
  console.log("Result wrote to output.json.");
}

module.exports = { write_output };
