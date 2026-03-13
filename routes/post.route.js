import { Router } from "express";
import {
  refreshTokenValidator,
  validator,
} from "../middlewares/validator.middleware.js";
import getAuthor from "../middlewares/getauthor.middleware.js";
import { createPostschema } from "../schemas/post.schema.js";
import { allPosts, createPost, postsbyId } from "../controllers/post.controller.js";

const postRouter = new Router();
postRouter.post(
  "/",
  refreshTokenValidator,
  getAuthor,
  validator(createPostschema),
  createPost,
);
postRouter.get("/", allPosts);
postRouter.get("/:id", postsbyId);
export default postRouter;
