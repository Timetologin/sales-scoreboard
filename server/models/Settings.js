const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  monthlyTarget: {
    type: Number,
    default: 100,
    min: 0
  },
  currentMonth: {
    type: String,
    default: () => {
      const now = new Date();
      return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
settingsSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Settings', settingsSchema);