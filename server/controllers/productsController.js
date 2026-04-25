const Product = require('../models/Product');

exports.getAll = async (req, res) => {
  try {
    const products = await Product.find().populate('animalId', 'name type');
    res.json(products);
  } catch (err) { res.status(500).json({ msg: err.message }); }
};

exports.create = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.json(product);
  } catch (err) { res.status(500).json({ msg: err.message }); }
};

exports.update = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(product);
  } catch (err) { res.status(500).json({ msg: err.message }); }
};

exports.remove = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Deleted' });
  } catch (err) { res.status(500).json({ msg: err.message }); }
};
