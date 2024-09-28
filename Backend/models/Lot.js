const mongoose = require('mongoose');

const entrySchema = new mongoose.Schema({
  challanNumber: { type: String, required: true },
  kg: { type: Number, required: true },
  meter: { type: Number, required: true },
  roll: { type: Number, required: true }
});

const lotSchema = new mongoose.Schema({
  lotNumber: { type: String, unique: true },
  partyName: { type: String, required: true },
  quality: { type: String, required: true },
  shade: { type: String, required: true },
  processType: { type: String, required: true },
  status: { type: String, default: 'heat' }, // Default status for 'Full' processType
  entries: [entrySchema], // Array of entries
  createdAt: { type: Date, default: Date.now },
  submitDate: { type: Date } // New field for submit date
});

module.exports = mongoose.model('Lot', lotSchema);
