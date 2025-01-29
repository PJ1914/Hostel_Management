const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Notification = require('./models/Notification');
const Payment = require('./models/Payment');
require('dotenv').config();

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for seeding');

    // Clear existing data
    await User.deleteMany({});
    await Notification.deleteMany({});
    await Payment.deleteMany({});
    console.log('Cleared existing users');

    // Create admin user
    const admin = new User({
      name: 'Admin User',
      email: 'admin@hostel.com',
      password: 'admin123', // Will be hashed by mongoose middleware
      role: 'admin',
      phoneNumber: '1234567890',
      roomNumber: 'A101'
    });

    await admin.save();
    console.log('Admin user created:', admin.email);

    // Create student user
    const student = new User({
      name: 'Student User',
      email: 'student@hostel.com',
      password: 'student123', // Will be hashed by mongoose middleware
      role: 'student',
      phoneNumber: '9876543210',
      roomNumber: 'B202'
    });

    await student.save();
    console.log('Student user created:', student.email);

    // Create notifications
    await Notification.create([
      {
        userId: student._id,
        type: 'payment',
        title: 'Payment Due',
        message: 'Your hostel fee for March 2024 is due',
        isRead: false
      },
      {
        userId: student._id,
        type: 'announcement',
        title: 'Welcome',
        message: 'Welcome to Sreemaan Hostel',
        isRead: false
      }
    ]);

    // Create payments
    await Payment.create([
      {
        userId: student._id,
        amount: 5000,
        paymentType: 'card',
        status: 'completed',
        month: 'February',
        year: 2024,
        transactionId: 'TXN123456'
      }
    ]);

    // Add a test user with upcoming fee due
    const testUser = new User({
      name: 'Test Student',
      email: 'test@example.com',
      parentEmail: 'parent@example.com',
      phoneNumber: '9876543210',
      parentPhoneNumber: '9876543211',
      password: 'test123',
      role: 'student',
      roomNumber: 'A101',
      feeStatus: {
        lastPaid: new Date(),
        nextDue: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        amount: 5000
      }
    });

    await testUser.save();

    console.log('Data seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData(); 