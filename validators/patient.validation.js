// validators/patient.validation.js
const Joi = require('joi');

const createPatientSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).required(),
  age: Joi.number().min(0).max(120).required(),
});

const updatePatientSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).required(),
  age: Joi.number().min(0).max(120).required(),
});

const listQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  sortBy: Joi.string().valid('createdAt', 'name', 'age').default('createdAt'),
  sortDir: Joi.string().valid('asc', 'desc').default('desc'),
  q: Joi.string().trim().allow(''),
  minAge: Joi.number().min(0),
  maxAge: Joi.number().min(0),
});

module.exports = {
  createPatientSchema,
  updatePatientSchema,
  listQuerySchema,
};
