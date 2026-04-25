const router = require('express').Router();
const c = require('../controllers/statsController');
const { auth, adminOnly } = require('../middleware/auth');
router.get('/', c.get);
router.put('/', auth, adminOnly, c.update);
module.exports = router;
