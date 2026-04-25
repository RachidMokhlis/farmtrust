const Promo = require('../models/Promo');

exports.getAll = async (req, res) => {
  try {
    const promos = await Promo.find({ endDate: { $gt: new Date() } }).populate('productId', 'name price');
    res.json(promos);
  } catch (err) { res.status(500).json({ msg: err.message }); }
};

exports.create = async (req, res) => {
  try {
    const promo = await Promo.create(req.body);
    res.json(promo);
  } catch (err) { res.status(500).json({ msg: err.message }); }
};

exports.remove = async (req, res) => {
  try {
    await Promo.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Deleted' });
  } catch (err) { res.status(500).json({ msg: err.message }); }
};
