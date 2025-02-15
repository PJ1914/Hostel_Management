const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: function(v) {
        return /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(v);
      },
      message: props => `${props.value} is not a valid email address!`
    }
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
  role: {
    type: String,
    enum: ['student', 'admin'],
    default: 'student'
  },
  phoneNumber: {
    type: String,
    required: [true, 'Phone number is required'],
    validate: {
      validator: function(v) {
        return /^\d{10}$/.test(v);
      },
      message: props => `${props.value} is not a valid 10-digit phone number!`
    }
  },
  parentPhoneNumber: {
    type: String,
    required: [true, 'Parent phone number is required'],
    validate: {
      validator: function(v) {
        return /^\d{10}$/.test(v);
      },
      message: props => `${props.value} is not a valid 10-digit phone number!`
    }
  },
  parentEmail: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  roomNumber: String,
  feeStatus: {
    lastPaid: Date,
    nextDue: Date,
    amount: Number
  },
  notificationPreferences: {
    email: {
      type: Boolean,
      default: true
    },
    sms: {
      type: Boolean,
      default: true
    },
    pushNotifications: {
      type: Boolean,
      default: true
    }
  },
  joiningDate: {
    type: Date,
    required: [true, 'Joining date is required'],
    default: Date.now
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'pending'],
    default: 'pending'
  }
}, { timestamps: true });

// Remove password when converting to JSON
userSchema.set('toJSON', {
  transform: function(doc, ret) {
    delete ret.password;
    return ret;
  }
});

// Password hashing middleware
userSchema.pre('save', async function(next) {
  try {
    if (!this.isModified('password')) {
      return next();
    }
    console.log('Hashing password for user:', this.email);
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    console.log('Password hashed successfully');
    next();
  } catch (error) {
    console.error('Error hashing password:', error);
    next(error);
  }
});

// Add method to check password
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

module.exports = mongoose.model('User', userSchema); 