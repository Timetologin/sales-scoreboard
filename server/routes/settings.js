const express = require('express');
const Settings = require('../models/Settings');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/settings/monthly-target
// @desc    Get monthly target
// @access  Private
router.get('/monthly-target', auth, async (req, res) => {
  try {
    // Get or create settings
    let settings = await Settings.findOne();
    
    if (!settings) {
      // Create default settings if not exists
      settings = new Settings({
        monthlyTarget: 100,
        currentMonth: `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`
      });
      await settings.save();
    }
    
    res.json({
      monthlyTarget: settings.monthlyTarget,
      currentMonth: settings.currentMonth
    });
  } catch (error) {
    console.error('Error fetching monthly target:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/settings/monthly-target
// @desc    Update monthly target
// @access  Private (Admin only)
router.put('/monthly-target', auth, adminAuth, async (req, res) => {
  try {
    const { monthlyTarget } = req.body;
    
    if (monthlyTarget === undefined || monthlyTarget < 0) {
      return res.status(400).json({ message: 'Invalid monthly target' });
    }
    
    // Get or create settings
    let settings = await Settings.findOne();
    
    if (!settings) {
      settings = new Settings({
        monthlyTarget,
        currentMonth: `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`
      });
    } else {
      settings.monthlyTarget = monthlyTarget;
    }
    
    await settings.save();
    
    res.json({
      message: 'Monthly target updated successfully',
      monthlyTarget: settings.monthlyTarget,
      currentMonth: settings.currentMonth
    });
  } catch (error) {
    console.error('Error updating monthly target:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;