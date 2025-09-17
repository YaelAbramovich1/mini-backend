const mongoose = require('mongoose');
const Patient = require('../models/patient');

function buildFilter(q, minAge, maxAge) {
  const filter = {};
  if (q) filter.name = { $regex: q, $options: 'i' };
  if (minAge !== undefined || maxAge !== undefined) {
    filter.age = {};
    if (!Number.isNaN(Number(minAge))) filter.age.$gte = Number(minAge);
    if (!Number.isNaN(Number(maxAge))) filter.age.$lte = Number(maxAge);
  }
  return filter;
}

async function list({ page = 1, limit = 20, sortBy = 'createdAt', sortDir = 'desc', q, minAge, maxAge }) {
  limit = Math.min(Math.max(parseInt(limit) || 20, 1), 100);
  page  = Math.max(parseInt(page) || 1, 1);
  const skip = (page - 1) * limit;
  const filter = buildFilter(q, minAge, maxAge);
  const dir = (String(sortDir).toLowerCase() === 'asc') ? 1 : -1;

  const [total, data] = await Promise.all([
    Patient.countDocuments(filter),
    Patient.find(filter).sort({ [sortBy]: dir }).skip(skip).limit(limit).lean()
  ]);

  return { data, meta: { total, page, pages: Math.ceil(total / limit) || 1, limit } };
}

async function create({ name, age }) {
  return Patient.create({ name: name.trim(), age });
}

async function update(id, { name, age }) {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return Patient.findByIdAndUpdate(id, { name: name.trim(), age }, { new: true, runValidators: true });
}

async function remove(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return Patient.findByIdAndDelete(id);
}

async function getById(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return Patient.findById(id).lean();
}

module.exports = { list, create, update, remove, getById };
