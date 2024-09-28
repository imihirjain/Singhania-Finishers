const mongoose = require('mongoose');

const entryOutSchema = new mongoose.Schema({
    lotNumber: { type: String, required: true },
    party: { type: String, required: true },
    quality: { type: String, required: true },
    qualityChallanNumber: { type: String, required: true },
    kg: { type: Number, required: true },
    meter: { type: Number, required: true },
    roll: { type: Number, required: true },
    entryOutDate: { type: Date, default: Date.now },
    status: { type: String, default: 'entryOut' }
});

module.exports = mongoose.model('EntryOut', entryOutSchema);
