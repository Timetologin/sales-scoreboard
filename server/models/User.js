const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  profilePicture: {
    type: String,
    default: 'https://ui-avatars.com/api/?background=random&name='
  },
  ftds: {
    type: Number,
    default: 0,
    min: 0
  },
  plusOnes: {
    type: Number,
    default: 0,
    min: 0
  },
  // ⭐ Target system fields
  dailyTarget: {
    type: Number,
    default: 0,
    min: 0
  },
  dailyFTDs: {
    type: Number,
    default: 0,
    min: 0
  },
  todayFTDs: {
    type: Number,
    default: 0,
    min: 0
  },
  lastResetDate: {
    type: String,
    default: function() {
      return new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Jerusalem' });
    }
  },
  lastDailyReset: {
    type: Date,
    default: Date.now
  },
  dailyTargetAchieved: {
    type: Boolean,
    default: false
  },
  monthlyTargetAchieved: {
    type: Boolean,
    default: false
  },
  totalDaysAchieved: {
    type: Number,
    default: 0,
    min: 0
  },
  currentStreak: {
    type: Number,
    default: 0,
    min: 0
  },
  longestStreak: {
    type: Number,
    default: 0,
    min: 0
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  // Hash password if modified
  if (this.isModified('password')) {
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    } catch (error) {
      return next(error);
    }
  }
  
  // ⭐ Check and reset todayFTDs at midnight (Israel time)
  const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Jerusalem' });
  if (this.lastResetDate !== today) {
    this.todayFTDs = 0;
    this.lastResetDate = today;
    this.dailyTargetAchieved = false;
  }
  
  next();
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to get public profile
userSchema.methods.getPublicProfile = function() {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    profilePicture: this.profilePicture,
    ftds: this.ftds,
    plusOnes: this.plusOnes,
    dailyTarget: this.dailyTarget,
    dailyFTDs: this.dailyFTDs,
    todayFTDs: this.todayFTDs,
    lastResetDate: this.lastResetDate,
    lastDailyReset: this.lastDailyReset,
    dailyTargetAchieved: this.dailyTargetAchieved,
    monthlyTargetAchieved: this.monthlyTargetAchieved,
    totalDaysAchieved: this.totalDaysAchieved,
    currentStreak: this.currentStreak,
    longestStreak: this.longestStreak,
    isAdmin: this.isAdmin,
    createdAt: this.createdAt,
    lastUpdated: this.lastUpdated
  };
};

module.exports = mongoose.model('User', userSchema);