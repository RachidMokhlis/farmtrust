const router = require('express').Router();
const c = require('../controllers/ordersController');
const { auth, adminOnly } = require('../middleware/auth');
router.post('/', auth, c.create);
router.get('/user', auth, c.getUserOrders);
router.get('/all', auth, adminOnly, c.getAll);
router.put('/:id/status', auth, adminOnly, c.updateStatus);
module.exports = router;
