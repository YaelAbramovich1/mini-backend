// middlewares/validate.js
exports.body = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
  if (error) {
    error.isJoi = true;
    return next(error);
  }
  req.body = value;
  next();
};
