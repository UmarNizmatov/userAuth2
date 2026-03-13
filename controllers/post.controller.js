import postsModele from "../models/posts.modele.js";
import MyError from "../utils/customError.js";
import myResponse from "../utils/customResponse.js";

const createPost = async (req, res, next) => {
  try {
    const newPost = await postsModele.create({
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
    let page = parseInt(req.query.page);
    let limit = parseInt(req.query.limit);
    if (!page || page <= 0 || isNaN(page)) {
      page = 1;
    }
    if (!limit || limit <= 0 || isNaN(limit)) {
      limit = 10;
    }
    const skip = (page - 1) * limit;
    const total = await postsModele.countDocuments();

    const all_posts = await postsModele
      .find()
      .populate("author_id", "email _id")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalPages = Math.ceil(total / limit);

    return myResponse(res, 200, "all posts", {
      data: all_posts,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    next(error);
  }
};
const postsbyId = async (req, res, next) => {
  try {
    const all_posts = await postsModele
      .findById(req.params.id)
      .populate("author_id", "email _id");
    if (!all_posts) throw new MyError(404, "Not found");
    return myResponse(res, 200, "all posts", all_posts);
  } catch (error) {
    next(error);
  }
};
export { createPost, allPosts, postsbyId };
