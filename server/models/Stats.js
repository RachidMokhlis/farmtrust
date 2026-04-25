const mongoose = require('mongoose');

const StatsSchema = new mongoose.Schema({
  animalsCount: { type: Number, default: 0 },
  farmersCount: { type: Number, default: 0 },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Stats', StatsSchema);
