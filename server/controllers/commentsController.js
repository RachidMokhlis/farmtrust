const Comment = require('../models/Comment');

exports.getAll = async (req, res) => {
  try {
    const comments = await Comment.find().populate('userId', 'name').sort({ createdAt: -1 }).limit(5);
    res.json(comments);
  } catch (err) { res.status(500).json({ msg: err.message }); }
};

exports.create = async (req, res) => {
  try {
    const comment = await Comment.create({ ...req.body, userId: req.user.id });
    res.json(comment);
  } catch (err) { res.status(500).json({ msg: err.message }); }
};

exports.remove = async (req, res) => {
  try {
    await Comment.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Deleted' });
  } catch (err) { res.status(500).json({ msg: err.message }); }
};
