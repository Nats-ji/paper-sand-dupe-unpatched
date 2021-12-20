const { get_info } = require("./js/get_info");
const { build } = require("./js/build");
const { write_output } = require("./js/write_output");

async function main() {
  //Read env variables
  const env = process.env;
  if (typeof process.env.GH_REPO == "undefined") {
    console.error(
      '"GH_REPO" not found in the environment variables, you need to set it first. For example: "Codertocat/Hello-World"'
    );
    process.exit(1);
  }
  const gh_repo = env.GH_REPO;
  const test = env.TEST === "true";

  //Get info
  let info = await get_info(gh_repo);
  console.log(
    `Latest Paper Version is: ${info.paper_release}, on commit: ${info.latest_commit}.\nLatest unpatch Version is: ${info.released_version}.`
  );

  if (test || info.released_version != info.paper_release) {
    build(info.latest_commit, info.latest_version, info.latest_build);
    write_output(true, info);
  } else {
    console.log("Already at the latest build.");
    write_output(false);
  }
}

main();
