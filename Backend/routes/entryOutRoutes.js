const express = require('express');
const router = express.Router();
const entryOutController = require('../controller/entryOutController');

router.post('/entryOut', entryOutController.createEntryOut);
router.get('/entryOut', entryOutController.getEntryOuts);
router.get('/entryOut/:id', entryOutController.getEntryOut);
router.put('/entryOut/:id', entryOutController.updateEntryOut);
router.delete('/entryOut/:id', entryOutController.deleteEntryOut);

module.exports = router;
