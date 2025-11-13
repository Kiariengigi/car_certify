const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const User = require('../Models/user');
const jwt = require('jsonwebtoken');

const generateToken = (userId) => 
  jwt.sign({ id: userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

// --- SIGN UP ---
exports.signUp = async (req, res) => {
  try {
    const { email, password, role, createdAt } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    const newUser = new User({ email, password, role, createdAt });
    await newUser.save();

    const token = generateToken(newUser._id);

    console.log("New user created:", email);

    res.status(201).json({
      message: "User created successfully",
      token,
      user: {
        id: newUser._id,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// --- LOGIN ---
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(401).json({ message: 'No user with that email' });

    const isMatch = await user.matchpass(password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = generateToken(user._id);
    const { password: _, ...userData } = user.toObject();

    res.status(200).json({
      message: 'Login successful',
      token,
      user: userData,
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: err.message });
  }
};
