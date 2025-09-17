// middlewares/errorHandler.js
module.exports = (err, req, res, next) => {
  console.error('❗ ERROR:', err);

  // Joi validation error?
  if (err && err.isJoi) {
    return res.status(400).json({
      error: 'validation error',
      details: err.details?.map(d => d.message) || [err.message],
    });
  }

  // Mongoose cast error (ObjectId לא חוקי)
  if (err?.name === 'CastError') {
    return res.status(400).json({ error: 'invalid id' });
  }

  // Default
  res.status(err.status || 500).json({
    error: err.message || 'internal server error',
  });
};
// middlewares/errorHandler.js
module.exports = function errorHandler(err, req, res, next) {
  console.error('ERROR HANDLER:', err && err.stack ? err.stack : err);
  const status = err.status || 500;
  const msg = err.message || 'internal server error';
  res.status(status).json({ error: msg });
};
