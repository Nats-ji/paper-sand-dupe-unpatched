const exec = require("shelljs.exec");

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

function executeCmdS(aCmd, aOpt) {
  let opt = { silent: true };
  if (typeof aOpt === "object") Object.assign(opt, aOpt);
  let cmdObj = exec(aCmd, opt);
  if (cmdObj.error) {
    console.error(cmdObj.stdout);
  }
  return cmdObj.stdout;
}

module.exports = { executeCmd, executeCmdS };
