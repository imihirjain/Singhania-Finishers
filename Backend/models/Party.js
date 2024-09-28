const mongoose = require('mongoose');

const partySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  qualities: [{
    type: String
  }]
});

const Party = mongoose.model('Party', partySchema);

module.exports = Party;
