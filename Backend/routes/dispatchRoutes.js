// routes/dispatchRoutes.js
const express = require('express');
const router = express.Router();
const dispatchController = require('../controller/dispatchController');

router.post('/dispatch', dispatchController.createDispatch);
router.get('/dispatch', dispatchController.getDispatches);
router.get('/dispatch/:id', dispatchController.getDispatch);
router.put('/dispatch/:id', dispatchController.updateDispatch);
router.delete('/dispatch/:id', dispatchController.deleteDispatch);

module.exports = router;
