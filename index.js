const { sendError, send, createError, json } = require("micro");
const { exec } = require("child_process");
const cors = require("micro-cors")();

const runCmd = async (serverType, hosts) => {
  return new Promise((resolve, reject) => {
    const cmd = `./qstat  -u -default ${serverType} -f ${hosts
      // .map((host) => `${serverType} ${host}`)
      .join(" ")}`;
    console.log("cmd!!!!!!!!!!!!!!!!!", cmd);
    exec(cmd, (err, stdout, stderr) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(stdout);
    });
  });
};

const formatResponse = (response) => {
  const serversRaw = response
    .slice(response.indexOf("\n") + 1) // skip first line
    .split("\n")
    .filter((elm) => elm !== "");
  return serversRaw.map((serverRaw) => {
    const [host, playerNumbers, botNumbers, map, responseTime, name] = serverRaw
      .split("  ")
      .filter((elm) => elm !== "")
      .map((elm) => elm.trim());

    const [players, maxPlayers] = playerNumbers.split("/");
    const [bots, maxBots] = botNumbers.split("/");

    const formattedResponse = {
      host,
      players,
      maxPlayers,
      bots,
      maxBots,
      map,
      responseTime,
      name
    };
    return formattedResponse;
  });
};

module.exports = cors(async (req, res) => {
  try {
    if (req.method === "GET") {
      const { type, hosts } = await json(req);
      const response = await runCmd(type, hosts);
      console.log("response", response);
      return send(res, 200, formatResponse(response));
    }
    throw createError(400, "invalid format");
  } catch (e) {
    sendError(req, res, e);
  }
});
