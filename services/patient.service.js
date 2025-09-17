// services/patient.service.js
const mongoose = require('mongoose');
const Patient = require('../models/patient');

function buildFilter({ q, minAge, maxAge }) {
  const filter = {};
  if (q) filter.name = { $regex: q, $options: 'i' };
  const min = minAge !== undefined ? Number(minAge) : undefined;
  const max = maxAge !== undefined ? Number(maxAge) : undefined;
  if (!Number.isNaN(min) || !Number.isNaN(max)) {
    filter.age = {};
    if (!Number.isNaN(min)) filter.age.$gte = min;
    if (!Number.isNaN(max)) filter.age.$lte = max;
  }
  return filter;
}

async function list({ page = 1, limit = 20, sortBy = 'createdAt', sortDir = 'desc', q, minAge, maxAge }) {
  limit = Math.min(Math.max(parseInt(limit) || 20, 1), 100);
  page  = Math.max(parseInt(page) || 1, 1);
  const skip = (page - 1) * limit;
  const dir = (String(sortDir).toLowerCase() === 'asc') ? 1 : -1;

  const filter = buildFilter({ q, minAge, maxAge });

  const [total, rows] = await Promise.all([
    Patient.countDocuments(filter),
    Patient.find(filter).sort({ [sortBy]: dir }).skip(skip).limit(limit).lean(),
  ]);

  return { data: rows, meta: { total, page, pages: Math.ceil(total / limit) || 1, limit } };
}

async function getById(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return Patient.findById(id).lean();
}

async function create({ name, age }) {
  return Patient.create({ name: name.trim(), age });
}

async function update(id, { name, age }) {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return Patient.findByIdAndUpdate(
    id,
    { name: name.trim(), age },
    { new: true, runValidators: true }
  );
}

async function remove(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return Patient.findByIdAndDelete(id);
}

module.exports = { list, getById, create, update, remove };
