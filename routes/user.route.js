import { Router } from "express";
import {
  changePassword,
  getMe,
  getStats,
  login,
  logout,
  refresh,
  register,
  verifyRegister,
  forgotPassword,
  resetPassword,
} from "../controllers/user.controller.js";
import {
  validator,
  accessTokenValidator,
  refreshTokenValidator,
} from "../middlewares/validator.middleware.js";
import {
  changePasswordSchema,
  emailSchema,
  loginSchema,
  resetPasswordSchema,
  userSchema,
} from "../schemas/user.schema.js";

const userRouter = new Router();
userRouter.post("/register", validator(emailSchema), register);
userRouter.post("/verify-otp", validator(userSchema), verifyRegister);
userRouter.post("/login", validator(loginSchema), login);
userRouter.post("/logout", refreshTokenValidator, logout);
userRouter.post("/refresh", refreshTokenValidator, refresh);
userRouter.get("/me", accessTokenValidator, getMe);
userRouter.get("/users", getStats);
userRouter.put(
  "/change-password",
  accessTokenValidator,
  validator(changePasswordSchema),
  changePassword,
);
userRouter.post("/forgot-password", validator(emailSchema), forgotPassword);
userRouter.post(
  "/reset-password",
  validator(resetPasswordSchema),
  resetPassword,
);
export default userRouter;
