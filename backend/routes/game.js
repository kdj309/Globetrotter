const {Router}=require("express");
const { createGame } = require("../controllers/game");
const { verifyAnswer } = require("../controllers/destinations");
const gamerouter=Router();
gamerouter.post("/start",createGame);
gamerouter.post("/:gameId/answer",verifyAnswer)
module.exports=gamerouter