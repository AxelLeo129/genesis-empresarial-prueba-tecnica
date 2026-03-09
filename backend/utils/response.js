/**
 * Standardized API response helpers
 */

const success = (res, data, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

const created = (res, data, message = 'Resource created successfully') => {
  return success(res, data, message, 201);
};

const error = (res, message = 'An error occurred', statusCode = 400) => {
  return res.status(statusCode).json({
    success: false,
    message
  });
};

const notFound = (res, message = 'Resource not found') => {
  return error(res, message, 404);
};

const paginated = (res, data, pagination, message = 'Success') => {
  return res.status(200).json({
    success: true,
    message,
    data,
    pagination
  });
};

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = {
  success,
  created,
  error,
  notFound,
  paginated,
  AppError
};
