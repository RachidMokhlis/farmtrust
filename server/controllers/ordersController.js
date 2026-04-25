const Order = require('../models/Order');
const User = require('../models/User');

exports.create = async (req, res) => {
  try {
    const { products, totalPrice } = req.body;
    const pointsEarned = Math.floor(totalPrice / 10);
    const order = await Order.create({ userId: req.user.id, products, totalPrice, pointsEarned });
    await User.findByIdAndUpdate(req.user.id, { $inc: { points: pointsEarned } });
    res.json(order);
  } catch (err) { res.status(500).json({ msg: err.message }); }
};

exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).populate('products.productId', 'name price');
    res.json(orders);
  } catch (err) { res.status(500).json({ msg: err.message }); }
};

exports.getAll = async (req, res) => {
  try {
    const orders = await Order.find().populate('userId', 'name email').populate('products.productId', 'name price');
    res.json(orders);
  } catch (err) { res.status(500).json({ msg: err.message }); }
};

exports.updateStatus = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json(order);
  } catch (err) { res.status(500).json({ msg: err.message }); }
};
