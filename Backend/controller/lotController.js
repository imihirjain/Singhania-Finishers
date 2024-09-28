const Lot = require("../models/Lot");
const Entry = require("../models/Entry");

// Generate Lot Number
const generateLotNumber = async () => {
  const currentMonth = new Date()
    .toLocaleString("default", { month: "short" })
    .toUpperCase();
  const startOfMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    1
  );

  let lotNumber;
  let isUnique = false;
  let lotCount = await Lot.countDocuments({
    createdAt: { $gte: startOfMonth },
  });

  while (!isUnique) {
    lotNumber = `${currentMonth}${lotCount + 1}`;
    const existingLot = await Lot.findOne({ lotNumber });
    if (!existingLot) {
      isUnique = true;
    } else {
      lotCount += 1;
    }
  }

  return lotNumber;
};

// Controller function to generate and return a lot number
exports.getGeneratedLotNumber = async (req, res) => {
  try {
    const lotNumber = await generateLotNumber();
    res.status(200).json({ lotNumber });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create new lots
exports.createLot = async (req, res) => {
  try {
    const { lotNumber, entries, submitDate } = req.body;
    if (!entries || !Array.isArray(entries)) {
      return res.status(400).json({ message: "Invalid data format" });
    }

    const firstEntry = entries[0];
    const { partyName, quality, processType, shade } = firstEntry;

    // Check if all entries have the same partyName, quality, processType, and shade
    for (const entry of entries) {
      if (
        entry.partyName !== partyName ||
        entry.quality !== quality ||
        entry.processType !== processType ||
        entry.shade !== shade
      ) {
        return res
          .status(400)
          .json({
            message:
              "All entries must have the same partyName, quality, processType, and shade",
          });
      }
    }

    // Validate unique lot number
    const existingLot = await Lot.findOne({ lotNumber });
    if (existingLot) {
      return res.status(400).json({ message: "Lot number already exists" });
    }

    let status;
    if (processType === "Full") {
      status = "heat";
    } else if (processType === "Half") {
      status = "process";
    } else if (processType === "Finish") {
      status = "finish";
    }

    let totalKg = 0,
      totalMeter = 0,
      totalRoll = 0;

    for (const entry of entries) {
      const { challanNumber, kg, meter, roll } = entry;

      // Validate required fields
      if (!challanNumber || !kg || !meter || !roll) {
        return res
          .status(400)
          .json({ message: "Invalid data format. Missing required fields." });
      }

      // Find the corresponding entry
      const entryData = await Entry.findOne({
        partyName,
        "qualities.quality": quality,
        challanNumber,
      });

      if (!entryData) {
        return res.status(400).json({ message: "Entry data not found" });
      }

      const totalEntryKg = entryData.qualities.reduce(
        (sum, q) => sum + q.kg,
        0
      );
      const totalEntryMeter = entryData.qualities.reduce(
        (sum, q) => sum + q.meter,
        0
      );
      const totalEntryRoll = entryData.qualities.reduce(
        (sum, q) => sum + q.roll,
        0
      );

      if (kg > totalEntryKg) {
        return res
          .status(400)
          .json({ message: "Lot kg value exceeds entry kg value" });
      }
      if (meter > totalEntryMeter) {
        return res
          .status(400)
          .json({ message: "Lot meter value exceeds entry meter value" });
      }
      if (roll > totalEntryRoll) {
        return res
          .status(400)
          .json({ message: "Lot roll value exceeds entry roll value" });
      }

      totalKg += kg;
      totalMeter += meter;
      totalRoll += roll;
    }

    const newLot = new Lot({
      lotNumber,
      partyName,
      quality,
      shade,
      processType,
      status,
      entries, // Store the entries array directly
      createdAt: new Date(),
      submitDate: submitDate || Date.now(), // Set submit date
    });

    await newLot.save();

    res.status(201).json(newLot);
  } catch (err) {
    console.error("Error creating lot:", err); // Log the error
    res.status(500).json({ error: err.message });
  }
};

// Get all lots
exports.getLots = async (req, res) => {
  try {
    const lots = await Lot.find();
    res.status(200).json(lots);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get lots by status
exports.getLotsByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const lots = await Lot.find({ status });
    res.status(200).json(lots);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single lot by ID
exports.getLot = async (req, res) => {
  try {
    const lot = await Lot.findById(req.params.id);
    if (!lot) return res.status(404).json({ message: "Lot not found" });
    res.status(200).json(lot);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a lot
exports.updateLot = async (req, res) => {
  try {
    const { partyName, quality, shade, processType, entries, submitDate } =
      req.body;
    console.log("Update Request Data:", req.body);

    if (!partyName || !quality || !shade || !entries || !processType) {
      console.log("Invalid data format");
      return res.status(400).json({ message: "Invalid data format" });
    }

    let status;
    if (processType === "Full") {
      status = "heat";
    } else if (processType === "Half") {
      status = "process";
    } else if (processType === "Finish") {
      status = "finish";
    }

    const updatedLot = await Lot.findByIdAndUpdate(
      req.params.id,
      {
        partyName,
        quality,
        shade,
        processType,
        status,
        entries,
        submitDate: submitDate || Date.now(),
      },
      { new: true }
    );

    if (!updatedLot) {
      console.log("Lot not found");
      return res.status(404).json({ message: "Lot not found" });
    }
    console.log("Updated Lot:", updatedLot);
    res.status(200).json(updatedLot);
  } catch (err) {
    console.error("Error updating lot:", err);
    res.status(500).json({ error: err.message });
  }
};

// Delete a lot
exports.deleteLot = async (req, res) => {
  try {
    const deletedLot = await Lot.findByIdAndDelete(req.params.id);
    if (!deletedLot) return res.status(404).json({ message: "Lot not found" });
    res.status(200).json({ message: "Lot deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get party names and qualities
exports.getPartyNamesAndQualities = async (req, res) => {
  try {
    const entries = await Entry.find();
    const parties = entries.map((entry) => ({
      partyName: entry.partyName,
      qualities: entry.qualities.map((quality) => quality.quality),
    }));
    res.status(200).json(parties);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get qualities by party name
exports.getQualitiesByPartyName = async (req, res) => {
  try {
    const { partyName } = req.params;
    const entries = await Entry.find({ partyName });
    if (!entries.length)
      return res
        .status(404)
        .json({ message: "No entries found for this party name" });
    const qualities = entries.map((entry) => entry.qualities).flat();
    res.status(200).json(qualities);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update lot status
exports.updateLotStatus = async (req, res) => {
  try {
    const { lotId, status } = req.body;
    if (!lotId || !status) {
      return res.status(400).json({ message: "Invalid data format" });
    }

    const lot = await Lot.findById(lotId);
    if (!lot) return res.status(404).json({ message: "Lot not found" });

    if (status === "complete") {
      if (lot.processType === "Full" && lot.status === "heat") {
        lot.status = "process";
      } else if (lot.processType === "Full" && lot.status === "process") {
        lot.status = "finish";
      } else if (lot.processType === "Full" && lot.status === "finish") {
        lot.status = "dispatch";
      } else if (lot.processType === "Half" && lot.status === "process") {
        lot.status = "finish";
      } else if (lot.processType === "Half" && lot.status === "finish") {
        lot.status = "dispatch";
      } else if (lot.processType === "Finish" && lot.status === "finish") {
        lot.status = "dispatch";
      }
    }

    await lot.save();
    res.status(200).json(lot);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get lots by process type
exports.getLotsByProcessType = async (req, res) => {
  try {
    const { processType } = req.params;
    const lots = await Lot.find({ processType });
    res.status(200).json(lots);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Fetch lots marked as complete for 'heat'
exports.getCompletedHeatLots = async (req, res) => {
  try {
    const lots = await Lot.find({
      status: { $in: ["process", "finish", "dispatch"] },
      processType: "Full",
    });
    res.status(200).json(lots);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Fetch lots marked as complete for 'process'
exports.getCompletedProcessLots = async (req, res) => {
  try {
    const lots = await Lot.find({
      status: { $in: ["finish", "dispatch"] },
      processType: { $in: ["Full", "Half"] },
    });
    res.status(200).json(lots);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Fetch lots marked as complete for 'finish'
exports.getCompletedFinishLots = async (req, res) => {
  try {
    const lots = await Lot.find({
      status: { $in: ["dispatch"] },
      processType: { $in: ["Full", "Half", "Finish"] },
    });
    res.status(200).json(lots);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
