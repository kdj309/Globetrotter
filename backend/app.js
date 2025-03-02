const express=require("express");
const cors=require("cors");
const bodyParser=require("body-parser")
const  userrouter  = require("./routes/users");
const  gamerouter  = require("./routes/game");
const  destinationrouter  = require("./routes/destination");
const dbInit  = require("./db");
const app=express();
app.use(cors())
app.use(bodyParser.json())
app.use('/api/destinations', destinationrouter);
app.use('/api/users', userrouter);
app.use('/api/games', gamerouter);
app.get("/health",(req,res)=>{
    return res.json({healthy:true})
})
app.listen(8000,async()=>{
    await dbInit();
    console.log("Server is up and running");
})