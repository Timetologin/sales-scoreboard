import React, { useState, useEffect } from 'react';
import { usersAPI } from '../services/api';
import {
  Users,
  Plus,
  Trash2,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Edit,
  Save,
  X,
  Image,
  Crown,
  PlusCircle,
  Target,
  Award,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Avatar gallery
const AVATAR_GALLERY = [
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Lucy',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Max',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Oliver',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Precious',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Fluffy',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Boots',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Cuddles',
  'https://api.dicebear.com/7.x/bottts/svg?seed=Robot1',
  'https://api.dicebear.com/7.x/bottts/svg?seed=Robot2',
  'https://api.dicebear.com/7.x/bottts/svg?seed=Robot3',
  'https://api.dicebear.com/7.x/bottts/svg?seed=Robot4',
];

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
      const img = new Image();
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
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            const compressedReader = new FileReader();
            compressedReader.onerror = () => reject(new Error('Failed to read compressed image'));
            compressedReader.onloadend = () => resolve(compressedReader.result);
            compressedReader.readAsDataURL(compressedFile);
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

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingFTDs, setEditingFTDs] = useState(null);
  const [editingPlusOnes, setEditingPlusOnes] = useState(null);
  const [showAvatarModal, setShowAvatarModal] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await usersAPI.getAllUsers();
      setUsers(response.data);
    } catch (err) {
      showMessage('error', 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const handleUpdateFTDs = async (userId, newFTDs) => {
    try {
      await usersAPI.updateFTDs(userId, parseFloat(newFTDs));
      await fetchUsers();
      setEditingFTDs(null);
      showMessage('success', '✅ FTD\'s updated successfully!');
    } catch (err) {
      showMessage('error', '❌ Failed to update FTD\'s');
    }
  };

  const handleUpdatePlusOnes = async (userId, newPlusOnes) => {
    try {
      await usersAPI.updatePlusOnes(userId, parseFloat(newPlusOnes));
      await fetchUsers();
      setEditingPlusOnes(null);
      showMessage('success', '✅ Plus Ones updated successfully!');
    } catch (err) {
      showMessage('error', '❌ Failed to update Plus Ones');
    }
  };

  const handleIncrementFTD = async (userId) => {
    try {
      await usersAPI.incrementFTD(userId);
      await fetchUsers();
      showMessage('success', '✅ Added +1 FTD!');
    } catch (err) {
      showMessage('error', '❌ Failed to add FTD');
    }
  };

  const handleIncrementPlusOne = async (userId) => {
    try {
      await usersAPI.incrementPlusOne(userId);
      await fetchUsers();
      showMessage('success', '✅ Added +1 to Plus Ones!');
    } catch (err) {
      showMessage('error', '❌ Failed to add Plus One');
    }
  };

  const handleUpdateAvatar = async (userId, newAvatar) => {
    try {
      const response = await usersAPI.updateProfile(userId, { profilePicture: newAvatar });
      setUsers(users.map(u => u.id === userId ? { ...u, profilePicture: newAvatar } : u));
      setShowAvatarModal(null);
      showMessage('success', '✅ Avatar updated successfully!');
    } catch (err) {
      showMessage('error', '❌ Failed to update avatar');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('❓ Are you sure you want to delete this user?')) return;

    try {
      await usersAPI.deleteUser(userId);
      await fetchUsers();
      showMessage('success', '✅ User deleted successfully');
    } catch (err) {
      showMessage('error', '❌ Failed to delete user');
    }
  };

  const handleResetLeaderboard = async () => {
    if (!window.confirm('⚠️ Are you sure you want to reset all FTD\'s and Plus Ones to zero?')) return;

    try {
      await usersAPI.resetLeaderboard();
      await fetchUsers();
      showMessage('success', '✅ Leaderboard reset successfully!');
    } catch (err) {
      showMessage('error', '❌ Failed to reset leaderboard');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-tiger-orange mx-auto mb-4"></div>
          <p className="text-tiger-orange font-semibold">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-extrabold alpha-text mb-2 flex items-center gap-3">
            <Users className="w-12 h-12 text-tiger-orange" />
            Admin Panel
          </h1>
          <p className="text-tiger-orange font-bold text-xl">🎯 Manage users and FTD data</p>
        </div>

        {/* Message Alert */}
        <AnimatePresence>
          {message.text && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
                message.type === 'success'
                  ? 'bg-green-900/30 text-green-300 border-2 border-green-500'
                  : 'bg-red-900/30 text-red-300 border-2 border-red-500'
              }`}
            >
              {message.type === 'success' ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <AlertCircle className="w-5 h-5" />
              )}
              <p className="font-semibold">{message.text}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-6">
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-alpha flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add New User
          </button>
          <button
            onClick={handleResetLeaderboard}
            className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            Reset Leaderboard
          </button>
        </div>

        {/* Users Table */}
        <div className="card-alpha overflow-hidden prowl-effect">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-tiger-orange/30">
              <thead className="bg-tiger-gradient">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-extrabold text-white uppercase tracking-wider">
                    👤 USER
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-extrabold text-white uppercase tracking-wider">
                    📧 EMAIL
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-extrabold text-white uppercase tracking-wider">
                    🎯 FTD'S
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-extrabold text-white uppercase tracking-wider">
                    ➕ PLUS ONES
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-extrabold text-white uppercase tracking-wider">
                    🎭 ROLE
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-extrabold text-white uppercase tracking-wider">
                    ⚡ ACTIONS
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-tiger-orange/20">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-tiger-orange/10 transition-colors">
                    {/* User Column */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="relative group">
                          <img
                            src={user.profilePicture}
                            alt={user.name}
                            className="w-12 h-12 rounded-full border-2 border-tiger-orange cursor-pointer hover:border-tiger-yellow transition-all"
                            onClick={() => setShowAvatarModal(user.id)}
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                            onClick={() => setShowAvatarModal(user.id)}
                          >
                            <Image className="w-5 h-5 text-white" />
                          </div>
                        </div>
                        <span className="font-bold text-tiger-orange">{user.name}</span>
                      </div>
                    </td>

                    {/* Email Column */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-orange-200">
                      {user.email}
                    </td>

                    {/* FTD's Column */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingFTDs === user.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            defaultValue={user.ftds}
                            className="input-field w-24 py-1 px-2 text-sm"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleUpdateFTDs(user.id, e.target.value);
                              } else if (e.key === 'Escape') {
                                setEditingFTDs(null);
                              }
                            }}
                            autoFocus
                          />
                          <button
                            onClick={(e) => {
                              const input = e.target.parentElement.querySelector('input');
                              handleUpdateFTDs(user.id, input.value);
                            }}
                            className="text-green-400 hover:text-green-300"
                          >
                            <Save className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => setEditingFTDs(null)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-tiger-yellow">
                            {user.ftds} FTD's
                          </span>
                          <button
                            onClick={() => setEditingFTDs(user.id)}
                            className="text-gray-400 hover:text-tiger-orange transition-colors"
                            title="Edit FTD's"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleIncrementFTD(user.id)}
                            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 transition-all shadow-md hover:shadow-lg"
                            title="Add +1 FTD"
                          >
                            <PlusCircle className="w-3 h-3" />
                            +1
                          </button>
                        </div>
                      )}
                    </td>

                    {/* Plus Ones Column */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingPlusOnes === user.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            defaultValue={user.plusOnes || 0}
                            className="input-field w-24 py-1 px-2 text-sm"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleUpdatePlusOnes(user.id, e.target.value);
                              } else if (e.key === 'Escape') {
                                setEditingPlusOnes(null);
                              }
                            }}
                            autoFocus
                          />
                          <button
                            onClick={(e) => {
                              const input = e.target.parentElement.querySelector('input');
                              handleUpdatePlusOnes(user.id, input.value);
                            }}
                            className="text-green-400 hover:text-green-300"
                          >
                            <Save className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => setEditingPlusOnes(null)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-cyan-400">
                            {user.plusOnes || 0} +1's
                          </span>
                          <button
                            onClick={() => setEditingPlusOnes(user.id)}
                            className="text-gray-400 hover:text-cyan-400 transition-colors"
                            title="Edit Plus Ones"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleIncrementPlusOne(user.id)}
                            className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 transition-all shadow-md hover:shadow-lg"
                            title="Add +1 to Plus Ones"
                          >
                            <PlusCircle className="w-3 h-3" />
                            +1
                          </button>
                        </div>
                      )}
                    </td>

                    {/* Role Column */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.isAdmin ? (
                        <span className="tiger-badge flex items-center gap-1 w-fit">
                          <Crown className="w-3 h-3" />
                          Admin
                        </span>
                      ) : (
                        <span className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit">
                          <Target className="w-3 h-3" />
                          User
                        </span>
                      )}
                    </td>

                    {/* Actions Column */}
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-500 hover:text-red-400 transition-colors"
                        disabled={user.isAdmin}
                        title={user.isAdmin ? 'Cannot delete admin' : 'Delete user'}
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modals */}
        {showCreateModal && (
          <CreateUserModal
            onClose={() => setShowCreateModal(false)}
            onSuccess={() => {
              fetchUsers();
              setShowCreateModal(false);
              showMessage('success', '✅ User created successfully!');
            }}
            onError={(err) => showMessage('error', err)}
          />
        )}

        {showAvatarModal && (
          <AvatarPickerModal
            userId={showAvatarModal}
            currentAvatar={users.find(u => u.id === showAvatarModal)?.profilePicture}
            currentUserName={users.find(u => u.id === showAvatarModal)?.name}
            onClose={() => setShowAvatarModal(null)}
            onSelect={(avatar) => handleUpdateAvatar(showAvatarModal, avatar)}
          />
        )}
      </div>
    </div>
  );
};

// Avatar Picker Modal
const AvatarPickerModal = ({ userId, currentAvatar, currentUserName, onClose, onSelect }) => {
  const [customUrl, setCustomUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isCompressing, setIsCompressing] = useState(false);

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsCompressing(true);
      try {
        const compressed = await compressImage(file);
        setSelectedFile(file);
        setPreview(compressed);
      } catch (error) {
        alert('Failed to process image. Please try a different file.');
      } finally {
        setIsCompressing(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card-alpha max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold alpha-text">
            🖼️ Choose Avatar for {currentUserName}
          </h2>
          <button onClick={onClose} className="text-tiger-orange hover:text-tiger-yellow">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Current Avatar */}
        <div className="mb-6 text-center">
          <p className="text-sm font-bold text-tiger-orange mb-2">Current Avatar:</p>
          <img src={currentAvatar} alt="Current" className="w-20 h-20 rounded-full mx-auto border-4 border-tiger-orange" />
        </div>

        {/* Upload Custom Image */}
        <div className="mb-6 p-4 bg-tiger-gradient/20 rounded-lg border-2 border-tiger-orange">
          <h3 className="font-bold text-tiger-yellow mb-3 flex items-center gap-2">
            <Award className="w-5 h-5" />
            Upload Custom Image
          </h3>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="block w-full text-sm text-orange-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-tiger-orange file:text-white hover:file:bg-tiger-darkOrange"
            disabled={isCompressing}
          />
          {isCompressing && (
            <div className="mt-3 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-tiger-orange mx-auto mb-2"></div>
              <p className="text-sm text-tiger-orange">Compressing image...</p>
            </div>
          )}
          {preview && !isCompressing && (
            <div className="mt-3 text-center">
              <img src={preview} alt="Preview" className="w-20 h-20 rounded-full mx-auto border-2 border-tiger-yellow" />
              <button
                onClick={() => onSelect(preview)}
                className="mt-2 btn-alpha text-sm"
              >
                ✅ Use This Image
              </button>
            </div>
          )}
        </div>

        {/* URL Input */}
        <div className="mb-6 p-4 bg-cyan-600/20 rounded-lg border-2 border-cyan-500">
          <h3 className="font-bold text-cyan-300 mb-3">🔗 Or Enter Image URL</h3>
          <div className="flex gap-2">
            <input
              type="url"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              placeholder="https://example.com/avatar.jpg"
              className="input-field flex-1"
            />
            <button
              onClick={() => onSelect(customUrl)}
              disabled={!customUrl}
              className="btn-primary disabled:opacity-50"
            >
              Use URL
            </button>
          </div>
        </div>

        {/* Avatar Gallery */}
        <div>
          <h3 className="font-bold text-tiger-yellow mb-3">🎨 Choose from Gallery</h3>
          <div className="grid grid-cols-4 gap-3">
            {AVATAR_GALLERY.map((avatar, index) => (
              <button
                key={index}
                onClick={() => onSelect(avatar)}
                className="group relative"
              >
                <img
                  src={avatar}
                  alt={`Avatar ${index + 1}`}
                  className="w-full h-full rounded-lg border-2 border-tiger-orange hover:border-tiger-yellow transition-all hover:scale-110 cursor-pointer"
                />
                <div className="absolute inset-0 bg-tiger-orange bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-all flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-white opacity-0 group-hover:opacity-100" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// Create User Modal
const CreateUserModal = ({ onClose, onSuccess, onError }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    isAdmin: false,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await usersAPI.createUser(formData);
      onSuccess();
    } catch (err) {
      onError(err.response?.data?.message || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card-alpha max-w-md w-full p-6"
      >
        <h2 className="text-2xl font-bold alpha-text mb-6">
          ➕ Create New User
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-tiger-orange mb-2">👤 Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-tiger-orange mb-2">📧 Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-tiger-orange mb-2">🔒 Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="input-field"
              required
              minLength={6}
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              checked={formData.isAdmin}
              onChange={(e) => setFormData({ ...formData, isAdmin: e.target.checked })}
              className="w-4 h-4 text-tiger-orange border-gray-600 rounded focus:ring-tiger-orange bg-gray-700"
            />
            <label className="ml-2 text-sm text-orange-200 font-medium">👑 Admin privileges</label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 btn-alpha"
            >
              {loading ? '⏳ Creating...' : '✨ Create User'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn-secondary"
            >
              ❌ Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminPanel;