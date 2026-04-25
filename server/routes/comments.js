const router = require('express').Router();
const c = require('../controllers/commentsController');
const { auth, adminOnly } = require('../middleware/auth');
router.get('/', c.getAll);
router.post('/', auth, c.create);
router.delete('/:id', auth, adminOnly, c.remove);
module.exports = router;
