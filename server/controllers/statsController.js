const Stats = require('../models/Stats');

exports.get = async (req, res) => {
  try {
    let stats = await Stats.findOne();
    if (!stats) stats = await Stats.create({ animalsCount: 0, farmersCount: 0 });
    res.json(stats);
  } catch (err) { res.status(500).json({ msg: err.message }); }
};

exports.update = async (req, res) => {
  try {
    let stats = await Stats.findOne();
    if (!stats) stats = await Stats.create(req.body);
    else stats = await Stats.findByIdAndUpdate(stats._id, { ...req.body, updatedAt: new Date() }, { new: true });
    res.json(stats);
  } catch (err) { res.status(500).json({ msg: err.message }); }
};
