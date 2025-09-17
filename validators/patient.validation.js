// validators/patient.validation.js
const Joi = require('joi');

exports.createPatientSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
  age:  Joi.number().min(0).max(130).required(),
});

exports.updatePatientSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
  age:  Joi.number().min(0).max(130).required(),
});
