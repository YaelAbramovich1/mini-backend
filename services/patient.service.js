// services/patient.service.js
const Patient = require('../models/patient');

exports.list = async ({ page = 1, limit = 20, q, minAge, maxAge, sortBy = 'createdAt', sortDir = 'desc' }) => {
  limit = Math.min(Math.max(parseInt(limit) || 20, 1), 100);
  page  = Math.max(parseInt(page) || 1, 1);
  const skip = (page - 1) * limit;

  const filter = {};
  if (q) filter.name = { $regex: q, $options: 'i' };
  const min = minAge !== undefined ? Number(minAge) : undefined;
  const max = maxAge !== undefined ? Number(maxAge) : undefined;
  if (min !== undefined || max !== undefined) {
    filter.age = {};
    if (!Number.isNaN(min)) filter.age.$gte = min;
    if (!Number.isNaN(max)) filter.age.$lte = max;
  }

  const dir  = (String(sortDir).toLowerCase() === 'asc') ? 1 : -1;

  const [total, rows] = await Promise.all([
    Patient.countDocuments(filter),
    Patient.find(filter).sort({ [sortBy]: dir }).skip(skip).limit(limit).lean(),
  ]);

  return {
    data: rows,
    meta: { total, page, pages: Math.ceil(total / limit) || 1, limit }
  };
};

exports.getById = (id) => Patient.findById(id).lean();

exports.create = (payload) => Patient.create(payload);

exports.update = (id, payload) =>
  Patient.findByIdAndUpdate(id, payload, { new: true, runValidators: true });

exports.remove = (id) => Patient.findByIdAndDelete(id);
