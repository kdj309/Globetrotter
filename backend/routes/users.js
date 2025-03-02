const {Router}=require("express");
const { createUser, getUserInfo, updateUser, generateChallenge } = require("../controllers/users");
const userrouter=Router();
userrouter.post("/",createUser)
userrouter.get("/:username",getUserInfo)
userrouter.put("/:username/score",updateUser)
userrouter.get("/:username/challenge",generateChallenge)
module.exports=userrouter