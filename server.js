// server.js
require('dotenv').config();

console.log('RUNNING FILE      :', __filename);
console.log('WORKING DIRECTORY :', process.cwd());

const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');

const notFound = require('./middlewares/notFound');
const errorHandler = require('./middlewares/errorHandler');
const patientRoutes = require('./routes/patient.routes');

const app = express();

// ------- Config -------
const VER = 'v1.0';
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

// ------- Middlewares (order matters) -------
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
app.use('/patients', patientRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({
    ok: true,
    ver: VER,
    src: __filename,
    time: new Date().toISOString(),
  });
});

// ------- 404 & Error handlers (must be last) -------
app.use(notFound);
app.use(errorHandler);

// ------- Start server -------
app.listen(PORT, () => {
  console.log(`listening on http://localhost:${PORT}`);
});
