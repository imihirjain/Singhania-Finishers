const jwt = require('jsonwebtoken');
const User = require('../models/users');

const loginUser = async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.body.email,
      password: req.body.password,
    });

    if (user) {
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.cookie('token', token, { httpOnly: true, sameSite: 'strict', secure: true });
      res.json({ message: 'Login successful', data: user, token }); // Include the token in the response
    } else {
      res.status(401).send('Invalid Credentials');
    }
  } catch (error) {
    console.log(error);
    res.status(500).send('Server error');
  }
};

const registerUser = async (req, res) => {
  try {
    const newUser = new User(req.body);
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    console.log(error);
    res.status(500).send('Server error');
  }
};

const logoutUser = (req, res) => {
  res.clearCookie('token');
  res.send('Logout successful');
};

const getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (user) {
      res.json({ data: user });
    } else {
      res.status(404).send('User not found');
    }
  } catch (error) {
    console.log(error);
    res.status(500).send('Server error');
  }
};

module.exports = { loginUser, registerUser, logoutUser, getUserDetails };
