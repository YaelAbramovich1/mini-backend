module.exports = (err, req, res, next) => {
  console.error('[ERROR]', err);
  if (res.headersSent) return next(err);
  res.status(500).json({ error: 'internal server error' });
};
