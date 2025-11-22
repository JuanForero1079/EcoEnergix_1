// utils/error.js
class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // Para diferenciar errores esperados de bugs
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
