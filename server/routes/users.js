const express = require('express');
const User = require('../models/User');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/users/leaderboard
// @desc    Get all users sorted by FTDs (ascending - lower is better)
// @access  Private
router.get('/leaderboard', auth, async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort({ ftds: 1 }); // 1 = ascending (lower FTDs = better rank)

    const leaderboard = users.map((user, index) => ({
      ...user.getPublicProfile(),
      rank: index + 1
    }));

    res.json(leaderboard);
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({ message: 'Server error fetching leaderboard' });
  }
});

// @route   GET /api/users/profile/:id
// @desc    Get user profile by ID
// @access  Private
router.get('/profile/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get user's rank (lower FTDs = better rank)
    const allUsers = await User.find().sort({ ftds: 1 });
    const rank = allUsers.findIndex(u => u._id.toString() === user._id.toString()) + 1;

    res.json({
      ...user.getPublicProfile(),
      rank
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ message: 'Server error fetching profile' });
  }
});

// @route   PUT /api/users/profile
// @desc    Update own profile
// @access  Private
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, profilePicture } = req.body;
    const user = await User.findById(req.user._id);

    if (name) user.name = name;
    if (profilePicture) user.profilePicture = profilePicture;
    user.lastUpdated = Date.now();

    await user.save();

    res.json(user.getPublicProfile());
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error updating profile' });
  }
});

// @route   PUT /api/users/:id/profile
// @desc    Update user profile (Admin only)
// @access  Private + Admin
router.put('/:id/profile', auth, adminAuth, async (req, res) => {
  try {
    const { name, profilePicture } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (name) user.name = name;
    if (profilePicture) user.profilePicture = profilePicture;
    user.lastUpdated = Date.now();

    await user.save();

    res.json(user.getPublicProfile());
  } catch (error) {
    console.error('Update user profile error:', error);
    res.status(500).json({ message: 'Server error updating user profile' });
  }
});

// @route   PUT /api/users/:id/ftds
// @desc    Update user FTDs (Admin only)
// @access  Private + Admin
router.put('/:id/ftds', auth, adminAuth, async (req, res) => {
  try {
    const { ftds } = req.body;
    
    if (typeof ftds !== 'number' || ftds < 0) {
      return res.status(400).json({ message: 'Invalid FTDs value' });
    }

    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.ftds = ftds;
    user.lastUpdated = Date.now();
    await user.save();

    res.json(user.getPublicProfile());
  } catch (error) {
    console.error('Update FTDs error:', error);
    res.status(500).json({ message: 'Server error updating FTDs' });
  }
});

// @route   POST /api/users/:id/add-ftds
// @desc    Add to user FTDs (Admin only)
// @access  Private + Admin
router.post('/:id/add-ftds', auth, adminAuth, async (req, res) => {
  try {
    const { amount } = req.body;
    
    if (typeof amount !== 'number' || amount < 0) {
      return res.status(400).json({ message: 'Invalid FTDs amount' });
    }

    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.ftds += amount;
    user.lastUpdated = Date.now();
    await user.save();

    res.json(user.getPublicProfile());
  } catch (error) {
    console.error('Add FTDs error:', error);
    res.status(500).json({ message: 'Server error adding FTDs' });
  }
});

// @route   POST /api/users/:id/increment-ftd
// @desc    Add +1 FTD (Admin only)
// @access  Private + Admin
router.post('/:id/increment-ftd', auth, adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.ftds += 1;
    user.lastUpdated = Date.now();
    await user.save();

    res.json(user.getPublicProfile());
  } catch (error) {
    console.error('Increment FTD error:', error);
    res.status(500).json({ message: 'Server error incrementing FTD' });
  }
});

// @route   POST /api/users/:id/increment-plusone
// @desc    Add +1 to Plus Ones counter (Admin only)
// @access  Private + Admin
router.post('/:id/increment-plusone', auth, adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.plusOnes += 1;
    user.lastUpdated = Date.now();
    await user.save();

    res.json(user.getPublicProfile());
  } catch (error) {
    console.error('Increment Plus One error:', error);
    res.status(500).json({ message: 'Server error incrementing Plus One' });
  }
});

// @route   PUT /api/users/:id/plusones
// @desc    Update user Plus Ones (Admin only)
// @access  Private + Admin
router.put('/:id/plusones', auth, adminAuth, async (req, res) => {
  try {
    const { plusOnes } = req.body;
    
    if (typeof plusOnes !== 'number' || plusOnes < 0) {
      return res.status(400).json({ message: 'Invalid Plus Ones value' });
    }

    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.plusOnes = plusOnes;
    user.lastUpdated = Date.now();
    await user.save();

    res.json(user.getPublicProfile());
  } catch (error) {
    console.error('Update Plus Ones error:', error);
    res.status(500).json({ message: 'Server error updating Plus Ones' });
  }
});

// @route   GET /api/users/all
// @desc    Get all users (Admin only)
// @access  Private + Admin
router.get('/all', auth, adminAuth, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users.map(user => user.getPublicProfile()));
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Server error fetching users' });
  }
});

// @route   POST /api/users/create
// @desc    Create new user (Admin only)
// @access  Private + Admin
router.post('/create', auth, adminAuth, async (req, res) => {
  try {
    const { name, email, password, isAdmin } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const user = new User({
      name,
      email,
      password,
      isAdmin: isAdmin || false,
      profilePicture: `https://ui-avatars.com/api/?background=random&name=${encodeURIComponent(name)}`
    });

    await user.save();
    res.status(201).json(user.getPublicProfile());
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ message: 'Server error creating user' });
  }
});

// @route   DELETE /api/users/:id
// @desc    Delete user (Admin only)
// @access  Private + Admin
router.delete('/:id', auth, adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent deleting yourself
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error deleting user' });
  }
});

// @route   POST /api/users/reset-leaderboard
// @desc    Reset all FTDs and Plus Ones to zero (Admin only)
// @access  Private + Admin
router.post('/reset-leaderboard', auth, adminAuth, async (req, res) => {
  try {
    await User.updateMany({}, { ftds: 0, plusOnes: 0, lastUpdated: Date.now() });
    res.json({ message: 'Leaderboard reset successfully' });
  } catch (error) {
    console.error('Reset leaderboard error:', error);
    res.status(500).json({ message: 'Server error resetting leaderboard' });
  }
});

module.exports = router;