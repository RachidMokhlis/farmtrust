const router = require('express').Router();
const c = require('../controllers/animalsController');
const { auth, adminOnly } = require('../middleware/auth');
router.get('/', c.getAll);
router.post('/', auth, adminOnly, c.create);
router.put('/:id', auth, adminOnly, c.update);
router.delete('/:id', auth, adminOnly, c.remove);
module.exports = router;
