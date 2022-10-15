const express = require("express");
const app = express();
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const dbPath = path.join(__dirname, "cricketTeam.db");
app.use(express.json());
let db = null;
let intialaizeDbAndServer = async () => {
  try {
    db = await open({ filename: dbPath, driver: sqlite3.Database });
    app.listen(3000);
  } catch (e) {
    console.log(`the server has ${e.message}`);
    process.exit(1);
  }
};
intialaizeDbAndServer();

let conversion = (obj) => {
  return {
    playerId: obj.player_id,
    playerName: obj.player_name,
    jerseyNumber: obj.jersey_number,
    role: obj.role,
  };
};

app.get("/players/", async (request, response) => {
  const sqlQuery = `SELECT * FROM cricket_team;`;
  const data = await db.all(sqlQuery);
  let result = [];
  for (let obj of data) {
    let newdata = conversion(obj);
    result.push(newdata);
  }
  response.send(result);
});
app.post("/players/", async (request, response) => {
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  const sqlQuery = `INSERT INTO cricket_team(player_name,jersey_number,role)values('${playerName}',${jerseyNumber},'${role}')`;
  const data = await db.run(sqlQuery);
  response.send("Player Added to Team");
});
app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const sqlQuery = `SELECT * FROM cricket_team WHERE player_id=${playerId};`;
  const data = await db.get(sqlQuery);
  let result = {
    playerId: data.player_id,
    playerName: data.player_name,
    jerseyNumber: data.jersey_number,
    role: data.role,
  };
  response.send(result);
});
app.put("/players/:playerId", async (request, response) => {
  const { playerId } = request.params;
  const { playerName, jerseyNumber, role } = request.body;
  const sqlQuery = `UPDATE cricket_team SET player_name='${playerName}',jersey_number=${jerseyNumber},role='${role}' WHERE player_id=${playerId};`;
  await db.run(sqlQuery);
  response.send("Player Details Updated");
});
app.delete("/players/:playerId", async (request, response) => {
  const { playerId } = request.params;
  const sqlQuery = `DELETE FROM cricket_team WHERE player_id=${playerId};`;
  await db.run(sqlQuery);
  response.send("Player Removed");
});
module.exports = express;
