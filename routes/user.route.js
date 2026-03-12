import { Router } from "express";
import {
  getMe,
  login,
  logout,
  refresh,
  register,
  verifyRegister,
} from "../controllers/user.controller.js";
import {
  validator,
  accessTokenValidator,
  refreshTokenValidator,
} from "../middlewares/validator.middleware.js";
import {
  emailSchema,
  loginSchema,
  userSchema,
} from "../schemas/user.schema.js";

const userRouter = new Router();
userRouter.post("/register", validator(emailSchema), register);
userRouter.post("/verify-otp", validator(userSchema), verifyRegister);
userRouter.post("/login", validator(loginSchema), login);
userRouter.post("/logout", refreshTokenValidator, logout);
userRouter.post("/refresh", refreshTokenValidator, refresh);
userRouter.get("/me", accessTokenValidator, getMe);
export default userRouter;
