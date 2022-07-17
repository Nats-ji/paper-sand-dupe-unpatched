// output results
const fs = require("fs");
const crypto = require("crypto");

function file_checksum(aHashName, aPath) {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash(aHashName);
    const stream = fs.createReadStream(aPath);
    stream.on("error", (err) => reject(err));
    stream.on("data", (chunk) => hash.update(chunk));
    stream.on("end", () => resolve(hash.digest("hex")));
  });
}

async function get_checksums(aPath) {
  let md5 = await file_checksum("md5", aPath);
  let sha1 = await file_checksum("sha1", aPath);
  console.log(`Checksum for "${aPath}":\nMD5\t${md5}\nSHA1\t${sha1}`)
  return `### Checksum\n| File | ${aPath} |\n| - | :- |\n| MD5 | ${md5} |\n| SHA1 | ${sha1} |`;
}

async function write_output(aUpdate, aInfo) {
  let data = { Update: aUpdate };

  if (aUpdate && aInfo.paper_release) {
    data.Version = aInfo.paper_release;
    data.PreRelease = aInfo.pre_release;
    data.FileName = `paper-sand-dupe-unpatched-${aInfo.latest_version}-${aInfo.latest_build}.jar`;
    data.Title = `${aInfo.latest_version}-${aInfo.latest_build}`;
    let checksum = await get_checksums(data.FileName);
    const download_count = `[![downloads](https://img.shields.io/github/downloads/${process.env.GH_REPO}/${aInfo.paper_release}/total?label=downloads&style=flat-square)](https://github.com/${process.env.GH_REPO}/releases/download/${data.Version}/${data.FileName})`
    data.Body = `## PaperMC Sand Duplication Unpatched ${aInfo.latest_version}-${aInfo.latest_build}\n${download_count}\n### Upstream release message\n${aInfo.commit_msg}\n${checksum}`;
  }

  const json = JSON.stringify(data);

  fs.writeFileSync("output.json", json);
  console.log("Result wrote to output.json.");
}

module.exports = { write_output };
