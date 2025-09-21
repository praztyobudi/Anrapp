export const successResponse = (res, message, data) => {
  return res.status(200).json({
    status: 'success',
    message,
    data
  });
};

export const errorResponse = (res, message, statusCode = 500) => {
  return res.status(statusCode).json({
    status: 'error',
    message,
    data: null
  });
};
