const fs = require("fs")

const version = {}

function get_build_settings(aVersion) {
  const json = fs.readFileSync("./patches/build.json", { encoding: "utf-8" });
  let build_settings = JSON.parse(json);
  for (const build_setting of build_settings) {
    if (build_setting.versions.includes(aVersion)) {
      return build_setting.settings
    }
  }
  for (const build_setting of build_settings) {
    if (build_setting.versions.includes("latest")) {
      return build_setting.settings
    }
  }
}

function get_patch_settings(aVersion) {
  const json = fs.readFileSync("./patches/patches.json", { encoding: "utf-8" });
  let patch_settings = JSON.parse(json);
  for (const patch_setting of patch_settings) {
    if (patch_setting.versions.includes(aVersion)) {
      return patch_setting.patches
    }
  }
  for (const patch_setting of patch_settings) {
    if (patch_setting.versions.includes("latest")) {
      return patch_setting.patches
    }
  }
}

function setVersion(aVersion) {
  version.settings = get_build_settings(aVersion)
  version.patches = get_patch_settings(aVersion)
}

function getVersion() {
  return version
}

module.exports = { setVersion, getVersion }