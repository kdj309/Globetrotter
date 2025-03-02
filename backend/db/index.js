const mongoose=require("mongoose");
const loadenv=require("dotenv")
loadenv.config()
const dbInit=async ()=>{
    try {
        const db=await mongoose.connect(process.env.MONGOURI)
        console.log("DB connected")
    } catch (error) {
        console.error(error)
    }
}
module.exports=dbInit