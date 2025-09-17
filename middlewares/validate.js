// middlewares/validate.js
exports.body = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
  if (error) return res.status(400).json({ error: error.message });
  req.body = value;
  next();
};

exports.query = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.query, { abortEarly: false, stripUnknown: true });
  if (error) return res.status(400).json({ error: error.message });
  req.query = value;
  next();
};

exports.params = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.params, { abortEarly: false, stripUnknown: true });
  if (error) return res.status(400).json({ error: error.message });
  req.params = value;
  next();
};
