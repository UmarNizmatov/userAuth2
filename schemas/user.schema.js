import Joi from "joi";
const emailSchema = Joi.object({
  email: Joi.string().email().required(),
});
const userSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(30).required(),
  otp: Joi.string().min(6).max(6).required(),
});
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(30).required(),
});
const changePasswordSchema = Joi.object({
  oldPassword: Joi.string().min(8).max(30).required(),
  newPassword: Joi.string().min(8).max(30).required(),
});
const resetPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
  newPassword: Joi.string().min(8).max(30).required(),
  otp: Joi.string().min(6).max(6).required(),
});
export {
  emailSchema,
  userSchema,
  loginSchema,
  changePasswordSchema,
  resetPasswordSchema,
};
