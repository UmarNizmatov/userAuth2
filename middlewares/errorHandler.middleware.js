import myResponse from "../utils/customResponse.js";

const errorHandler = (err, req, res, next) => {
  if (!Number.isInteger(err.status) || !err.status) err.status = 500;
  return myResponse(res, err.status, err.message, err.stack, false);
};
export default errorHandler;
