const Party = require('../models/Party');

// Controller to add quality to a party
exports.addQualityToParty = async (req, res) => {
  const { partyId } = req.params;
  const { quality } = req.body;

  try {
    const party = await Party.findById(partyId);
    if (!party) {
      return res.status(404).json({ error: 'Party not found' });
    }

    party.qualities.push(quality);
    await party.save();

    res.status(200).json(party);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Controller to create a new party
exports.createParty = async (req, res) => {
  const { name, location, date } = req.body;

  try {
    const party = new Party({ name, location, date });
    await party.save();

    res.status(200).json(party);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Controller to get all parties
exports.getAllParties = async (req, res) => {
  try {
    const parties = await Party.find();
    res.status(200).json(parties);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Controller to get party by ID
exports.getPartyById = async (req, res) => {
  const { partyId } = req.params;

  try {
    const party = await Party.findById(partyId);
    if (!party) {
      return res.status(404).json({ error: 'Party not found' });
    }
    res.status(200).json(party);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Controller to update party details
exports.updateParty = async (req, res) => {
  const { partyId } = req.params;
  const { name, location, date } = req.body;

  try {
    let party = await Party.findById(partyId);
    if (!party) {
      return res.status(404).json({ error: 'Party not found' });
    }

    party.name = name || party.name;
    party.location = location || party.location;
    party.date = date || party.date;

    await party.save();

    res.status(200).json(party);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Controller to delete party
exports.deleteParty = async (req, res) => {
  const { partyId } = req.params;

  try {
    const party = await Party.findByIdAndDelete(partyId);
    if (!party) {
      return res.status(404).json({ error: 'Party not found' });
    }
    res.status(200).json({ message: 'Party deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Controller to get all qualities of a party
exports.getAllQualities = async (req, res) => {
  const { partyId } = req.params;

  try {
    const party = await Party.findById(partyId);
    if (!party) {
      return res.status(404).json({ error: 'Party not found' });
    }

    const qualities = party.qualities;
    res.status(200).json(qualities);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Controller to update a quality of a party
exports.updateQuality = async (req, res) => {
  const { partyId, qualityId } = req.params;
  const { newQuality } = req.body;

  try {
    const party = await Party.findById(partyId);
    if (!party) {
      return res.status(404).json({ error: 'Party not found' });
    }

    const index = party.qualities.findIndex(quality => quality._id.toString() === qualityId);
    if (index === -1) {
      return res.status(404).json({ error: 'Quality not found' });
    }

    party.qualities[index] = newQuality;
    await party.save();

    res.status(200).json(party.qualities[index]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Controller to delete a quality of a party
exports.deleteQuality = async (req, res) => {
  const { partyId, qualityId } = req.params;

  try {
    const party = await Party.findById(partyId);
    if (!party) {
      return res.status(404).json({ error: 'Party not found' });
    }

    const index = party.qualities.findIndex(quality => quality._id.toString() === qualityId);
    if (index === -1) {
      return res.status(404).json({ error: 'Quality not found' });
    }

    party.qualities.splice(index, 1);
    await party.save();

    res.status(200).json({ message: 'Quality deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};