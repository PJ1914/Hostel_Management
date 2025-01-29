const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');
const debug = require('debug')('app:auth');
const Notification = require('../models/Notification');

// Register
router.post('/register', async (req, res) => {
  try {
    // Log the entire request body
    console.log('Registration request received:', {
      ...req.body,
      password: '[HIDDEN]'
    });

    const {
      name,
      email,
      password,
      phoneNumber,
      parentPhoneNumber,
      parentEmail,
      roomNumber,
      joiningDate,
      role = 'student'
    } = req.body;

    // Validate required fields
    const requiredFields = {
      name,
      email,
      password,
      phoneNumber,
      parentPhoneNumber,
      parentEmail,
      roomNumber
    };

    for (const [field, value] of Object.entries(requiredFields)) {
      if (!value) {
        return res.status(400).json({ 
          message: `${field} is required`,
          field
        });
      }
    }

    // Check if user exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Create user object
    const user = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password, // Will be hashed by mongoose middleware
      phoneNumber: phoneNumber.trim(),
      parentPhoneNumber: parentPhoneNumber.trim(),
      parentEmail: parentEmail.toLowerCase().trim(),
      roomNumber: roomNumber.trim(),
      joiningDate: joiningDate ? new Date(joiningDate) : new Date(),
      role,
      status: 'pending',
      feeStatus: {
        lastPaid: new Date(),
        nextDue: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        amount: 5000
      }
    });

    // Save user
    await user.save();
    console.log('User saved successfully:', user._id);

    // Create notification
    try {
      const notification = await Notification.create({
        userId: user._id,
        type: 'welcome',
        title: 'Welcome to Hostel',
        message: `Welcome ${user.name}! Your registration is pending approval.`,
        isRead: false
      });
      console.log('Created welcome notification:', notification._id);
    } catch (notifError) {
      console.error('Error creating notification:', notifError);
      // Don't fail registration if notification fails
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Send success response
    return res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    
    // Check for specific MongoDB errors
    if (error.code === 11000) {
      return res.status(400).json({
        message: 'Email already exists'
      });
    }

    // Check for validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        message: messages.join(', ')
      });
    }

    // Generic error response
    return res.status(500).json({
      message: 'Registration failed. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt with:', { email, password: '****' });

    // Validate input
    if (!email || !password) {
      console.log('Missing credentials');
      return res.status(400).json({ 
        message: 'Email and password are required'
      });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    console.log('User found:', user ? 'Yes' : 'No');
    
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    console.log('Comparing passwords...');
    const isMatch = await bcrypt.compare(password.trim(), user.password);
    console.log('Password match:', isMatch);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { 
        userId: user._id,
        role: user.role 
      },
      process.env.JWT_SECRET,
      { 
        expiresIn: '24h'
      }
    );

    console.log('Login successful');
    res.json({ 
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router; 