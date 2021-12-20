const fs = require("fs");
const { executeCmd, executeCmdS } = require("./exec");
const { patch } = require("./patch")

function rename_jar(aVersion, aBuild) {
  const jar_path = "./Paper/build/libs/";
  const old_file_name =
    jar_path +
    fs
      .readdirSync(jar_path)
      .filter((fn) => fn.startsWith("paper-paperclip"))[0];
  const new_file_name = `paper-sand-dupe-unpatched-${aVersion}-${aBuild}.jar`;
  fs.renameSync(old_file_name, new_file_name);
  console.log(`Renamed jar to ${new_file_name}`);
}

function build(aCommit, aVersion, aBuild) {
  // Update submodules
  executeCmd("git submodule update --remote --merge", "Updating submodules");

  // Checkout commit
  executeCmd(
    `git checkout ${aCommit}`,
    { cwd: "./Paper" },
    `Checking out Commit: ${aCommit}`
  );

  // Config git email and name if not set
  if (
    executeCmdS("git config --get user.email") == "" ||
    executeCmdS("git config --get user.name") == ""
  ) {
    console.log("No name and email found in git config, setting default ones.");
    executeCmd('git config --global user.email "no-reply@github.com"', {
      cwd: "./Paper",
    });
    executeCmd('git config --global user.name "Github Actions"', {
      cwd: "./Paper",
    });
  }

  // Apply patches
  executeCmd("./gradlew applyPatches --stacktrace", { cwd: "./Paper" });

  // Patch files
  patch()

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
  executeCmd("./gradlew createReobfPaperclipJar --stacktrace", {
    cwd: "./Paper",
  });

  // Rename Jar
  rename_jar(aVersion, aBuild);
}

module.exports = { build };
