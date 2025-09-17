// routes/patient.routes.js
const express = require('express');
const validate = require('../middlewares/validate');
const {
  createPatientSchema,
  updatePatientSchema,
  listQuerySchema,
  idParamSchema,
} = require('../validators/patient.validation');
const patientCtrl = require('../controllers/patient.controller');

const router = express.Router();

// רשימה עם עמודים/חיפוש/מיון – עם ולידציית query
router.get('/', validate.query(listQuerySchema), patientCtrl.list);

// שליפת רשומה בודדת – ולידציית :id
router.get('/:id', validate.params(idParamSchema), patientCtrl.getOne);

// יצירה – ולידציית body
router.post('/', validate.body(createPatientSchema), patientCtrl.create);

// עדכון – ולידציית :id + body
router.put('/:id', validate.params(idParamSchema), validate.body(updatePatientSchema), patientCtrl.update);

// מחיקה – ולידציית :id
router.delete('/:id', validate.params(idParamSchema), patientCtrl.remove);

module.exports = router;
