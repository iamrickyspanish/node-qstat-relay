const { sendError, send, createError, json } = require("micro");
const { exec } = require("child_process");
const cors = require("micro-cors")();

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

module.exports = cors(async (req, res) => {
  try {
    if (req.method === "GET") {
      const { game, host } = await json(req);

      if (!game || !host) throw "nigger";
      response = await runCmd(game, host);
      return send(res, 200, `${response}`);
    }
    throw createError(400, "invalid format");
  } catch (e) {
    sendError(req, res, e);
  }
});
