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

async function get_version()
{
    let json = await get_json("https://papermc.io/api/v2/projects/paper/")
    return json.versions[json.versions.length - 1]
}

async function get_build(aVersion)
{
    let json = await get_json(`https://papermc.io/api/v2/projects/paper/versions/${aVersion}/`)
    return json.builds[json.builds.length - 1]
}

async function get_commit(aVersion, aBuild)
{
    let json = await get_json(`https://papermc.io/api/v2/projects/paper/versions/${aVersion}/builds/${aBuild}/`)
    return json.changes[0].commit;
}

async function get_commit_msg(aVersion, aBuild)
{
    let json = await get_json(`https://papermc.io/api/v2/projects/paper/versions/${aVersion}/builds/${aBuild}/`)
    return json.changes[0].message;
}

async function get_released_version(aGhRepo)
{
    const gh_release_api = {
        hostname: "api.github.com",
        path: `/repos/${aGhRepo}/releases`,
        headers: { "User-Agent": aGhRepo },
      };
    let json = await get_json(gh_release_api);
    if (typeof json[0] === "object")
      return json[0].tag_name
    else
      return ""
}

async function get_info(aGhRepo)
{
    let info = {}
    info.latest_version = await get_version()
    info.latest_build = await get_build(info.latest_version)
    info.latest_commit = await get_commit(info.latest_version, info.latest_build)
    info.commit_msg = await get_commit_msg(info.latest_version, info.latest_build)
    info.released_version = await get_released_version(aGhRepo)
    info.paper_release = `${info.latest_version}-${info.latest_build}`
    return info
}

module.exports = { get_info }