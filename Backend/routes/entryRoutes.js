const express = require('express');
const router = express.Router();
const entryController = require('../controller/entryController');

router.post('/entries', entryController.createEntry);
router.get('/entries', entryController.getEntries);
router.get('/entries/:id', entryController.getEntry);
router.put('/entries/:id', entryController.updateEntry);
router.delete('/entries/:id', entryController.deleteEntry);
router.get('/entries/challan/:challanNumber', entryController.getQualitiesByChallanNumber);

// New routes
// router.get('/parties', entryController.getPartiesWithQualities);


// router.get('/parties/:partyName/qualities/:quality/challans', entryController.getChallansByQuality);
router.get('/parties/:partyName/qualities/:quality/challans', entryController.getChallansByQuality);

router.get('/parties', entryController.getAllParties);

router.get('/parties/:partyName/qualities', entryController.getQualitiesForParty);



module.exports = router;
