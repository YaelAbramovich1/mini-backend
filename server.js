// server.js
require('dotenv').config();

console.log('RUNNING FILE      :', __filename);
console.log('WORKING DIRECTORY :', process.cwd());

const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

// ------- Config -------
const VER = 'v1.0';
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

// ------- Middlewares (סדר חשוב) -------
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// ------- DB Connect -------
mongoose
  .connect(MONGO_URI)
  .then(() => console.log('✅ Mongo connected'))
  .catch((err) => {
    console.error('❌ Mongo connection error:', err.message);
    process.exit(1);
  });

// ------- Routes -------
const patientRoutes = require('./routes/patient.routes'); // משתמשים בראוטר החיצוני
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
const notFound = require('./middlewares/notFound');
const errorHandler = require('./middlewares/errorHandler');

// ... כל הראוטים מעל זה

app.use(notFound);
app.use(errorHandler);


// ------- Start server -------
app.listen(PORT, () => {
  console.log(`listening on http://localhost:${PORT}`);
});
