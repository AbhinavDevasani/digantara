import mongoose from "mongoose";
import dotenv from 'dotenv'
import bodyParser from "body-parser";
import express from 'express'
import router from "./routes/jobRouter.js";
import redis from "./redis.js";
const app=express()
dotenv.config()
app.use(bodyParser.json())
app.use("/api",router)
app.get("/hits", async (req, res) => {
  const count = await redis.incr("hits");
  res.json({ total_hits: count });
});
const port=process.env.PORT
const uri=process.env.MONGO_URI
mongoose.connect(uri)
.then(()=>{
    console.log("Server connected to DB")
})
.catch(()=>{
    console.log("DB did not connected")
})
app.listen(port,()=>{
    console.log(`Server connected at port ${port}`)
})