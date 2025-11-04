const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');

// ============================================
// GET /api/notes - Get user's notes
// ============================================
router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ notes: user.notes || [] });
  } catch (error) {
    console.error('Get notes error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ============================================
// GET /api/notes/all - Get all notes (Admin only)
// ============================================
router.get('/all', protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find({}, 'name email profilePicture notes');
    
    // Format: { userId, userName, userEmail, userAvatar, notes: [...] }
    const allNotes = users
      .filter(user => user.notes && user.notes.length > 0)
      .map(user => ({
        userId: user._id,
        userName: user.name,
        userEmail: user.email,
        userAvatar: user.profilePicture,
        notes: user.notes
      }));
    
    res.json({ allNotes });
  } catch (error) {
    console.error('Get all notes error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ============================================
// POST /api/notes - Create a note
// ============================================
router.post('/', protect, async (req, res) => {
  try {
    const { title, content, color } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }
    
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const newNote = {
      title: title.trim(),
      content: content.trim(),
      color: color || 'blue',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    user.notes.push(newNote);
    user.lastUpdated = Date.now();
    await user.save();
    
    res.status(201).json({ 
      message: 'Note created successfully',
      note: user.notes[user.notes.length - 1]
    });
  } catch (error) {
    console.error('Create note error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ============================================
// PUT /api/notes/:noteId - Update a note
// ============================================
router.put('/:noteId', protect, async (req, res) => {
  try {
    const { noteId } = req.params;
    const { title, content, color } = req.body;
    
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const note = user.notes.id(noteId);
    
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    
    if (title) note.title = title.trim();
    if (content) note.content = content.trim();
    if (color) note.color = color;
    note.updatedAt = new Date();
    
    user.lastUpdated = Date.now();
    await user.save();
    
    res.json({ 
      message: 'Note updated successfully',
      note
    });
  } catch (error) {
    console.error('Update note error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ============================================
// DELETE /api/notes/:noteId - Delete a note
// ============================================
router.delete('/:noteId', protect, async (req, res) => {
  try {
    const { noteId } = req.params;
    
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const note = user.notes.id(noteId);
    
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    
    note.deleteOne();
    user.lastUpdated = Date.now();
    await user.save();
    
    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error('Delete note error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;