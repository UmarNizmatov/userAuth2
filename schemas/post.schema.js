import Joi from "joi";

const createPostschema = Joi.object({
  title: Joi.string().required(),
  body: Joi.string().required(),
});
export { createPostschema };
