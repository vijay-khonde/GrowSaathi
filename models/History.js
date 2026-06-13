const mongoose = require('mongoose');

const HistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  queryType: { type: String, enum: ['recommendation', 'disease'], required: true },
  inputDetails: { type: mongoose.Schema.Types.Mixed, required: true },
  responseText: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('History', HistorySchema);
