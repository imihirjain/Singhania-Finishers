const express = require('express');
const router = express.Router();
const lotController = require('../controller/lotController');

router.post('/lots', lotController.createLot);
router.get('/lots', lotController.getLots);
router.get('/lots/status/:status', lotController.getLotsByStatus); // Ensure this line is included
router.get('/lots/:id', lotController.getLot);
router.put('/lots/:id', lotController.updateLot);
router.delete('/lots/:id', lotController.deleteLot);
router.post('/lots/status', lotController.updateLotStatus);
router.get('/generate-lot-number', lotController.getGeneratedLotNumber);

// New route for fetching lots by process type
router.get('/lots/process/:processType', lotController.getLotsByProcessType);
// New routes to get completed lots by specific status
router.get('/lots/completed/heat', lotController.getCompletedHeatLots);
router.get('/lots/completed/process', lotController.getCompletedProcessLots);
router.get('/lots/completed/finish', lotController.getCompletedFinishLots);


module.exports = router;
