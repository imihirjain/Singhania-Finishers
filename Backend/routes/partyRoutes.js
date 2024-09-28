const express = require('express');
const router = express.Router();
const partyController = require('../controller/partyController');

// Route to add quality to a party
router.post('/:partyId/qualities', partyController.addQualityToParty);

// Route to create a new party
router.post('/', partyController.createParty);

// Route to get all parties
router.get('/', partyController.getAllParties);

// Route to get party by ID
router.get('/:partyId', partyController.getPartyById);

// Route to update party details
router.put('/:partyId', partyController.updateParty);

// Route to delete party
router.delete('/:partyId', partyController.deleteParty);

// Route to get all qualities of a party
router.get('/:partyId/qualities', partyController.getAllQualities);

// Route to update a quality of a party
router.put('/:partyId/qualities/:qualityId', partyController.updateQuality);

// Route to delete a quality of a party
router.delete('/:partyId/qualities/:qualityId', partyController.deleteQuality);

module.exports = router;
