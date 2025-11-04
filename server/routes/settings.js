const express = require('express');
const Settings = require('../models/Settings');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/settings/monthly-target
// @desc    Get monthly target
// @access  Private
router.get('/monthly-target', auth, async (req, res) => {
  try {
    let settings = await Settings.findOne({ settingsType: 'global' });
    
    if (!settings) {
      settings = await Settings.create({ settingsType: 'global', monthlyTarget: 0 });
    }
    
    res.json({ monthlyTarget: settings.monthlyTarget });
  } catch (error) {
    console.error('Get monthly target error:', error);
    res.status(500).json({ message: 'Server error fetching monthly target' });
  }
});

// @route   PUT /api/settings/monthly-target
// @desc    Update monthly target (Admin only)
// @access  Private + Admin
router.put('/monthly-target', auth, adminAuth, async (req, res) => {
  try {
    const { monthlyTarget } = req.body;
    
    if (typeof monthlyTarget !== 'number' || monthlyTarget < 0) {
      return res.status(400).json({ message: 'Invalid monthly target value' });
    }
    
    let settings = await Settings.findOne({ settingsType: 'global' });
    
    if (!settings) {
      settings = await Settings.create({ 
        settingsType: 'global', 
        monthlyTarget: monthlyTarget 
      });
    } else {
      settings.monthlyTarget = monthlyTarget;
      await settings.save();
    }
    
    res.json({ monthlyTarget: settings.monthlyTarget });
  } catch (error) {
    console.error('Update monthly target error:', error);
    res.status(500).json({ message: 'Server error updating monthly target' });
  }
});

module.exports = router;