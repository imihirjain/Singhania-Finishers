const Dispatch = require('../models/Dispatch');
const Lot = require('../models/Lot');

// Create new dispatch entry

exports.createDispatch = async (req, res) => {
    try {
        const { lotId, karigarName, kg, meter, roll, qualityChallanNumber, process, shade } = req.body;
        if (!lotId || !karigarName || !kg || !meter || !roll || !qualityChallanNumber || !process || !shade) {
            return res.status(400).json({ message: 'Invalid data format' });
        }

        const lot = await Lot.findById(lotId);
        if (!lot) return res.status(404).json({ message: 'Lot not found' });

        // Check if dispatch values exceed lot values
        const lotTotalKg = lot.entries.reduce((sum, entry) => sum + entry.kg, 0);
        const lotTotalMeter = lot.entries.reduce((sum, entry) => sum + entry.meter, 0);
        const lotTotalRoll = lot.entries.reduce((sum, entry) => sum + entry.roll, 0);

        if (kg > lotTotalKg) {
            return res.status(400).json({ message: 'Dispatch kg value exceeds lot kg value' });
        }
        if (meter > lotTotalMeter) {
            return res.status(400).json({ message: 'Dispatch meter value exceeds lot meter value' });
        }
        if (roll > lotTotalRoll) {
            return res.status(400).json({ message: 'Dispatch roll value exceeds lot roll value' });
        }

        const dispatchEntry = new Dispatch({
            lotNumber: lot.lotNumber,
            party: lot.partyName,
            quality: lot.quality,
            qualityChallanNumber,
            shade,
            kg,
            meter,
            roll,
            process,
            karigarName
        });

        await dispatchEntry.save();
        res.status(201).json(dispatchEntry);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


// Get all dispatch entries
exports.getDispatches = async (req, res) => {
    try {
        const dispatches = await Dispatch.find();
        res.status(200).json(dispatches);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get a single dispatch entry
exports.getDispatch = async (req, res) => {
    try {
        const dispatch = await Dispatch.findById(req.params.id);
        if (!dispatch) return res.status(404).json({ message: 'Dispatch not found' });
        res.status(200).json(dispatch);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update a dispatch entry
exports.updateDispatch = async (req, res) => {
    try {
        const { karigarName, kg, meter, roll } = req.body;
        if (!karigarName || !kg || !meter || !roll) {
            return res.status(400).json({ message: 'Invalid data format' });
        }

        const updatedDispatch = await Dispatch.findByIdAndUpdate(
            req.params.id,
            { karigarName, kg, meter, roll },
            { new: true }
        );

        if (!updatedDispatch) return res.status(404).json({ message: 'Dispatch not found' });
        res.status(200).json(updatedDispatch);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete a dispatch entry
exports.deleteDispatch = async (req, res) => {
    try {
        const deletedDispatch = await Dispatch.findByIdAndDelete(req.params.id);
        if (!deletedDispatch) return res.status(404).json({ message: 'Dispatch not found' });
        res.status(200).json({ message: 'Dispatch deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
