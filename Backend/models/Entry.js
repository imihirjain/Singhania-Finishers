const mongoose = require('mongoose');

const QualitySchema = new mongoose.Schema({
    quality: { type: String, required: true },
    kg: { type: Number, required: true },
    meter: { type: Number, required: true },
    roll: { type: Number, required: true }
});

const EntrySchema = new mongoose.Schema({
    partyName: { type: String, required: true },
    challanNumber: { type: String, required: true },
    qualities: { type: [QualitySchema], required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Entry', EntrySchema);
