const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const { Animal, AnimalLog } = require('../models');
const { auth, adminOnly } = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/animals/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// GET all animals (public)
router.get('/', async (req, res) => {
  try {
    const { type, status } = req.query;
    const filter = {};
    if (type)   filter.type = type;
    if (status) filter.status = status;
    const animals = await Animal.find(filter).sort({ createdAt: -1 });
    res.json(animals);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET single animal
router.get('/:id', async (req, res) => {
  try {
    const animal = await Animal.findById(req.params.id);
    if (!animal) return res.status(404).json({ message: 'Not found' });
    res.json(animal);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST create animal (admin)
router.post('/', auth, adminOnly, upload.array('images', 5), async (req, res) => {
  try {
    const images = req.files?.map(f => `/uploads/animals/${f.filename}`) || [];
    const animal = await Animal.create({ ...req.body, images });
    res.status(201).json(animal);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PUT update animal (admin)
router.put('/:id', auth, adminOnly, upload.array('images', 5), async (req, res) => {
  try {
    const update = { ...req.body };
    if (req.files?.length) update.$push = { images: { $each: req.files.map(f => `/uploads/animals/${f.filename}`) } };
    const animal = await Animal.findByIdAndUpdate(req.params.id, update, { new: true });
    res.json(animal);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// DELETE animal (admin)
router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    await Animal.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// ─── LOGS ────────────────────────────────────────────────
router.get('/:id/logs', auth, async (req, res) => {
  const logs = await AnimalLog.find({ animal_id: req.params.id }).sort({ date: -1 });
  res.json(logs);
});

router.post('/:id/logs', auth, adminOnly, async (req, res) => {
  try {
    const log = await AnimalLog.create({ animal_id: req.params.id, ...req.body });
    res.status(201).json(log);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
