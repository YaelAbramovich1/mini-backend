// controllers/patient.controller.js
const mongoose = require('mongoose');
const Patient = require('../models/patient');
const asyncHandler = require('../utils/asyncHandler');

// GET /patients – עם עמודים/חיפוש/סינון/מיון
exports.list = asyncHandler(async (req, res) => {
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
});

// GET /patients/:id
exports.getOne = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: 'invalid id' });
  }
  const row = await Patient.findById(req.params.id).lean();
  if (!row) return res.status(404).json({ error: 'patient not found' });
  res.json(row);
});

// POST /patients
exports.create = asyncHandler(async (req, res) => {
  const { name, age } = req.body || {};
  if (!name || typeof name !== 'string') {
    return res.status(400).json({ error: 'name (string) is required' });
  }
  if (age === undefined || typeof age !== 'number' || age < 0) {
    return res.status(400).json({ error: 'age (number >=0) is required' });
  }
  const row = await Patient.create({ name: name.trim(), age });
  res.status(201).json(row);
});

// PUT /patients/:id
exports.update = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: 'invalid id' });
  }
  const { name, age } = req.body || {};
  if (!name || typeof name !== 'string') {
    return res.status(400).json({ error: 'name (string) is required' });
  }
  if (age === undefined || typeof age !== 'number' || age < 0) {
    return res.status(400).json({ error: 'age (number >=0) is required' });
  }

  const row = await Patient.findByIdAndUpdate(
    req.params.id,
    { name: name.trim(), age },
    { new: true, runValidators: true }
  );
  if (!row) return res.status(404).json({ error: 'patient not found' });
  res.json(row);
});

// DELETE /patients/:id
exports.remove = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: 'invalid id' });
  }
  const out = await Patient.findByIdAndDelete(req.params.id);
  if (!out) return res.status(404).json({ error: 'patient not found' });
  res.status(204).send();
});
