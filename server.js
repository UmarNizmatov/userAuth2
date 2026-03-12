import app from "./app.js";
import env from "dotenv"
import dbConnect from "./config/db.js";

const PORT = 5467
env.config()
dbConnect()

app.listen(PORT,()=>{
    console.log("Server is running...")
})