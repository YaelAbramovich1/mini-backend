// routes/patient.routes.js
const express = require('express');
const router = express.Router();

const ctrl = require('../controllers/patient.controller');
const validate = require('../middlewares/validate');
const { createPatientSchema, updatePatientSchema } = require('../validators/patient.validation');

// List + query (page/limit/q/minAge/maxAge/sortBy/sortDir)
router.get('/', ctrl.list);

// Get single
router.get('/:id', ctrl.getOne);

// Create (עם ולידציה)
router.post('/', validate.body(createPatientSchema), ctrl.create);

// Update (עם ולידציה)
router.put('/:id', validate.body(updatePatientSchema), ctrl.update);

// Delete
router.delete('/:id', ctrl.remove);

module.exports = router;
