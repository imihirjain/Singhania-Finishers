// models/Dispatch.js
const mongoose = require('mongoose');

const dispatchSchema = new mongoose.Schema({
    lotNumber: { type: String, required: true },
    party: { type: String, required: true }, // Changed from partyName to party
    quality: { type: String, required: true },
    qualityChallanNumber: { type: String, required: true },
    shade: { type: String, required: true },
    kg: { type: Number, required: true },
    meter: { type: Number, required: true },
    roll: { type: Number, required: true },
    process: { type: String, required: true }, // Changed from processType to process
    karigarName: { type: String, required: true },
    dispatchDate: { type: Date, default: Date.now },
    status: { type: String, default: 'dispatch' }
});

module.exports = mongoose.model('Dispatch', dispatchSchema);
