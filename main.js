const { get_info } = require("./src/get_info");
const { setVersion } = require("./src/version")
const { build } = require("./src/build");
const { write_output } = require("./src/write_output");
const fs = require("fs");

async function main() {
  //Read env variables
  const env = process.env;
  if (typeof env.GH_REPO == "undefined") {
    console.error(
      '"GH_REPO" not found in the environment variables, you need to set it first. For example: "Codertocat/Hello-World"'
    );
    process.exit(1);
  }
  const test = env.TEST === "true";

  //Try load config
  const config = {}
  try {
    const config_path = "./config.json"
    if(fs.existsSync(config_path)) {
      const json = fs.readFileSync(config_path, { encoding: "utf-8" })
      let config_parsed = JSON.parse(json)
      config.VERSION = config_parsed.version
      config.BUILD = config_parsed.build
      console.log(`Found config.json, using version: ${config.VERSION || "latest" } build: ${config.BUILD || "latest"}`)
    } else
      console.log("No config.json found, using the latest version and build.")
  } catch (e) {
    console.error(e)
  }

  //Get info
  let info = await get_info(env.GH_REPO, config.VERSION, config.BUILD);
  console.log(
    `Target Paper Version is: ${info.paper_release}, on commit: ${info.latest_commit}.\nRelease exists: ${info.release_exists}`
  );

  if (test || !info.release_exists) {
    setVersion(info.latest_version)
    build(info.latest_commit, info.latest_version, info.latest_build);
    write_output(true, info);
  } else {
    console.log("Already at the latest build.");
    write_output(false);
  }
}

main();
