const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  title: { type: String, required: true },
  targetAmount: { type: Number, required: true },
  imageUrl: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Goal', goalSchema);
