module.exports = (req, res) => {
  res.status(404).json({ error: 'route not found', method: req.method, url: req.url });
};
