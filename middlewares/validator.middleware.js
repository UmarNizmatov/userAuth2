import jwt from "jsonwebtoken";
import userModele from "../models/user.modele.js";
import MyError from "../utils/customError.js";

const validator = (schema) => {
  return (req, res, next) => {
    try {
      const { error } = schema.validate(req.body);
      if (error) throw new MyError(400, error.message);
      next();
    } catch (error) {
      next(error);
    }
  };
};
// const isEmailSame = (req, res, next) => {
//   try {
//     const { email } = req.body;
//     const user = userModele.findOne({ email });
//     if (user.isVerified)
//       throw new MyError(400, "This email is already verified");
//     next();
//   } catch (error) {
//     next(error);
//   }
// };
const refreshTokenValidator = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
    if (!refreshToken) {
      throw new MyError(401, "Refresh token is required");
    }
    const user = jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN_SECRET);
    const tokenInDb = await userModele.findOne({ refreshToken });
    if (!tokenInDb) throw new MyError(401, "Token revoked");
    req.user = user;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") err.message = "Refresh token expired";
    if (err.name === "JsonWebTokenError") err.message = "Invalid refresh token";
    next(err);
  }
};
const accessTokenValidator = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) throw new MyError(401, "Access token is required");

    const accessToken = authHeader.split(" ")[1];
    if (!accessToken) throw new MyError(401, "Access token malformed");
    const user = jwt.verify(accessToken, process.env.JWT_ACCESS_TOKEN_SECRET);
    const useInDb = await userModele.findOne({ _id: user.user._id });
    if (!useInDb) throw new MyError(401, "Token revoked");
    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError")
      error.message = "Access token expired";
    if (error.name === "JsonWebTokenError")
      error.message = "Invalid refresh token";
    next(error);
  }
};
export { validator, refreshTokenValidator, accessTokenValidator };
