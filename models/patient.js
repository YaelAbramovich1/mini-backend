// models/patient.js
const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    age: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);
patientSchema.index({ name: 1 });

module.exports = mongoose.model('Patient', patientSchema);
patientSchema.index({ name: 1 });
