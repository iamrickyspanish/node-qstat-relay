const { sendError, send, createError, json } = require("micro");
const { exec } = require("child_process");

const runCmd = async (serverType, host) => {
  return new Promise((resolve, reject) => {
    const cmd = `./qstat -${serverType} ${host}`;
    exec(cmd, (err, stdout, stderr) => {
      if (err) {
        reject(err);
        return;
      }
      console.log(stdout, stderr);
      resolve(stdout);
    });
  });
};

module.exports = async (req, res) => {
  try {
    if (req.method === "GET") {
      const { game, host } = await json(req);
      response = await runCmd(game, host);
      return send(res, 200, `${response}`);
    }
    throw createError(400, "invalid format");
  } catch (e) {
    sendError(req, res, e);
  }
};
