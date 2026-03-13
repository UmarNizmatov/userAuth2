import userModele from "../models/user.modele.js";
import MyError from "../utils/customError.js";

const getAuthor = async (req, res, next) => {
  try {
    const id = req.user._id;
    const author = await userModele.findById(id).lean();
    if (!author) throw new MyError(401, "You are not author please register");
    req.author = author;
    next();
  } catch (error) {
    next(error);
  }
};
export default getAuthor;
