// middlewares/error.js
const { ApiError } = require('../utils/http');

function notFound(req, res, next) {
  next(new ApiError(404, `route not found: ${req.method} ${req.originalUrl}`));
}

function errorHandler(err, req, res, next) { // eslint-disable-line
  const status = err.status || 500;
  const payload = {
    ok: false,
    error: err.message || 'internal server error',
  };
  if (err.details) payload.details = err.details;
  if (process.env.NODE_ENV !== 'production') {
    payload.stack = err.stack;
  }
  res.status(status).json(payload);
}

module.exports = { notFound, errorHandler };
