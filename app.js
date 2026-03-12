import express from "express"
import bodyParser from "body-parser"
import cookieParser from "cookie-parser"
import errorHandler from "./middlewares/errorHandler.middleware.js"
import userRouter from "./routes/user.route.js"

const app = express()

app.use(bodyParser.json())
app.use(cookieParser())
app.use("/api/auth/",userRouter)
app.use(errorHandler)
export default app
