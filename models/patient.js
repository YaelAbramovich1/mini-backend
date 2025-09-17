// models/patient.js
const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, index: true }, // אינדקס לשם
    age: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

// אינדקס למיונים/דפדוף לפי זמן יצירה
patientSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Patient', patientSchema);
