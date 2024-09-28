const Entry = require('../models/Entry');

// Create a new entry
exports.createEntry = async (req, res) => {
    try {
        const { entries } = req.body;
        if (!entries || !Array.isArray(entries)) {
            return res.status(400).json({ message: 'Invalid data format' });
        }

        const formattedEntries = entries.map(entry => {
            const { partyName, challanNumber, quality, kg, meter, roll } = entry;
            if (!partyName || !challanNumber || !quality || !kg || !meter || !roll) {
                throw new Error('Invalid entry data');
            }
            return {
                partyName,
                challanNumber,
                qualities: [{ quality, kg, meter, roll }]
            };
        });

        const newEntries = await Entry.insertMany(formattedEntries);
        res.status(201).json(newEntries);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get all entries
exports.getEntries = async (req, res) => {
    try {
        const entries = await Entry.find();
        res.status(200).json(entries);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get all parties with their qualities
// exports.getPartiesWithQualities = async (req, res) => {
//     try {
//         const entries = await Entry.find();
//         const parties = {};

//         entries.forEach(entry => {
//             if (!parties[entry.partyName]) {
//                 parties[entry.partyName] = new Set();
//             }
//             entry.qualities.forEach(quality => {
//                 parties[entry.partyName].add(quality.quality);
//             });
//         });

//         const result = Object.keys(parties).map(partyName => ({
//             partyName,
//             qualities: Array.from(parties[partyName])
//         }));

//         res.status(200).json(result);
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// };

// Get all challans for a selected quality within a party
exports.getChallansByQuality = async (req, res) => {
    try {
        console.log('Request received for:', req.params);
        const { partyName, quality } = req.params;
        const entries = await Entry.find({ partyName, 'qualities.quality': quality }, 'challanNumber');

        const challans = entries.map(entry => entry.challanNumber);
        res.status(200).json(challans);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};



// Get a single entry by ID
exports.getEntry = async (req, res) => {
    try {
        const entry = await Entry.findById(req.params.id);
        if (!entry) return res.status(404).json({ message: 'Entry not found' });
        res.status(200).json(entry);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update an entry
exports.updateEntry = async (req, res) => {
    try {
        const { partyName, challanNumber, qualities } = req.body;
        if (!partyName || !challanNumber || !qualities || !Array.isArray(qualities)) {
            return res.status(400).json({ message: 'Invalid data format' });
        }

        const updatedEntry = await Entry.findByIdAndUpdate(req.params.id, { partyName, challanNumber, qualities }, { new: true });
        if (!updatedEntry) return res.status(404).json({ message: 'Entry not found' });
        res.status(200).json(updatedEntry);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete an entry
exports.deleteEntry = async (req, res) => {
    try {
        const deletedEntry = await Entry.findByIdAndDelete(req.params.id);
        if (!deletedEntry) return res.status(404).json({ message: 'Entry not found' });
        res.status(200).json({ message: 'Entry deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get qualities by challan number
exports.getQualitiesByChallanNumber = async (req, res) => {
    try {
        const { challanNumber } = req.params;
        const entries = await Entry.find({ challanNumber: challanNumber });
        if (!entries.length) return res.status(404).json({ message: 'No entries found for this challan number' });
        const qualities = entries.map(entry => entry.qualities).flat();
        res.status(200).json(qualities);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


// Function to fetch all parties
// Function to fetch all parties
exports.getAllParties = async (req, res) => {
    try {
        // Assuming you are using some ORM or ODM like Mongoose with MongoDB
        const entries = await Entry.find(); // Fetch all entries from the database

        // Extract unique party names
        const partyNames = [...new Set(entries.map(entry => entry.partyName))];

        // Construct result with party names only
        const result = partyNames.map(partyName => ({
            partyName
        }));

        // Send the result as JSON response
        res.status(200).json(result);
    } catch (err) {
        // Log the error for debugging purposes
        console.error('Error in getAllParties:', err);

        // Send a meaningful error response
        res.status(500).json({ error: 'Internal server error' });
    }
};


// Function to fetch qualities for a specific party
// Controller method to fetch qualities for a specific party
exports.getQualitiesForParty = async (req, res) => {
    const { partyName } = req.params; // Extract partyName from request parameters

    try {
        // Assuming you are using some ORM or ODM like Mongoose with MongoDB
        const entries = await Entry.find({ partyName }); // Fetch entries for the specific party

        // Extract unique qualities for the party
        const qualities = [...new Set(entries.flatMap(entry => entry.qualities.map(q => q.quality)))];

        // Send the qualities as JSON response
        res.status(200).json({ partyName, qualities });
    } catch (err) {
        // Handle any errors that occur during database fetch or processing
        res.status(500).json({ error: err.message }); // Send error response
    }
};
