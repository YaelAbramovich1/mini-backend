// middlewares/validate.js
module.exports = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true,
    });
    if (error) {
      return res.status(400).json({
        error: 'validation error',
        details: error.details.map((d) => ({ message: d.message, path: d.path })),
      });
    }
    req[property] = value; // קלט שנוקה ואומת
    next();
  };
};
