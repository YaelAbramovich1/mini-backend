// server.js
require('dotenv').config();

console.log('RUNNING FILE      :', __filename);
console.log('WORKING DIRECTORY :', process.cwd());

const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const notFound = require('./middlewares/notFound');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// ------- Config -------
const VER = 'v1.0';
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

// ------- Middlewares (סדר חשוב) -------
app.use(helmet());              // כותרות אבטחה
app.use(cors());                // בשלב לימוד – פתוח; בעתיד לצמצם origin
app.use(express.json());        // JSON parser
app.use(morgan('dev'));         // לוגים יפים

// Rate limit בסיסי ל-API (מונע הצפה)
app.use(
  '/patients',
  rateLimit({
    windowMs: 15 * 60 * 1000,   // 15 דקות
    max: 300,                   // עד 300 בקשות ל-15 דקות ל-IP
    standardHeaders: true,
    legacyHeaders: false,
  })
);

// ------- DB Connect -------
mongoose
  .connect(MONGO_URI)
  .then(() => console.log('✅ Mongo connected'))
  .catch((err) => {
    console.error('❌ Mongo connection error:', err.message);
    process.exit(1);
  });

// ------- Routes -------
const patientRoutes = require('./routes/patient.routes');
app.use('/patients', patientRoutes);

// Health
app.get('/health', (req, res) => {
  res.status(200).json({
    ok: true,
    ver: VER,
    src: __filename,
    time: new Date().toISOString(),
  });
});

// 404 + Error handler
app.use(notFound);
app.use(errorHandler);

// ------- Start server -------
app.listen(PORT, () => {
  console.log(`listening on http://localhost:${PORT}`);
});
