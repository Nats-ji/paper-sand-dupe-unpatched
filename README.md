# PaperMC Sand Duplication Glitch Unpatched

## What is this?

This is a node.js application that runs periodically on the Github Action runner.

It will fetch the latest version of [PaperMC](https://github.com/PaperMC/Paper),
and remove the [sand duplication glitch patch](https://github.com/PaperMC/Paper/blob/master/patches/server/0445-Fix-sand-duping.patch), so you could have a vallina server experience.

The runner will run every day to check if there's a new build of PaperMC. And it will rebuild the jar once the sand duping patch has been removed and make a new [release](https://github.com/Nats-ji/paper-sand-dupe-unpatched/releases) on this repository.

## How does it run?

1. The node.js app need a `GH_REPO` environment variables (e.g. `Codertocat/Hello-World`) to get the latest release version of the unpatched PaperMC.<br>
  You can use the `{{ $github.repository }}` variable in github workflow to retrieve it.
  
2. Then it will check the latest release version of the unpatched PaperMC against the office PaperMC release version.<br>

3. If there's a new version, it will fetch the source code from PaperMC's repo, remove the patch and build the jar. The built jar will be put in the project's root directory and renamed to `paper-sand-dupe-unpatched-${mc_version}-${build_number}.jar`<br>
  Then it will write the result to an `output.json` file in the project's root directory.
  ```json
  {
    "Update": true,
    "Version": "${mc_version}-${build_number}",
    "FileName": "paper-sand-dupe-unpatched-${mc_version}-${build_number}",
    "Body": "The app will fetch the upstream release msg and put it here.",
    "Title": "PaperMC Sand Duplication Glitch Unpatched ${mc_version}-${build_number}"
  }
  ```

4. If there's a no new version, it will write to `output.json`:
  ```json
  { "Update": false }
  ```
  
5. Then the github workflow can read the `output.json` to decide whether to make a new release.

## License
This node.js app and the released jars are all licensed under GLPv3.
