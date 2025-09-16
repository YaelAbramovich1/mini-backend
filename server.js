const express = require('express');
const app = express();

// ----- מזהה גרסה לעזרה בדיבוג -----
const VER = 'v3-PUT-enabled';
console.log('SERVER START', VER, 'from', __filename);

// לוג לכל בקשה (נראה מה באמת מגיע)
app.use((req, res, next) => { console.log(req.method, req.url); next(); });

app.use(express.json());

// health
app.get('/health', (req, res) => res.status(200).json({ ok: true, ver: VER }));

// "DB" בזיכרון
const patients = [
  { id: 1, name: 'Rina Cohen', age: 62 },
  { id: 2, name: 'David Levi', age: 55 },
];

// READ
app.get('/patients', (req, res) => res.json(patients));

// CREATE
app.post('/patients', (req, res) => {
  const { name, age } = req.body || {};
  if (!name || !age) return res.status(400).json({ error: 'name and age are required' });
  const p = { id: Date.now(), name, age };
  patients.push(p);
  res.status(201).json(p);
});

// UPDATE (זו הנקודה החשובה!)
app.put('/patients/:id', (req, res) => {
  const id = Number(req.params.id);
  const idx = patients.findIndex(p => p.id === id);
  if (idx === -1) return res.status(404).json({ error: 'patient not found' });

  const { name, age } = req.body || {};
  if (!name || !age) return res.status(400).json({ error: 'name and age are required' });

  patients[idx] = { id, name, age };
  res.json(patients[idx]);
});

// DELETE
app.delete('/patients/:id', (req, res) => {
  const id = Number(req.params.id);
  const left = patients.filter(p => p.id !== id);
  if (left.length === patients.length) return res.status(404).json({ error: 'patient not found' });
  patients.length = 0; patients.push(...left);
  res.status(204).send();
});

// נתיב בדיקת עשן
app.get('/hello', (req, res) => res.json({ ok: true }));

// ----- 404 JSON (אם אין התאמה לנתיב) -----
app.use((req, res) => {
  console.log('NO MATCH', req.method, req.url);
  res.status(404).json({ error: 'route not found', method: req.method, url: req.url, ver: VER });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('listening on http://localhost:' + PORT));
