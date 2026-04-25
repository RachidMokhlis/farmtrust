const router = require('express').Router();
const c = require('../controllers/chatController');
const { auth } = require('../middleware/auth');
router.get('/history/:userId', auth, c.getHistory);
module.exports = router;
