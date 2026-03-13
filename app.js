import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import errorHandler from "./middlewares/errorHandler.middleware.js";
import userRouter from "./routes/user.route.js";
import authorRouter from "./routes/author.route.js";
import postRouter from "./routes/post.route.js";

const app = express();

app.use(bodyParser.json());
app.use(cookieParser());
app.use("/api/auth", userRouter);
app.use("/api/stats", userRouter);
app.use("/api/author", authorRouter);
app.use("/api/post", postRouter);
app.use(errorHandler);
export default app;
