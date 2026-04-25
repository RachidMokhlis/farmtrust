const Animal = require('../models/Animal');

exports.getAll = async (req, res) => {
  try {
    const animals = await Animal.find();
    res.json(animals);
  } catch (err) { res.status(500).json({ msg: err.message }); }
};

exports.create = async (req, res) => {
  try {
    const animal = await Animal.create(req.body);
    res.json(animal);
  } catch (err) { res.status(500).json({ msg: err.message }); }
};

exports.update = async (req, res) => {
  try {
    const animal = await Animal.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(animal);
  } catch (err) { res.status(500).json({ msg: err.message }); }
};

exports.remove = async (req, res) => {
  try {
    await Animal.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Deleted' });
  } catch (err) { res.status(500).json({ msg: err.message }); }
};
