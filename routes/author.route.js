import { Router } from "express";
import { createAuthor, getAuthors } from "../controllers/auth.controller.js";
import { validator } from "../middlewares/validator.middleware.js";
import { authorSchema } from "../schemas/author.shema.js";

const authorRouter = new Router();
authorRouter.post("/", validator(authorSchema), createAuthor);
authorRouter.get("/", getAuthors);
export default authorRouter;
