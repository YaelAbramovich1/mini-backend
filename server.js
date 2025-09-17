// Load .env first

console.log('RUNNING FILE      :', __filename);
console.log('WORKING DIRECTORY :', process.cwd());

require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');

const app = express();

// ------- Config -------
const VER = 'v1.0';
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

// ------- DB Connect -------
mongoose
  .connect(MONGO_URI)
  .then(() => console.log('✅ Mongo connected'))
  .catch((err) => {
    console.error('❌ Mongo connection error:\n', err.message);
    process.exit(1);
  });

// ------- Middlewares -------
app.use(express.json());

// Simple request logger
app.use((req, res, next) => {
  console.log(`[MONGO-IMPL] ${req.method} ${req.url}`);
  next();
});

const cors = require('cors');
const morgan = require('morgan');

app.use(cors());                 // פתיחת CORS (אפשר לצמצם בהמשך)
app.use(morgan('dev'));          // לוגים יפים לבקשות


// ------- Mongoose Model -------
const patientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    age: { type: Number, required: true, min: 0 }
  },
  { timestamps: true }
);
const Patient = require('./models/patient');

// ------- Routes -------
app.get('/health', (req, res) => {
  res.status(200).json({
    ok: true,
    ver: VER,
    src: __filename,   // <- נראה מאיזה קובץ נענית הבקשה
    time: new Date().toISOString(),
  });
});


// GET /patients – עם עמודות/חיפוש/סינון/מיון
app.get('/patients', async (req, res, next) => {
  try {
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 20, 1), 100);
    const page  = Math.max(parseInt(req.query.page) || 1, 1);
    const skip  = (page - 1) * limit;

    const sortBy  = req.query.sortBy || 'createdAt';
    const sortDir = (req.query.sortDir || 'desc').toLowerCase() === 'asc' ? 1 : -1;

    const filter = {};
    if (req.query.q) {
      filter.name = { $regex: req.query.q, $options: 'i' };
    }
    const minAge = req.query.minAge ? Number(req.query.minAge) : undefined;
    const maxAge = req.query.maxAge ? Number(req.query.maxAge) : undefined;
    if (minAge !== undefined || maxAge !== undefined) {
      filter.age = {};
      if (!Number.isNaN(minAge)) filter.age.$gte = minAge;
      if (!Number.isNaN(maxAge)) filter.age.$lte = maxAge;
    }

    const [total, rows] = await Promise.all([
      Patient.countDocuments(filter),
      Patient.find(filter).sort({ [sortBy]: sortDir }).skip(skip).limit(limit).lean()
    ]);

    res.json({ data: rows, meta: { total, page, pages: Math.ceil(total / limit) || 1, limit } });
  } catch (e) { next(e); }
});

// Create
app.post('/patients', async (req, res, next) => {
  try {
    const { name, age } = req.body || {};
    if (!name || typeof name !== 'string') return res.status(400).json({ error: 'name (string) is required' });
    if (age === undefined || typeof age !== 'number' || age < 0) return res.status(400).json({ error: 'age (number >=0) is required' });

    const row = await Patient.create({ name: name.trim(), age });
    res.status(201).json(row);
  } catch (e) { next(e); }
});

// Update
app.put('/patients/:id', async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ error: 'invalid id' });
    const { name, age } = req.body || {};
    if (!name || typeof name !== 'string') return res.status(400).json({ error: 'name (string) is required' });
    if (age === undefined || typeof age !== 'number' || age < 0) return res.status(400).json({ error: 'age (number >=0) is required' });

    const row = await Patient.findByIdAndUpdate(
      req.params.id, { name: name.trim(), age }, { new: true, runValidators: true }
    );
    if (!row) return res.status(404).json({ error: 'patient not found' });
    res.json(row);
  } catch (e) { next(e); }
});

app.delete('/patients/:id', async (req, res, next) => {
  try {
    const out = await Patient.findByIdAndDelete(req.params.id);
    if (!out) return res.status(404).json({ error: 'patient not found' });
    res.status(204).send();
  } catch (e) { next(e); }
});

// 404 JSON
app.use((req, res) => {
  res.status(404).json({ error: 'route not found', method: req.method, url: req.url });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('ERROR:', err);
  res.status(500).json({ error: 'internal server error' });
});

// ------- Start server -------
app.listen(PORT, () => {
  console.log(`listening on http://localhost:${PORT}`);
});
const morgan = require('morgan');
const cors = require('cors');

app.use(cors());        // פתוח בשלב הלמידה; בעתיד מצמצמים דומיינים
app.use(morgan('dev')); // לוגים יפים לכל בקשה
