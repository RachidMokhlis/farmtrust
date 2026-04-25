const mongoose = require('mongoose');

const AnimalSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  birthDate: { type: Date },
  food: { type: String },
  health: { type: String, default: 'good' },
  images: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Animal', AnimalSchema);
