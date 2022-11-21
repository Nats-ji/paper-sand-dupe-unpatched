const fs = require("fs");
const { getVersion } = require("./version")
const { executeCmd, executeCmdS } = require("./exec");
const { patch } = require("./patch");

function rename_jar(aVersion, aBuild) {
  const jar_path = getVersion().settings.jar_path;
  const old_file_name =
    jar_path +
    fs
      .readdirSync(jar_path)
      .filter((fn) => fn.startsWith(getVersion().settings.jar_filter))[0];
  const new_file_name = `paper-sand-dupe-unpatched-${aVersion}-${aBuild}.jar`;
  fs.renameSync(old_file_name, new_file_name);
  console.log(`Renamed jar to ${new_file_name}`);
}

function build(aCommit, aVersion, aBuild, aTest) {
  // Config git email and name if not set
  console.log("Checking git config user.name and user.email.")
  if (
    executeCmdS("git config --global --get user.email") == "" ||
    executeCmdS("git config --global --get user.name") == ""
  ) {
    console.log("No name and email found in git config, setting default ones.");
    executeCmd('git config --global user.email "no-reply@github.com"', {
      cwd: "./Paper",
    });
    executeCmd('git config --global user.name "Github Actions"', {
      cwd: "./Paper",
    });
  }

  // Update submodules
  executeCmd("git submodule update --init --recursive", "Update PaperMC to latest commit");
  executeCmd("git submodule update --remote --merge");

  // Checkout commit
  executeCmd(
    `git checkout ${aCommit}`,
    { cwd: "./Paper" },
    `Checking out Commit: ${aCommit}`
  );
  
  // Commit and push submodule
  if (!aTest && (executeCmdS("git rev-parse HEAD", { cwd: "./Paper"}) !== aCommit)) {
    executeCmd("git add ./Paper")
    executeCmd('git commit -m "Update PaperMC"')
    executeCmd(`git push https://${process.env.GH_TOKEN}@github.com/${process.env.GH_REPO}.git`)

  }

  executeCmd("git submodule update --recursive", { cwd: "./Paper" });

  // Patch ./Paper/settings.gradle.kts for https://github.com/PaperMC/Paper/commit/4a3ae595357d8c6c48938d889d199b50f09221e5
  if (!(fs.existsSync("./Paper/.git") && fs.lstatSync("./Paper/.git").isDirectory()))
  {
    let content = fs.readFileSync(`./Paper/settings.gradle.kts`, {
      encoding: "utf-8",
    });
    content = content.replace('error(errorText)', '');
    fs.writeFileSync(`./Paper/settings.gradle.kts`, content);
    console.log("Patched ./Paper/settings.gradle.kts")
  }

  // Apply patches
  executeCmd("./gradlew applyPatches --stacktrace", { cwd: "./Paper" });

  // Patch files
  patch();

  // Commit changes
  executeCmd("git add .", {
    cwd: "./Paper/Paper-Server",
  });
  executeCmd('git commit -m "Unpatched Sand Duping and End Portal Logic"', {
    cwd: "./Paper/Paper-Server",
  });

  // Rebuild patches
  executeCmd("./gradlew rebuildPatches --stacktrace", {
    cwd: "./Paper",
  });

  // Compile Jar
  executeCmd(getVersion().settings.build_cmd, {
    cwd: "./Paper",
  });

  // Rename Jar
  rename_jar(aVersion, aBuild);
}

module.exports = { build };
