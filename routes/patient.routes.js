// routes/patient.routes.js
const express = require('express');
const mongoose = require('mongoose');
const Patient = require('../models/patient');
const validate = require('../middlewares/validate');
const { createPatientSchema, updatePatientSchema } = require('../validators/patient.validation');

const router = express.Router();

// GET /patients – עם עמודים/חיפוש/סינון/מיון (כבר קיים)
router.get('/', async (req, res, next) => {
  try {
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 20, 1), 100);
    const page  = Math.max(parseInt(req.query.page) || 1, 1);
    const skip  = (page - 1) * limit;

    const sortBy  = req.query.sortBy || 'createdAt';
    const sortDir = (req.query.sortDir || 'desc').toLowerCase() === 'asc' ? 1 : -1;

    const filter = {};
    if (req.query.q) filter.name = { $regex: req.query.q, $options: 'i' };
    const minAge = req.query.minAge ? Number(req.query.minAge) : undefined;
    const maxAge = req.query.maxAge ? Number(req.query.maxAge) : undefined;
    if (minAge !== undefined || maxAge !== undefined) {
      filter.age = {};
      if (!Number.isNaN(minAge)) filter.age.$gte = minAge;
      if (!Number.isNaN(maxAge)) filter.age.$lte = maxAge;
    }

    const [total, rows] = await Promise.all([
      Patient.countDocuments(filter),
      Patient.find(filter).sort({ [sortBy]: sortDir }).skip(skip).limit(limit).lean(),
    ]);

    res.json({ data: rows, meta: { total, page, pages: Math.ceil(total / limit) || 1, limit } });
  } catch (e) { next(e); }
});

router.get('/:id', async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'invalid id' });
    }
    const row = await Patient.findById(req.params.id).lean();
    if (!row) return res.status(404).json({ error: 'patient not found' });
    res.json(row);
  } catch (e) { next(e); }
});


// POST /patients – עם ולידציה
router.post('/', validate.body(createPatientSchema), async (req, res, next) => {
  try {
    const { name, age } = req.body;
    const row = await Patient.create({ name: name.trim(), age });
    res.status(201).json(row);
  } catch (e) { next(e); }
});

// PUT /patients/:id – עם ולידציה
router.put('/:id', validate.body(updatePatientSchema), async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'invalid id' });
    }
    const { name, age } = req.body;
    const row = await Patient.findByIdAndUpdate(
      req.params.id,
      { name: name.trim(), age },
      { new: true, runValidators: true }
    );
    if (!row) return res.status(404).json({ error: 'patient not found' });
    res.json(row);
  } catch (e) { next(e); }
});

// DELETE /patients/:id
router.delete('/:id', async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'invalid id' });
    }
    const out = await Patient.findByIdAndDelete(req.params.id);
    if (!out) return res.status(404).json({ error: 'patient not found' });
    res.status(204).send();
  } catch (e) { next(e); }
});

module.exports = router;
