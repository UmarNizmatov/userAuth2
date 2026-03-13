import userModele from "../models/user.modele.js";
import MyError from "../utils/customError.js";
import myResponse from "../utils/customResponse.js";
import sendOTP from "../utils/email.js";
import generateOTP from "../utils/otp.js";
import { generateAccessToken, generateRefreshToken } from "../utils/token.js";
const createOTP = (user) => {
  const otpCode = generateOTP();
  const otpExpireTime = new Date(Date.now() + 5 * 60 * 1000);
  user.otpCode = otpCode;
  user.otpExpireTime = otpExpireTime;
  return user;
};
const register = async (req, res, next) => {
  try {
    const { email } = req.body;
    const password = crypto.randomUUID();
    const sameuser = await userModele.findOne({ email });
    let user;

    if (!sameuser) {
      user = await userModele.create({ email, password });
    } else {
      if (sameuser.isVerified) {
        throw new MyError(400, "This email is already verified");
      }
      user = sameuser;
    }
    createOTP(user);
    await user.save();
    user = user.toObject();
    sendOTP(email, user.otpCode);
    delete user.password;
    delete user.otpCode;
    delete user.otpExpireTime;
    return myResponse(res, 200, "Your OTP Code was send to your email", null);
  } catch (error) {
    next(error);
  }
};
const verifyRegister = async (req, res, next) => {
  try {
    const { email, otp, password } = req.body;
    let user = await userModele.findOne({ email });
    const userotpCode = user.otpCode;
    const userotpExpireTime = user.otpExpireTime;
    user.otpCode = null;
    user.otpExpireTime = null;
    if (!user) throw new MyError(404, "User not found");
    if (!(Date.now() <= userotpExpireTime))
      throw new MyError(400, "Your OTP Code is expired");
    if (userotpCode !== otp) throw new MyError(400, "Your OTP Code is  wrong");
    user.isVerified = true;
    user.password = password;
    await user.save();
    user = user.toObject();
    delete user.password;
    return myResponse(res, 200, "You succesfully verified", user);
  } catch (error) {
    next(error);
  }
};
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await userModele.findOne({ email });
    if (!user) throw new MyError(404, "User not found");
    if (!user.isVerified)
      throw new MyError(400, "This email hasn't been verified yet");
    const isMatch = await user.passwordCompare(password);
    if (!isMatch) throw new MyError(400, "Password is wrong");
    const refreshToken = generateRefreshToken(user);
    const accessToken = generateAccessToken(user);
    user.refreshToken = refreshToken;
    await user.save();
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "PRO",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return myResponse(res, 200, "You have logged in successfully", {
      email: user.email,
      accessToken,
      refreshToken,
      id: user.id,
    });
  } catch (error) {
    next(error);
  }
};
const refresh = async (req, res, next) => {
  try {
    const user = req.user;
    const accessToken = generateAccessToken(user);
    return myResponse(res, 200, "access token", accessToken);
  } catch (error) {
    next(error);
  }
};
const logout = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const user = await userModele.findById(_id);
    user.refreshToken = null;
    await user.save();
    return myResponse(res, 200, "You have logged out sucesfully");
  } catch (error) {
    next(error);
  }
};
const getMe = async (req, res, next) => {
  try {
    const { _id } = req.user.user;
    let user = await userModele.findById(_id).select("-password");
    return myResponse(res, 200, "Your info", user);
  } catch (error) {
    next(error);
  }
};
const getStats = async (req, res, next) => {
  try {
    const users = await userModele.aggregate([
      {
        $group: {
          _id: null,
          verified: {
            $sum: { $cond: [{ $eq: ["$isVerified", true] }, 1, 0] },
          },
          unverified: {
            $sum: { $cond: [{ $eq: ["$isVerified", false] }, 1, 0] },
          },
          total: { $sum: 1 },
        },
      },
      {
        $project: { _id: 0 },
      },
    ]);
    return myResponse(res, 200, "stats users", users);
  } catch (error) {
    next(error);
  }
};
const changePassword = async (req, res, next) => {
  try {
    const id = req.user.id;
    const { oldPassword, newPassword } = req.body;
    const user = await userModele.findById(id);
    const isMatch = user.passwordCompare(oldPassword);
    if (!isMatch) throw new MyError(400, "Old password is wrong");
    if (oldPassword === newPassword)
      throw new MyError(400, "Old password is same with new");
    user.password = newPassword;
    await user.save();
    return myResponse(res, 200, "Yor password was changed");
  } catch (error) {
    next(error);
  }
};
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const emailInDb = userModele.findOne({ email });
    if (!emailInDb) throw new MyError(404, "Email not found");
    createOTP(emailInDb);
    await emailInDb.save();
    sendOTP(email, user.otpCode);
    return myResponse(res, 200, "Your OTP Code was send to your email");
  } catch (error) {
    next(error);
  }
};
const resetPassword = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;
    let user = await userModele.findOne({ email });
    if (!user) throw new MyError(404, "Email not found");
    const userotpCode = user.otpCode;
    const userotpExpireTime = user.otpExpireTime;
    user.otpCode = null;
    user.otpExpireTime = null;
    if (!user) throw new MyError(404, "User not found");
    if (!(Date.now() <= userotpExpireTime))
      throw new MyError(400, "Your OTP Code is expired");
    if (userotpCode !== otp) throw new MyError(400, "Your OTP Code is  wrong");
    user.password = newPassword;
    user.refreshToken = null;
    await user.save();
    return myResponse(res, 200, "Your password was changed");
  } catch (error) {
    next(error);
  }
};
export {
  register,
  verifyRegister,
  login,
  refresh,
  logout,
  getMe,
  getStats,
  changePassword,
  forgotPassword,
};
