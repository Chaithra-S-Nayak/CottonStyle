const ErrorHandler = require("../utils/ErrorHandler");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  // Invalid MongoDB ID error
  if (err.name === "CastError") {
    const message = `Resource not found with the given ID. Invalid ${err.path}: ${err.value}`;
    err = new ErrorHandler(message, 400);
  }

  // Duplicate key error
  if (err.code === 11000) {
    const message = `Duplicate key error: ${Object.keys(err.keyValue)
      .map((key) => `${key}: ${err.keyValue[key]}`)
      .join(", ")}`;
    err = new ErrorHandler(message, 400);
  }

  // Invalid JWT error
  if (err.name === "JsonWebTokenError") {
    const message = `Invalid token. Please try again with a valid token.`;
    err = new ErrorHandler(message, 401); // 401 Unauthorized
  }

  // Expired JWT error
  if (err.name === "TokenExpiredError") {
    const message = `Token has expired. Please log in again to get a new token.`;
    err = new ErrorHandler(message, 401); // 401 Unauthorized
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};
