const exec = require("shelljs.exec");
const https = require("https");
const fs = require("fs");

//Read env variables
const env = process.env;
const gh_repo = env.GH_REPO;
const test = env.TEST === "true";

function executeCmd(aCmd, aOpt, aMsg) {
  if (arguments.length === 2 && typeof arguments[1] === "string")
    console.log(arguments[1]);
  if (arguments.length === 3) console.log(aMsg);
  let opt = { silent: true };
  if (typeof aOpt === "object") Object.assign(opt, aOpt);
  console.log(`> ${aCmd}`);
  let cmdObj = exec(aCmd, opt);
  if (cmdObj.error) {
    console.error(cmdObj.stderr);
    process.exit(cmdObj.code);
  }
  console.log(cmdObj.stdout);
}

function clone_papermc() {
  executeCmd("git submodule update --remote --merge", "Update submodules");
  executeCmd("git submodule update --recursive", {
    cwd: "./Paper",
  });
}

function checkout_commit(aCommit) {
  executeCmd(
    `git checkout ${aCommit}`,
    { cwd: "./Paper" },
    `Check out Commit ${aCommit}:`
  );
}

function get_commit_msg(aCommit) {
  let cmdObj = exec(`git log --format=%B -n 1 ${aCommit}`, {
    cwd: "./Paper",
    silent: true,
  });
  return cmdObj.stdout;
}

function build_jar() {
  executeCmd('git config --global user.email "no-reply@github.com"', {
    cwd: "./Paper",
  });
  executeCmd('git config --global user.name "Github Actions"', {
    cwd: "./Paper",
  });
  executeCmd("./gradlew applyPatches --stacktrace", { cwd: "./Paper" });
  executeCmd("./gradlew createReobfPaperclipJar --stacktrace", {
    cwd: "./Paper",
  });
}

function rename_jar(aVersion, aBuild) {
  const jar_path = "./Paper/build/libs/";
  const old_file_name =
    jar_path +
    fs
      .readdirSync(jar_path)
      .filter((fn) => fn.startsWith("paper-paperclip"))[0];
  const new_file_name = `paper-sand-dupe-unpatched-${aVersion}-${aBuild}.jar`;
  try {
    fs.renameSync(old_file_name, new_file_name);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Renamed jar to ${new_file_name}`);
}

function remove_sand_patch() {
  const patch_path = "./Paper/patches/server/0445-Fix-sand-duping.patch";
  try {
    fs.unlinkSync(patch_path);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
  console.log("Patch 0445-Fix-sand-duping.patch removed.");
}

function remove_falling_block_patch()
{
  const patch_path = "./Paper/work/CraftBukkit/nms-patches/net/minecraft/world/entity/item/EntityFallingBlock.patch"
  try {
    fs.unlinkSync(patch_path);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
  console.log("Patch EntityFallingBlock removed.");
}

function write_output(aUpdate, aVersion, aBuild, aReleaseInfo) {
  let data = { Update: aUpdate };
  if (aVersion && aBuild) {
    (data.Version = `${aVersion}-${aBuild}`),
      (data.FileName = `paper-sand-dupe-unpatched-${aVersion}-${aBuild}.jar`);
  }
  if (typeof aReleaseInfo === "object") Object.assign(data, aReleaseInfo);
  const json = JSON.stringify(data);
  fs.writeFileSync("output.json", json);
}

function build_unpatched_paper(aCommit, aVersion, aBuild) {
  clone_papermc();
  checkout_commit(aCommit);
  remove_sand_patch();
  remove_falling_block_patch();
  build_jar();
  rename_jar(aVersion, aBuild);
  write_output(true, aVersion, aBuild, {
    Body: "##Upstream release message\n" + get_commit_msg(aCommit),
    Title: `PaperMC Sand Duplication Glitch Unpatched ${aVersion}-${aBuild}`,
  });
}

function check_released_version(aVersion, aLastBuildNo) {
  const release_api = {
    hostname: "api.github.com",
    path: `/repos/${gh_repo}/releases`,
    headers: { "User-Agent": gh_repo },
  };
  const paperVersion = `${aVersion}-${aLastBuildNo}`;
  https
    .get(release_api, (res) => {
      let body = "";

      res.on("data", (chunk) => {
        body += chunk;
      });

      res.on("end", () => {
        try {
          let json = JSON.parse(body);
          if (
            !test &&
            typeof json[0] === "object" &&
            json[0].tag_name == paperVersion
          ) {
            write_output(false);
            console.log("Already latest version.");
          } else {
            get_commit(aVersion, aLastBuildNo, build_unpatched_paper);
          }
        } catch (error) {
          console.error(error.message);
          process.exit(1);
        }
      });
    })
    .on("error", (error) => {
      console.error(error.message);
      process.exit(1);
    });
}

function get_commit(aVersion, aBuild, cb) {
  const build_url = `https://papermc.io/api/v2/projects/paper/versions/${aVersion}/builds/${aBuild}/`;

  https
    .get(build_url, (res) => {
      let body = "";

      res.on("data", (chunk) => {
        body += chunk;
      });

      res.on("end", () => {
        try {
          let json = JSON.parse(body);
          const commit = json.changes[0].commit;
          cb(commit, aVersion, aBuild);
        } catch (error) {
          console.error(error.message);
          process.exit(1);
        }
      });
    })
    .on("error", (error) => {
      console.error(error.message);
      process.exit(1);
    });
}

function get_builds(aVersion) {
  const builds_url = `https://papermc.io/api/v2/projects/paper/versions/${aVersion}/`;
  https
    .get(builds_url, (res) => {
      let body = "";

      res.on("data", (chunk) => {
        body += chunk;
      });

      res.on("end", () => {
        try {
          let json = JSON.parse(body);
          const last_build = json.builds[json.builds.length - 1];
          check_released_version(aVersion, last_build);
        } catch (error) {
          console.error(error.message);
          process.exit(1);
        }
      });
    })
    .on("error", (error) => {
      console.error(error.message);
      process.exit(1);
    });
}

function get_versions() {
  const versions_url = "https://papermc.io/api/v2/projects/paper/";

  https
    .get(versions_url, (res) => {
      let body = "";

      res.on("data", (chunk) => {
        body += chunk;
      });

      res.on("end", () => {
        try {
          let json = JSON.parse(body);
          get_builds(json.versions[json.versions.length - 1]);
        } catch (error) {
          console.error(error.message);
          process.exit(1);
        }
      });
    })
    .on("error", (error) => {
      console.error(error.message);
      process.exit(1);
    });
}

get_versions();
