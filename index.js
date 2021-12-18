const { execSync } = require("child_process");
const https = require("https");
const fs = require("fs");

//Read env variables
const env = process.env;
const gh_repo = env.GH_REPO;
console.log("gh_repo: " + gh_repo)

function executeCmd(aCmd, aOpt, aMsg) {
  if (arguments.length === 2 && typeof arguments[1] === "string")
    console.log(arguments[1]);
  if (arguments.length === 3) console.log(aMsg);
  let opt = {};
  if (typeof aOpt === "object") opt = aOpt;
  console.log(`> ${aCmd}`);
  try {
    execSync(aCmd, aOpt);
  } catch (err) {
    console.error(err.stdout);
    process.exit(1);
  }
}

function clone_papermc() {
  executeCmd(
    "git clone --recurse-submodules https://github.com/PaperMC/Paper.git",
    "Clone PaperMC:"
  );
}

function checkout_commit(aCommit) {
  executeCmd(
    `git checkout ${aCommit}`,
    { cwd: "./Paper" },
    `Check out Commit ${aCommit}:`
  );
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
  executeCmd("ls -l", "List files:");
}

function write_output(aUpdate, aVersion, aBuild) {
  let data = { Update: aUpdate };
  if (aVersion && aBuild) {
    (data.Version = `${aVersion}-${aBuild}`),
      (data.FileName = `paper-sand-dupe-unpatched-${aVersion}-${aBuild}.jar`);
  }
  const json = JSON.stringify(data);
  fs.writeFileSync("output.json", json);
}

function build_unpatched_paper(aCommit, aVersion, aBuild) {
  clone_papermc();
  checkout_commit(aCommit);
  remove_sand_patch();
  build_jar();
  rename_jar(aVersion, aBuild);
  write_output(true, aVersion, aBuild);
}

function check_released_version(aPaperVersion) {
  const release_api = {
    hostname: "api.github.com",
    path: `/repos/${gh_repo}/releases`,
    headers: { "User-Agent": gh_repo },
  };

  https
    .get(release_api, (res) => {
      let body = "";

      res.on("data", (chunk) => {
        body += chunk;
      });

      res.on("end", () => {
        try {
          console.log("body", body)
          let json = JSON.parse(body);
          // if (json[0].hasOwnProperty("tag_name")) return json[0].tag_name == aPaperVersion;
          // else return false;
          console.log("json", json)
          return false
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
          const last_release_id = `${aVersion}-${last_build}`;
          if (check_released_version(last_release_id)) {
            write_output(false);
            console.log("Already latest version.");
          }
          get_commit(aVersion, last_build, build_unpatched_paper);
          console.log;
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
