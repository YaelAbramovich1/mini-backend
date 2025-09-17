const svc = require('../services/patient.service');
const asyncWrap = require('../utils/asyncWrap');
const mongoose = require('mongoose');

exports.list = asyncWrap(async (req, res) => {
  const out = await svc.list(req.query);
  res.json(out);
});

exports.getOne = asyncWrap(async (req, res) => {
  const row = await svc.getById(req.params.id);
  if (!row) return res.status(404).json({ error: 'patient not found' });
  res.json(row);
});

exports.create = asyncWrap(async (req, res) => {
  const { name, age } = req.body || {};
  if (!name || typeof name !== 'string') return res.status(400).json({ error: 'name (string) is required' });
  if (age === undefined || typeof age !== 'number' || age < 0) return res.status(400).json({ error: 'age (number >=0) is required' });
  const row = await svc.create({ name, age });
  res.status(201).json(row);
});

exports.update = asyncWrap(async (req, res) => {
  const { name, age } = req.body || {};
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ error: 'invalid id' });
  if (!name || typeof name !== 'string') return res.status(400).json({ error: 'name (string) is required' });
  if (age === undefined || typeof age !== 'number' || age < 0) return res.status(400).json({ error: 'age (number >=0) is required' });
  const row = await svc.update(req.params.id, { name, age });
  if (!row) return res.status(404).json({ error: 'patient not found' });
  res.json(row);
});

exports.remove = asyncWrap(async (req, res) => {
  const row = await svc.remove(req.params.id);
  if (!row) return res.status(404).json({ error: 'patient not found' });
  res.status(204).send();
});
