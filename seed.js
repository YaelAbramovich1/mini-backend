// seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const Patient = require('./models/patient');

// קריאת פרמטרים מהשורה (ברירת מחדל: 50; עם reset מוחק לפני)
const args = process.argv.slice(2).join(' ');
const COUNT = Number((args.match(/--count=(\d+)/) || [])[1] || 50);
const RESET = /--reset/.test(args);

function buildPatient() {
  return {
    name: `${faker.person.firstName()} ${faker.person.lastName()}`,
    age: faker.number.int({ min: 1, max: 100 }),
  };
}

(async () => {
  try {
    if (!process.env.MONGO_URI) throw new Error('Missing MONGO_URI in .env');

    console.log('Connecting to Mongo...');
    await mongoose.connect(process.env.MONGO_URI);

    if (RESET) {
      console.log('Clearing collection (RESET)...');
      await Patient.deleteMany({});
    }

    console.log(`Generating ${COUNT} patients...`);
    const docs = Array.from({ length: COUNT }, buildPatient);

    const out = await Patient.insertMany(docs);
    console.log(`Seed done. Inserted ${out.length} docs.`);
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
})();
