const router  = require('express').Router();
const multer  = require('multer');
const { Animal, AnimalLog } = require('../models');
const { auth, adminOnly }   = require('../middleware/auth');

// ─── Memory storage (works on Railway / any server) ─────
// Images stored as base64 in MongoDB
// No disk needed — no folder permission errors
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB per image
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Images only'));
  },
});

// Convert uploaded files to base64 data URLs
const toBase64 = (files) =>
  (files || []).map(f => `data:${f.mimetype};base64,${f.buffer.toString('base64')}`);

// ─── Routes ─────────────────────────────────────────────

// GET all animals (public)
router.get('/', async (req, res) => {
  try {
    const { type, status } = req.query;
    const filter = {};
    if (type)   filter.type = type;
    if (status) filter.status = status;
    const animals = await Animal.find(filter)
  .sort({ _id: -1 })   // sort خفيف
  .limit(22);          // عدد قليل باش ما يثقلش
    res.json(animals);
  } catch (err) {
    console.error('GET /animals error:', err);
    res.status(500).json({ message: err.message });
  }
});

// GET single animal
router.get('/:id', async (req, res) => {
  try {
    const animal = await Animal.findById(req.params.id);
    if (!animal) return res.status(404).json({ message: 'Not found' });
    res.json(animal);
  } catch (err) {
    console.error('GET /animals/:id error:', err);
    res.status(500).json({ message: err.message });
  }
});

// POST create animal (admin)
router.post('/', auth, adminOnly, upload.array('images', 5), async (req, res) => {
  try {
    const images = toBase64(req.files);
    const animal = await Animal.create({ ...req.body, images });
    res.status(201).json(animal);
  } catch (err) {
    console.error('POST /animals error:', err);
    res.status(500).json({ message: err.message });
  }
});

// PUT update animal (admin)
router.put('/:id', auth, adminOnly, upload.array('images', 5), async (req, res) => {
  try {
    const update = { ...req.body };
    if (req.files?.length) {
      update.images = toBase64(req.files);
    }
    const animal = await Animal.findByIdAndUpdate(req.params.id, update, { new: true });
    res.json(animal);
  } catch (err) {
    console.error('PUT /animals/:id error:', err);
    res.status(500).json({ message: err.message });
  }
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
  try {
    const logs = await AnimalLog.find({ animal_id: req.params.id }).sort({ date: -1 });
    res.json(logs);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/:id/logs', auth, adminOnly, async (req, res) => {
  try {
    const log = await AnimalLog.create({ animal_id: req.params.id, ...req.body });
    res.status(201).json(log);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
