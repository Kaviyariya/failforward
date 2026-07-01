import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../models/User.js';

const router = express.Router();

let fallbackUsers = [
  { id: 'u1', name: 'Kaviya', email: 'kaviya@gmail.com', password: 'password123' }
];

const isMongoConnected = () => mongoose.connection.readyState === 1;

// @route   POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    let user = null;
    let isOffline = !isMongoConnected();

    if (!isOffline) {
      try {
        user = await User.findOne({ email }).maxTimeMS(1500);
      } catch (dbErr) {
        isOffline = true;
      }
    }

    if (!user) {
      user = fallbackUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    }

    if (user) {
      return res.status(400).json({ message: 'User already exists with this email address' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let userId = 'local_' + Date.now();
    if (!isOffline) {
      try {
        const newUser = new User({ name, email, password: hashedPassword });
        const saved = await newUser.save();
        userId = saved.id || saved._id;
      } catch (err) {
        isOffline = true;
      }
    }
    if (isOffline) {
      fallbackUsers.push({ id: userId, name, email, password: hashedPassword, plaintext: password });
    }

    const payload = { user: { id: userId, name } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' }, (err, token) => {
      if (err) throw err;
      res.json({ token, user: { id: userId, name, email } });
    });
  } catch (error) {
    console.error("Register error:", error.message);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// @route   POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = null;
    if (isMongoConnected()) {
      try {
        user = await User.findOne({ email: new RegExp(`^${email}$`, 'i') }).maxTimeMS(1500);
      } catch (dbErr) {
        // Fallback
      }
    }
    if (!user) {
      user = fallbackUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    }

    if (!user) {
      return res.status(400).json({ message: 'Account not found. Please click "Sign Up" below to create an account!' });
    }

    let isMatch = false;
    try {
      isMatch = await bcrypt.compare(password, user.password);
    } catch (e) {}

    if (!isMatch && (password === user.password || password === user.plaintext)) {
      isMatch = true;
    }

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials. Incorrect password.' });
    }

    const payload = { user: { id: user.id || user._id, name: user.name } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' }, (err, token) => {
      if (err) throw err;
      res.json({ token, user: { id: user.id || user._id, name: user.name, email: user.email } });
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ message: 'Server error during login' });
  }
});

export const protect = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// @route   GET /api/auth/me
router.get('/me', protect, async (req, res) => {
  try {
    let user = null;
    if (isMongoConnected() && /^[0-9a-fA-F]{24}$/.test(req.user.id)) {
      try {
        user = await User.findById(req.user.id).select('-password').maxTimeMS(1500);
      } catch (err) {}
    }
    if (!user) {
      user = fallbackUsers.find(u => (u.id || u._id).toString() === req.user.id.toString());
    }
    res.json(user || { id: req.user.id, name: req.user.name || 'Developer', email: 'user@local.dev' });
  } catch (error) {
    res.status(500).send('Server Error');
  }
});

export default router;
