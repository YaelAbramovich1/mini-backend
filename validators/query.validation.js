// validators/query.validation.js
const Joi = require('joi');

const listPatientsQuerySchema = Joi.object({
  page:    Joi.number().integer().min(1).default(1),
  limit:   Joi.number().integer().min(1).max(100).default(20),
  sortBy:  Joi.string().valid('createdAt', 'name', 'age').default('createdAt'),
  sortDir: Joi.string().valid('asc', 'desc').insensitive().default('desc'),
  q:       Joi.string().trim().allow('', null),
  minAge:  Joi.number().integer().min(0),
  maxAge:  Joi.number().integer().min(0)
}).with('minAge', 'minAge') // לא באמת מחייב כלום; רק שומר על מבנה
  .with('maxAge', 'maxAge');

module.exports = { listPatientsQuerySchema };
