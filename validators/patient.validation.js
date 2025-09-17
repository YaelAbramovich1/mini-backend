// validators/patient.validation.js
const Joi = require('joi');

// יצירה
const createPatientSchema = Joi.object({
  name: Joi.string().trim().min(1).required(),
  age: Joi.number().integer().min(0).required(),
});

// עדכון
const updatePatientSchema = Joi.object({
  name: Joi.string().trim().min(1).required(),
  age: Joi.number().integer().min(0).required(),
});

// ולידציה לפרמטרים של רשימה (GET /patients)
const listQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),

  q: Joi.string().trim().allow(''),

  minAge: Joi.number().integer().min(0).optional(),
  maxAge: Joi.number().integer().min(0).optional(),

  sortBy: Joi.string()
    .valid('createdAt', 'updatedAt', 'name', 'age')
    .default('createdAt'),
  sortDir: Joi.string().valid('asc', 'desc').default('desc'),
});

// ולידציה ל־:id בנתיב
const idParamSchema = Joi.object({
  id: Joi.string().hex().length(24).required(), // ObjectId
});

module.exports = {
  createPatientSchema,
  updatePatientSchema,
  listQuerySchema,
  idParamSchema,
};
