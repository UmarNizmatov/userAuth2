const myResponse = (res, status_code, message, data, success = true) => {
  if (!Number.isInteger(status_code) || !status_code) status_code = 500;
  return res.status(status_code).json({
    success,
    message,
    data,
  });
};
export default myResponse