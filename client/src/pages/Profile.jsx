import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { usersAPI } from '../services/api';
import { User, Mail, Trophy, TrendingUp, Calendar, Edit2, Save, X } from 'lucide-react';
import { motion } from 'framer-motion';

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

  useEffect(() => {
    if (user) {
      fetchProfile();
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
    } catch (err) {
      console.error('Failed to fetch profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await usersAPI.updateProfile(formData);
      setProfile(response.data);
      updateUser(response.data);
      setEditing(false);
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
    setEditing(false);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600">Profile not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="btn-primary flex items-center gap-2"
              >
                <Edit2 className="w-4 h-4" />
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="btn-primary flex items-center gap-2"
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
                <img
                  src={editing ? formData.profilePicture : profile.profilePicture}
                  alt={profile.name}
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-primary-100 shadow-lg"
                />
                {editing && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Profile Picture URL
                    </label>
                    <input
                      type="text"
                      value={formData.profilePicture}
                      onChange={(e) =>
                        setFormData({ ...formData, profilePicture: e.target.value })
                      }
                      className="input-field text-sm"
                      placeholder="https://..."
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Use a direct image URL or UI Avatars
                    </p>
                  </div>
                )}

                {/* Rank Badge */}
                <div className="inline-block">
                  <div
                    className={`px-6 py-3 rounded-full font-bold text-lg ${
                      profile.rank === 1
                        ? 'gold-gradient text-white'
                        : 'bg-primary-600 text-white'
                    }`}
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
                <label className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-2">
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
                  <p className="text-xl font-semibold text-gray-900">{profile.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-2">
                  <Mail className="w-4 h-4" />
                  Email Address
                </label>
                <p className="text-lg text-gray-900">{profile.email}</p>
              </div>

              {/* Sales */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-2">
                  <TrendingUp className="w-4 h-4" />
                  Total Sales
                </label>
                <p className="text-3xl font-bold text-primary-600">
                  {formatCurrency(profile.sales)}
                </p>
              </div>

              {/* Member Since */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-2">
                  <Calendar className="w-4 h-4" />
                  Member Since
                </label>
                <p className="text-lg text-gray-900">{formatDate(profile.createdAt)}</p>
              </div>

              {/* Admin Badge */}
              {profile.isAdmin && (
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg font-semibold">
                  <Trophy className="w-4 h-4" />
                  Administrator
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 gap-4 mt-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="card"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary-100 rounded-lg">
                <Trophy className="w-8 h-8 text-primary-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Current Rank</p>
                <p className="text-2xl font-bold text-gray-900">#{profile.rank}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="card"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Last Updated</p>
                <p className="text-lg font-semibold text-gray-900">
                  {formatDate(profile.lastUpdated)}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
