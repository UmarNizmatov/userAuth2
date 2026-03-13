import Joi from "joi";

const authorSchema = Joi.object({
  user_id: Joi.required(),
  name: Joi.string().required(),
  body: Joi.string().optional(),
  avatar: Joi.optional(),
});

export { authorSchema };
