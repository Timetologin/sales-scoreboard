import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { usersAPI, notesAPI } from '../services/api';
import { User, Mail, Trophy, Target, Calendar, Edit2, Save, X, Award, Image, Upload, Flame, FileText, Plus, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Image compression function
const compressImage = (file, maxWidth = 200, maxHeight = 200, quality = 0.7) => {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      reject(new Error('Invalid file'));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read file'));

    reader.onload = (event) => {
      const img = new globalThis.Image();
      img.onerror = () => reject(new Error('Failed to load image'));

      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Failed to compress image'));
              return;
            }

            const compressedReader = new FileReader();
            compressedReader.onerror = () => reject(new Error('Failed to read compressed image'));
            compressedReader.onloadend = () => resolve(compressedReader.result);
            compressedReader.readAsDataURL(blob);
          },
          'image/jpeg',
          quality
        );
      };

      img.src = event.target.result;
    };

    reader.readAsDataURL(file);
  });
};

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    profilePicture: '',
  });
  const [saving, setSaving] = useState(false);
  
  // States for image upload
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [showImageOptions, setShowImageOptions] = useState(false);

  // ⭐ NEW: Notes states
  const [notes, setNotes] = useState([]);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [noteForm, setNoteForm] = useState({ title: '', content: '', color: 'blue' });
  const [notesLoading, setNotesLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchNotes();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const response = await usersAPI.getProfile(user.id);
      setProfile(response.data);
      setFormData({
        name: response.data.name,
        profilePicture: response.data.profilePicture,
      });
      setImagePreview(response.data.profilePicture);
    } catch (err) {
      console.error('Failed to fetch profile:', err);
    } finally {
      setLoading(false);
    }
  };

  // ⭐ NEW: Fetch notes
  const fetchNotes = async () => {
    try {
      const response = await notesAPI.getMyNotes();
      setNotes(response.data.notes || []);
    } catch (err) {
      console.error('Failed to fetch notes:', err);
    }
  };

  // ⭐ NEW: Create/Update note
  const handleSaveNote = async () => {
    if (!noteForm.title.trim() || !noteForm.content.trim()) {
      alert('Please fill in both title and content');
      return;
    }

    setNotesLoading(true);
    try {
      if (editingNote) {
        await notesAPI.updateNote(editingNote._id, noteForm);
      } else {
        await notesAPI.createNote(noteForm);
      }
      await fetchNotes();
      setShowNoteModal(false);
      setNoteForm({ title: '', content: '', color: 'blue' });
      setEditingNote(null);
    } catch (err) {
      console.error('Failed to save note:', err);
      alert('Failed to save note');
    } finally {
      setNotesLoading(false);
    }
  };

  // ⭐ NEW: Delete note
  const handleDeleteNote = async (noteId) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;

    try {
      await notesAPI.deleteNote(noteId);
      await fetchNotes();
    } catch (err) {
      console.error('Failed to delete note:', err);
      alert('Failed to delete note');
    }
  };

  // ⭐ NEW: Open edit note modal
  const handleEditNote = (note) => {
    setEditingNote(note);
    setNoteForm({
      title: note.title,
      content: note.content,
      color: note.color
    });
    setShowNoteModal(true);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const compressedImage = await compressImage(file);
      setFormData({ ...formData, profilePicture: compressedImage });
      setImagePreview(compressedImage);
    } catch (err) {
      console.error('Failed to process image:', err);
      alert('❌ Failed to process image: ' + err.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleUrlChange = (url) => {
    setFormData({ ...formData, profilePicture: url });
    setImagePreview(url);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await usersAPI.updateProfile(formData);
      setProfile(response.data);
      updateUser(response.data);
      setEditing(false);
      setShowImageOptions(false);
    } catch (err) {
      console.error('Failed to update profile:', err);
      alert('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: profile.name,
      profilePicture: profile.profilePicture,
    });
    setImagePreview(profile.profilePicture);
    setEditing(false);
    setShowImageOptions(false);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // ⭐ NEW: Get color classes
  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-900/40 border-blue-500',
      green: 'bg-green-900/40 border-green-500',
      purple: 'bg-purple-900/40 border-purple-500',
      orange: 'bg-orange-900/40 border-orange-500'
    };
    return colors[color] || colors.blue;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-tiger-orange mx-auto mb-4"></div>
          <p className="text-tiger-orange font-semibold">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-tiger-orange font-semibold">Profile not found</p>
        </div>
      </div>
    );
  }

  const dailyProgress = profile.dailyTarget > 0 
    ? ((profile.todayFTDs || 0) / profile.dailyTarget) * 100 
    : 0;
  const dailyAchieved = (profile.todayFTDs || 0) >= profile.dailyTarget && profile.dailyTarget > 0;

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left/Main Column - Profile */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card-alpha prowl-effect"
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <h1 className="text-4xl font-extrabold alpha-text">My Profile</h1>
                {!editing ? (
                  <button
                    onClick={() => setEditing(true)}
                    className="btn-alpha flex items-center gap-2"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="btn-alpha flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      {saving ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      onClick={handleCancel}
                      className="btn-secondary flex items-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              {/* Profile Info */}
              <div className="grid md:grid-cols-3 gap-6">
                {/* Left Column - Avatar and Basic Info */}
                <div className="md:col-span-1">
                  <div className="text-center">
                    {/* Avatar */}
                    <div className="relative inline-block mb-4">
                      <img
                        src={imagePreview || formData.profilePicture}
                        alt={profile.name}
                        className="w-40 h-40 rounded-full mx-auto object-cover border-4 border-tiger-orange shadow-xl"
                      />
                      {editing && (
                        <button
                          onClick={() => setShowImageOptions(!showImageOptions)}
                          className="absolute bottom-0 right-0 bg-tiger-orange hover:bg-orange-600 text-white p-3 rounded-full shadow-lg transition-all prowl-effect"
                          title="Change Picture"
                        >
                          <Image className="w-5 h-5" />
                        </button>
                      )}
                    </div>

                    {/* Image upload options */}
                    {editing && showImageOptions && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-4 p-4 bg-tiger-orange/20 rounded-lg border-2 border-tiger-orange"
                      >
                        <h3 className="text-sm font-bold text-tiger-yellow mb-3">
                          📸 Change Profile Picture
                        </h3>
                        
                        {/* Upload File */}
                        <div className="mb-3">
                          <label className="block w-full">
                            <div className="btn-alpha flex items-center justify-center gap-2 cursor-pointer text-sm py-2">
                              <Upload className="w-4 h-4" />
                              {uploadingImage ? 'Processing...' : 'Upload Image'}
                            </div>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleFileUpload}
                              className="hidden"
                              disabled={uploadingImage}
                            />
                          </label>
                          <p className="text-xs text-orange-300 mt-1">
                            Auto-compressed for optimal performance
                          </p>
                        </div>

                        {/* Divider */}
                        <div className="relative my-3">
                          <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-tiger-orange"></div>
                          </div>
                          <div className="relative flex justify-center text-xs">
                            <span className="px-2 bg-gray-800 text-tiger-yellow">OR</span>
                          </div>
                        </div>

                        {/* URL Input */}
                        <div>
                          <label className="block text-xs font-bold text-tiger-orange mb-2">
                            🔗 Enter Image URL
                          </label>
                          <input
                            type="text"
                            value={formData.profilePicture}
                            onChange={(e) => handleUrlChange(e.target.value)}
                            className="input-field text-sm"
                            placeholder="https://example.com/image.jpg"
                          />
                        </div>
                      </motion.div>
                    )}

                    {/* Rank Badge */}
                    <div className="inline-block">
                      <div
                        className={
                          profile.rank === 1
                            ? 'alpha-badge text-2xl'
                            : 'tiger-badge text-xl'
                        }
                      >
                        Rank #{profile.rank}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Details */}
                <div className="md:col-span-2 space-y-6">
                  {/* Name */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-bold text-tiger-orange mb-2">
                      <User className="w-4 h-4" />
                      Full Name
                    </label>
                    {editing ? (
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="input-field"
                      />
                    ) : (
                      <p className="text-2xl font-bold text-tiger-yellow">{profile.name}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-bold text-tiger-orange mb-2">
                      <Mail className="w-4 h-4" />
                      Email Address
                    </label>
                    <p className="text-lg text-orange-100">{profile.email}</p>
                  </div>

                  {/* Daily Target Section */}
                  {profile.dailyTarget > 0 && (
                    <div className="p-4 bg-gradient-to-r from-blue-900/40 to-purple-900/40 rounded-lg border-2 border-blue-500">
                      <label className="flex items-center gap-2 text-sm font-bold text-blue-300 mb-3">
                        <Target className="w-5 h-5" />
                        My Daily Target
                      </label>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-3xl font-extrabold text-blue-300">
                            {profile.todayFTDs || 0} / {profile.dailyTarget}
                          </span>
                          <span className="text-sm font-bold text-blue-400">
                            {dailyProgress.toFixed(0)}%
                          </span>
                        </div>

                        <div className="relative h-6 bg-gray-800 rounded-full overflow-hidden border-2 border-blue-500">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(dailyProgress, 100)}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className={`h-full ${
                              dailyAchieved 
                                ? 'bg-gradient-to-r from-green-400 to-green-600' 
                                : 'bg-gradient-to-r from-blue-500 to-purple-600'
                            }`}
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-white font-bold text-xs drop-shadow-lg">
                              {profile.todayFTDs || 0} FTDs Today
                            </span>
                          </div>
                        </div>

                        {dailyAchieved && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center"
                          >
                            <p className="text-lg font-extrabold text-green-400 flex items-center justify-center gap-2">
                              🎉 Daily Target Achieved! 🎉
                            </p>
                          </motion.div>
                        )}

                        {!dailyAchieved && profile.dailyTarget - (profile.todayFTDs || 0) > 0 && (
                          <p className="text-sm text-blue-300 text-center">
                            {profile.dailyTarget - (profile.todayFTDs || 0)} more FTDs to reach your goal! 💪
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* FTDs */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-bold text-tiger-orange mb-2">
                      <Trophy className="w-4 h-4" />
                      Total FTD's (First Time Deposits)
                    </label>
                    <p className="text-4xl font-extrabold alpha-text">
                      {profile.ftds} FTD's
                    </p>
                    <p className="text-sm text-orange-300 mt-1">
                      {profile.rank === 1 ? '🏆 You are the leader!' : `Rank #${profile.rank} on the leaderboard`}
                    </p>
                  </div>

                  {/* Plus Ones */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-bold text-tiger-orange mb-2">
                      <Award className="w-4 h-4" />
                      Total Plus Ones
                    </label>
                    <p className="text-4xl font-extrabold text-cyan-400">
                      {profile.plusOnes || 0} +1's
                    </p>
                    <p className="text-sm text-cyan-300 mt-1">
                      Special achievements and bonuses
                    </p>
                  </div>

                  {/* Member Since */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-bold text-tiger-orange mb-2">
                      <Calendar className="w-4 h-4" />
                      Member Since
                    </label>
                    <p className="text-lg text-orange-100">{formatDate(profile.createdAt)}</p>
                  </div>

                  {/* Admin Badge */}
                  {profile.isAdmin && (
                    <div className="inline-flex items-center gap-2 alpha-badge">
                      <Trophy className="w-5 h-5" />
                      Administrator
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Stats Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="card-alpha prowl-effect"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-tiger-gradient rounded-lg">
                    <Trophy className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-tiger-orange font-bold">Current Rank</p>
                    <p className="text-3xl font-extrabold alpha-text">#{profile.rank}</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 0 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="card-alpha prowl-effect"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-tiger-orange font-bold">Total FTD's</p>
                    <p className="text-3xl font-extrabold alpha-text">{profile.ftds}</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="card-alpha prowl-effect"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg">
                    <Award className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-tiger-orange font-bold">Plus Ones</p>
                    <p className="text-3xl font-extrabold text-cyan-400">{profile.plusOnes || 0}</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="card-alpha prowl-effect"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-r from-orange-600 to-red-600 rounded-lg">
                    <Flame className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-tiger-orange font-bold">Current Streak</p>
                    <p className="text-3xl font-extrabold text-orange-400">{profile.currentStreak || 0} 🔥</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* ⭐ Right Column - My Notes */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="card-alpha prowl-effect sticky top-8"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold alpha-text flex items-center gap-2">
                  <FileText className="w-6 h-6" />
                  📝 My Notes
                </h2>
                <button
                  onClick={() => {
                    setEditingNote(null);
                    setNoteForm({ title: '', content: '', color: 'blue' });
                    setShowNoteModal(true);
                  }}
                  className="btn-alpha flex items-center gap-2 text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Add Note
                </button>
              </div>

              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                {notes.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="w-16 h-16 text-tiger-orange/30 mx-auto mb-3" />
                    <p className="text-orange-200 text-sm">No notes yet</p>
                    <p className="text-orange-300/60 text-xs mt-1">Click "Add Note" to create one</p>
                  </div>
                ) : (
                  notes.map((note) => (
                    <motion.div
                      key={note._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 rounded-lg border-2 ${getColorClasses(note.color)} hover:scale-102 transition-all`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-tiger-yellow text-sm">{note.title}</h3>
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleEditNote(note)}
                            className="p-1 hover:bg-white/10 rounded transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4 text-tiger-yellow" />
                          </button>
                          <button
                            onClick={() => handleDeleteNote(note._id)}
                            className="p-1 hover:bg-white/10 rounded transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </button>
                        </div>
                      </div>
                      <p className="text-orange-200 text-xs whitespace-pre-wrap">{note.content}</p>
                      <p className="text-orange-300/60 text-xs mt-2">
                        {new Date(note.updatedAt).toLocaleDateString()}
                      </p>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ⭐ Note Modal */}
      <AnimatePresence>
        {showNoteModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="card-alpha max-w-md w-full p-6"
            >
              <h2 className="text-2xl font-bold alpha-text mb-4">
                {editingNote ? '✏️ Edit Note' : '➕ New Note'}
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-tiger-orange mb-2">📌 Title</label>
                  <input
                    type="text"
                    value={noteForm.title}
                    onChange={(e) => setNoteForm({ ...noteForm, title: e.target.value })}
                    className="input-field"
                    placeholder="Enter note title..."
                    maxLength={100}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-tiger-orange mb-2">📝 Content</label>
                  <textarea
                    value={noteForm.content}
                    onChange={(e) => setNoteForm({ ...noteForm, content: e.target.value })}
                    className="input-field min-h-[120px]"
                    placeholder="Enter note content..."
                    maxLength={500}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-tiger-orange mb-2">🎨 Color</label>
                  <div className="flex gap-3">
                    {['blue', 'green', 'purple', 'orange'].map((color) => (
                      <button
                        key={color}
                        onClick={() => setNoteForm({ ...noteForm, color })}
                        className={`w-12 h-12 rounded-lg border-2 transition-all ${
                          noteForm.color === color ? 'border-tiger-yellow scale-110' : 'border-transparent'
                        } ${getColorClasses(color)}`}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleSaveNote}
                    disabled={notesLoading}
                    className="flex-1 btn-alpha"
                  >
                    {notesLoading ? '⏳ Saving...' : '💾 Save Note'}
                  </button>
                  <button
                    onClick={() => {
                      setShowNoteModal(false);
                      setEditingNote(null);
                      setNoteForm({ title: '', content: '', color: 'blue' });
                    }}
                    className="flex-1 btn-secondary"
                  >
                    ❌ Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;