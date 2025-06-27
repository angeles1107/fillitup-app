const mongoose = require('mongoose');

const contributionSchema = new mongoose.Schema({
  goalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Goal', required: true },
  amount: { type: Number, required: true },
  note: { type: String },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Contribution', contributionSchema);
