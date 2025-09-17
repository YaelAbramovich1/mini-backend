// middlewares/notFound.js
module.exports = (req, res, next) => {
  res.status(404).json({
    error: 'route not found',
    method: req.method,
    url: req.originalUrl,
  });
};
