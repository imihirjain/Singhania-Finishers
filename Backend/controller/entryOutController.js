const EntryOut = require('../models/EntryOut');
const Dispatch = require('../models/Dispatch');


exports.createEntryOut = async (req, res) => {
    try {
        const { dispatchId, kg, meter, roll } = req.body;
        if (!dispatchId || !kg || !meter || !roll) {
            return res.status(400).json({ message: 'Invalid data format' });
        }

        const dispatch = await Dispatch.findById(dispatchId);
        if (!dispatch) return res.status(404).json({ message: 'Dispatch not found' });

        console.log(`Received kg: ${kg}, dispatch kg: ${dispatch.kg}`);
        console.log(`Received meter: ${meter}, dispatch meter: ${dispatch.meter}`);
        console.log(`Received roll: ${roll}, dispatch roll: ${dispatch.roll}`);

        // Check if entry out values exceed dispatch values
        if (kg > dispatch.kg) {
            return res.status(400).json({ message: 'Entry out kg value exceeds dispatch kg value' });
        }
        if (meter > dispatch.meter) {
            return res.status(400).json({ message: 'Entry out meter value exceeds dispatch meter value' });
        }
        if (roll > dispatch.roll) {
            return res.status(400).json({ message: 'Entry out roll value exceeds dispatch roll value' });
        }

        const entryOut = new EntryOut({
            lotNumber: dispatch.lotNumber,
            party: dispatch.party,
            quality: dispatch.quality,
            qualityChallanNumber: dispatch.qualityChallanNumber,
            kg,
            meter,
            roll
        });

        await entryOut.save();
        res.status(201).json(entryOut);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};



// Get all entryOuts
exports.getEntryOuts = async (req, res) => {
    try {
        const entryOuts = await EntryOut.find();
        res.status(200).json(entryOuts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get a single entryOut
exports.getEntryOut = async (req, res) => {
    try {
        const entryOut = await EntryOut.findById(req.params.id);
        if (!entryOut) return res.status(404).json({ message: 'EntryOut not found' });
        res.status(200).json(entryOut);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update a entryOut
exports.updateEntryOut = async (req, res) => {
    try {
        const { kg, meter, roll } = req.body;
        if (!kg || !meter || !roll) {
            return res.status(400).json({ message: 'Invalid data format' });
        }

        const updatedEntryOut = await EntryOut.findByIdAndUpdate(
            req.params.id,
            { kg, meter, roll },
            { new: true }
        );

        if (!updatedEntryOut) return res.status(404).json({ message: 'EntryOut not found' });
        res.status(200).json(updatedEntryOut);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete a entryOut
exports.deleteEntryOut = async (req, res) => {
    try {
        const deletedEntryOut = await EntryOut.findByIdAndDelete(req.params.id);
        if (!deletedEntryOut) return res.status(404).json({ message: 'EntryOut not found' });
        res.status(200).json({ message: 'EntryOut deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
