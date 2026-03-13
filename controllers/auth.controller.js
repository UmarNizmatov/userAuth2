import authModele from "../models/auth.modele.js";
import myResponse from "../utils/customResponse.js";

const createAuthor = async (req, res, next) => {
  try {
    const auth = await authModele.create(req.body);
    return myResponse(res, 201, "Author successfully created", auth);
  } catch (error) {
    next(error);
  }
};
const getAuthors = async (req, res, next) => {
  try {
    let authors = await authModele.find();
    authors = authors;
    return myResponse(res, 200, "allAuthors", authors);
  } catch (error) {
    next(error);
  }
};

export { createAuthor, getAuthors };
