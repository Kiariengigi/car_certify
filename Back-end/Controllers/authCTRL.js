const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const User = require('../Models/user');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

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

const client = new OAuth2Client("YOUR_GOOGLE_CLIENT_ID");

exports.googleLogin = async (req, res) => {
  const { token } = req.body; // The token sent from React

  try {
    // 1. Verify the Google Token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: "YOUR_GOOGLE_CLIENT_ID",
    });
    const { email, name, picture, sub } = ticket.getPayload();

    // 2. Check if user exists in YOUR database
    let user = await User.findOne({ email });

    if (!user) {
      // 3. If NOT, create them
      user = await User.create({
        email,
        name,
        picture,
        googleId: sub,
        role: "Buyer", // Default role
        // No password needed
      });
    }

    // 4. Create YOUR app's token (the one you use for protected routes)
    const appToken = jwt.sign(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: "1d" }
    );

    // 5. Send back the user and token
    res.status(200).json({ user, token: appToken });

  } catch (error) {
    res.status(500).json({ message: "Google Login Failed", error: error.message });
  }
};


