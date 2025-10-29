import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { usersAPI } from '../services/api';
import { User, Mail, Trophy, Target, Calendar, Edit2, Save, X, Award } from 'lucide-react';
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

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
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
                <img
                  src={editing ? formData.profilePicture : profile.profilePicture}
                  alt={profile.name}
                  className="w-40 h-40 rounded-full mx-auto mb-4 object-cover border-4 border-tiger-orange shadow-xl"
                />
                {editing && (
                  <div className="mb-4">
                    <label className="block text-sm font-bold text-tiger-orange mb-2">
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
                    <p className="text-xs text-orange-300 mt-1">
                      Use a direct image URL
                    </p>
                  </div>
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

              {/* FTDs */}
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-tiger-orange mb-2">
                  <Target className="w-4 h-4" />
                  Total FTD's (First Time Deposits)
                </label>
                <p className="text-4xl font-extrabold alpha-text">
                  {profile.ftds} FTD's
                </p>
                <p className="text-sm text-orange-300 mt-1">
                  {profile.rank === 1 ? '🏆 You are the leader!' : `${profile.ftds - (profile.leaderFtds || 0)} FTD's from the leader`}
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
        <div className="grid md:grid-cols-3 gap-4 mt-6">
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
        </div>
      </div>
    </div>
  );
};

export default Profile;