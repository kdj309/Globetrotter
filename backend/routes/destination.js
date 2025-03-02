const {Router}=require("express");
const { getRandomDestination, getOptions, verifyAnswer } = require("../controllers/destinations");
const destinationrouter=Router();
destinationrouter.get('/random', getRandomDestination);
  
destinationrouter.get('/:id/options', getOptions);
  
destinationrouter.get('/:id/verify/:answer',verifyAnswer );
module.exports=destinationrouter