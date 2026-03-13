import postsModele from "../models/posts.modele.js";
import MyError from "../utils/customError.js";
import myResponse from "../utils/customResponse.js";

const createPost = async (req, res, next) => {
  try {
    const newPost = postsModele.create({
      author_id: req.author._id,
      ...req.body,
    });
    return myResponse(res, 200, "Post successfully created", newPost);
  } catch (error) {
    next(error);
  }
};
const allPosts = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    if (
      !page ||
      !limit ||
      !Number.isInteger(limit) ||
      !Number.isInteger(limit)
    ) {
      page = {};
      limit = {};
    }

    page = {
      $skip: skip,
    };
    limit = {
      $limit: limit,
    };
    const all_posts = await postsModele.aggregate([
      {
        $lookup: {
          from: "author",
          localField: "author_id",
          foreignField: "_id",
          as: "author",
        },
      },
      {
        $lookup: {
          from: "user",
          localField: "author.user_id",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $project: {
          "author.user.password": 0,
          "author.user.refreshToken": 0,
        },
      },
      { $sort: { updatedAt: -1 } },
      skip,
      limit,
    ]);
    return myResponse(res, 200, "all posts", all_posts);
  } catch (error) {
    next(error);
  }
};
const postsbyId = async (req, res, next) => {
  try {
    const all_posts = await postsModele.findById(req.params.id);
    if (!all_posts) throw new MyError(404, "Not found");
    return myResponse(res, 200, "all posts", all_posts);
  } catch (error) {
    next(error);
  }
};
export { createPost, allPosts, postsbyId };
