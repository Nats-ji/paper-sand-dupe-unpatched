const { getVersion } = require("./version")
const fs = require("fs")

function edit(aFile, aEdits) {
  let content = fs.readFileSync(`./Paper/Paper-Server/${aFile}`, {
    encoding: "utf-8",
  });
  for (let i = 0; i < aEdits.length; i++) {
    content = content.replace(aEdits[i].from, aEdits[i].to);
  }
  fs.writeFileSync(`./Paper/Paper-Server/${aFile}`, content);
}

function patch() {
  const patches = getVersion().patches;
  for (let i = 0; i < patches.length; i++) {
    const patch = patches[i];
    console.log("Patching:", patch.patch_name);
    const files = patch.files;
    for (let j = 0; j < files.length; j++) {
      const file = files[j];
      console.log("\t> file:", file.file_name);
      edit(file.file_name, file.edits);
    }
  }
}

module.exports = { patch };
