const router = require('express').Router();
const { auth, adminOnly } = require('../middleware/auth');

// Simple in-memory store (persists as long as server runs)
// For production use a DB field or config collection
let videoData = { url: '' };

router.get('/', (req, res) => {
  res.json(videoData);
});

router.post('/', auth, adminOnly, (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ message: 'URL required' });
  videoData = { url };
  res.json(videoData);
});

module.exports = router;
