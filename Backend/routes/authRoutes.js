const express = require('express');
const { loginUser, registerUser, logoutUser, getUserDetails } = require('../controller/authController');
const verifyToken = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/login', loginUser);
router.post('/register', registerUser);
router.get('/logout', logoutUser);
router.get('/user', verifyToken, getUserDetails); // Apply the middleware to this route


module.exports = router;
