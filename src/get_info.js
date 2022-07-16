const https = require("https")

function get_json(aUrl)
{
    return new Promise((resolve, reject) => {
        https.get(aUrl, (res) => {
            let body = "";
            res.on("data", (chunk) => {
                body += chunk;
            });

            res.on("end", () => {
                try {
                    let json = JSON.parse(body);
                    resolve(json);
                } catch (error) {
                    reject(error);
                }
            })
        })
    })
}

function get_statusCode(aUrl)
{
    return new Promise((resolve, reject) => {
        https.get(aUrl, (res) => {
            resolve(res.statusCode)
        })
    })
}

async function get_version()
{
    let json = await get_json("https://papermc.io/api/v2/projects/paper/")
    return json.versions[json.versions.length - 1]
}

async function get_version_prev()
{
    let json = await get_json("https://papermc.io/api/v2/projects/paper/")
    return json.versions[json.versions.length - 2]
}

async function get_latest_build_number(aVersion)
{
    let json = await get_json(`https://papermc.io/api/v2/projects/paper/versions/${aVersion}/`)
    // in case builds are empty return -1
    if (json.builds.length === 0)
        return -1

    return json.builds[json.builds.length - 1]
}

async function get_build(aVersion, aBuild_Num)
{
    let json = await get_json(`https://papermc.io/api/v2/projects/paper/versions/${aVersion}/builds/${aBuild_Num}/`)
    return json
}

async function get_commit(aBuild)
{
    if (aBuild.changes.length > 0)
        return aBuild.changes[0].commit
    else
    {
        let pre_build = aBuild.build - 1
        let version = aBuild.version
        let json = await get_json(`https://papermc.io/api/v2/projects/paper/versions/${version}/builds/${pre_build}/`)
        return get_commit(json)
    }
}

function get_commit_msg(aBuild)
{
    let commit_msg = ""
    if (aBuild.changes.length > 0)
    {
        function format_commit_msg(aMsg)
        {
            const regex = /#\d+/g;
            return aMsg.replace(regex, "PaperMC/Paper$&");
        }

        for (const change of aBuild.changes) {
            commit_msg += `> [PaperMC/Paper@${change.commit}] ${format_commit_msg(change.summary)}\n`
        }
    }
    else
        commit_msg = "No Changes"
    return commit_msg
}

async function release_exists(aGhRepo, aTag)
{
    const gh_release_api = {
        hostname: "api.github.com",
        path: `/repos/${aGhRepo}/releases/tags/${aTag}`,
        headers: { "User-Agent": aGhRepo },
      };
    let status_code = await get_statusCode(gh_release_api);
    return status_code == 200 ? true : false
}

async function get_info(aGhRepo, aVersion=null, aBuild=null)
{
    let info = {}
    info.latest_version = aVersion || await get_version()
    info.latest_build = aBuild || await get_latest_build_number(info.latest_version)
    
    // check if builds are empty, then use prev version.
    if (info.latest_build === -1)
    {
        info.latest_version = await get_version_prev()
        info.latest_build = await get_latest_build_number(info.latest_version)
    }
    let build = await get_build(info.latest_version, info.latest_build)
    info.pre_release = build.channel == "experimental"
    info.latest_commit = await get_commit(build)
    info.commit_msg = get_commit_msg(build)
    info.paper_release = convert_gh_version(info.latest_version, info.latest_build)
    info.release_exists = await release_exists(aGhRepo, info.paper_release)
    return info
}

// Add zeros so the releases will be ordered correctly on github
function convert_gh_version(aVersion, aBuild)
{
    // add trailing 0 to version
    const version = aVersion.split(".")
    if (version.length == 2) {
        version.push(0)
    }
    // add leading 0 to build
    let build = aBuild.toString()
    while (build.length < 3) {
        build = "0" + build
    }
    return `${version.join(".")}-${build}`
}

module.exports = { get_info }