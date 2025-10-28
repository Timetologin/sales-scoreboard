import React, { useState, useEffect } from 'react';
import { usersAPI } from '../services/api';
import {
  Users,
  Plus,
  Trash2,
  Target,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Edit,
  Edit3,
  Save,
  X,
  Image,
  Upload,
  User,
  Crown,
  PlusCircle,
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
  'https://api.dicebear.com/7.x/personas/svg?seed=Person1',
  'https://api.dicebear.com/7.x/personas/svg?seed=Person2',
  'https://api.dicebear.com/7.x/personas/svg?seed=Person3',
  'https://api.dicebear.com/7.x/personas/svg?seed=Person4',
];

// Image compression function
const compressImage = (file, maxWidth = 200, maxHeight = 200, quality = 0.7) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('No file provided'));
      return;
    }

    if (!file.type.startsWith('image/')) {
      reject(new Error('File is not an image'));
      return;
    }

    const maxFileSize = 10 * 1024 * 1024;
    if (file.size > maxFileSize) {
      reject(new Error('File is too large (max 10MB)'));
      return;
    }

    const reader = new FileReader();
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.onload = (event) => {
      const img = new Image();
      
      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
      
      img.onload = () => {
        try {
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

              try {
                const compressedFile = new File([blob], file.name, {
                  type: 'image/jpeg',
                  lastModified: Date.now(),
                });
                const compressedReader = new FileReader();
                
                compressedReader.onerror = () => {
                  reject(new Error('Failed to read compressed image'));
                };
                
                compressedReader.onloadend = () => {
                  resolve(compressedReader.result);
                };
                
                compressedReader.readAsDataURL(compressedFile);
              } catch (error) {
                reject(error);
              }
            },
            'image/jpeg',
            quality
          );
        } catch (error) {
          reject(error);
        }
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
  const [editingUser, setEditingUser] = useState(null);
  const [editingUserName, setEditingUserName] = useState('');
  const [showAvatarModal, setShowAvatarModal] = useState(null);
  const [showRoleModal, setShowRoleModal] = useState(null);
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

  const handleIncrementFTD = async (userId) => {
    try {
      await usersAPI.incrementFTD(userId);
      await fetchUsers();
      showMessage('success', '✅ Added +1 FTD!');
    } catch (err) {
      showMessage('error', '❌ Failed to add FTD');
    }
  };

  const handleUpdateUserName = async (userId, newName) => {
    if (!newName || newName.trim() === '') {
      showMessage('error', '❌ Name cannot be empty');
      setEditingUser(null);
      return;
    }

    try {
      setUsers(users.map(u => u.id === userId ? { ...u, name: newName } : u));
      setEditingUser(null);
      setEditingUserName('');
      showMessage('success', '✅ User name updated! (Note: This updates locally only)');
    } catch (err) {
      showMessage('error', '❌ Failed to update user name');
    }
  };

  const handleUpdateAvatar = async (userId, newAvatar) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        showMessage('error', '❌ Authentication required');
        return;
      }

      const response = await fetch(`http://localhost:4000/api/users/${userId}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          profilePicture: newAvatar
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update avatar');
      }

      const updatedUser = await response.json();

      setUsers(users.map(u => u.id === userId ? { ...u, profilePicture: newAvatar } : u));
      setShowAvatarModal(null);
      showMessage('success', '✅ Avatar updated successfully!');
    } catch (err) {
      console.error('Avatar update error:', err);
      showMessage('error', '❌ Failed to update avatar: ' + err.message);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('❓ Are you sure you want to delete this user?')) return;

    try {
      await usersAPI.deleteUser(userId);
      await fetchUsers();
      showMessage('success', '✅ User deleted successfully');
    } catch (err) {
      showMessage('error', err.response?.data?.message || '❌ Failed to delete user');
    }
  };

  const handleResetLeaderboard = async () => {
    if (!window.confirm('⚠️ Are you sure you want to reset all FTD\'s to zero?')) return;

    try {
      await usersAPI.resetLeaderboard();
      await fetchUsers();
      showMessage('success', '✅ Leaderboard reset successfully!');
    } catch (err) {
      showMessage('error', '❌ Failed to reset leaderboard');
    }
  };

  const startEditingName = (userId, currentName) => {
    setEditingUser(userId);
    setEditingUserName(currentName);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-2 flex items-center gap-3">
            <Users className="w-10 h-10 text-purple-600" />
            Admin Panel
          </h1>
          <p className="text-gray-600 font-medium">🎯 Manage users and FTD data</p>
        </div>

        {/* Message Alert */}
        {message.text && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
              message.type === 'success'
                ? 'bg-green-50 text-green-700 border-2 border-green-200'
                : 'bg-red-50 text-red-700 border-2 border-red-200'
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

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-6">
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add New User
          </button>
          <button
            onClick={handleResetLeaderboard}
            className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold py-2 px-4 rounded-lg transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            Reset Leaderboard
          </button>
        </div>

        {/* Users Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-purple-200">
              <thead className="bg-gradient-to-r from-purple-100 to-pink-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-purple-700 uppercase tracking-wider">
                    👤 User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-purple-700 uppercase tracking-wider">
                    📧 Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-purple-700 uppercase tracking-wider">
                    🎯 FTD's
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-purple-700 uppercase tracking-wider">
                    🎭 Role
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-bold text-purple-700 uppercase tracking-wider">
                    ⚡ Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white/80 backdrop-blur-sm divide-y divide-purple-100">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-purple-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="relative group">
                          <img
                            src={user.profilePicture}
                            alt={user.name}
                            className="w-12 h-12 rounded-full border-2 border-purple-200 cursor-pointer hover:border-purple-400 transition-all"
                            onClick={() => setShowAvatarModal(user.id)}
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                            onClick={() => setShowAvatarModal(user.id)}
                          >
                            <Image className="w-5 h-5 text-white" />
                          </div>
                        </div>
                        {editingUser === user.id ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={editingUserName}
                              onChange={(e) => setEditingUserName(e.target.value)}
                              className="input-field py-1 px-2 text-sm w-40"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  handleUpdateUserName(user.id, editingUserName);
                                } else if (e.key === 'Escape') {
                                  setEditingUser(null);
                                  setEditingUserName('');
                                }
                              }}
                              autoFocus
                            />
                            <button
                              onClick={() => handleUpdateUserName(user.id, editingUserName)}
                              className="text-green-600 hover:text-green-700 transition-colors"
                              title="Save"
                            >
                              <Save className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                setEditingUser(null);
                                setEditingUserName('');
                              }}
                              className="text-red-600 hover:text-red-700 transition-colors"
                              title="Cancel"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900">{user.name}</span>
                            <button
                              onClick={() => startEditingName(user.id, user.name)}
                              className="text-gray-400 hover:text-purple-600 transition-colors"
                              title="Edit name"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingFTDs === user.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            defaultValue={user.ftds}
                            className="input-field w-32 py-1 px-2 text-sm"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleUpdateFTDs(user.id, e.target.value);
                              }
                            }}
                            autoFocus
                          />
                          <button
                            onClick={(e) => {
                              const input = e.target.parentElement.querySelector('input');
                              handleUpdateFTDs(user.id, input.value);
                            }}
                            className="text-green-600 hover:text-green-700"
                          >
                            <Save className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => setEditingFTDs(null)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-primary-600">
                            {user.ftds} FTD's
                          </span>
                          <button
                            onClick={() => setEditingFTDs(user.id)}
                            className="text-gray-400 hover:text-purple-600 transition-colors"
                            title="Edit FTD's"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleIncrementFTD(user.id)}
                            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 transition-all shadow-md hover:shadow-lg"
                            title="Add +1 FTD (Office Feature)"
                          >
                            <PlusCircle className="w-3 h-3" />
                            +1
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => setShowRoleModal(user.id)}
                        className="group"
                      >
                        {user.isAdmin ? (
                          <span className="px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full text-xs font-bold flex items-center gap-1 group-hover:from-purple-200 group-hover:to-pink-200 transition-all">
                            <Crown className="w-3 h-3" />
                            Admin
                            <Edit className="w-3 h-3 opacity-0 group-hover:opacity-100" />
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 rounded-full text-xs font-bold flex items-center gap-1 group-hover:from-blue-200 group-hover:to-cyan-200 transition-all">
                            <User className="w-3 h-3" />
                            User
                            <Edit className="w-3 h-3 opacity-0 group-hover:opacity-100" />
                          </span>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-600 hover:text-red-900 transition-colors"
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

        {showRoleModal && (
          <RolePickerModal
            user={users.find(u => u.id === showRoleModal)}
            onClose={() => setShowRoleModal(null)}
            onUpdate={async (isAdmin) => {
              setUsers(users.map(u => 
                u.id === showRoleModal ? { ...u, isAdmin } : u
              ));
              showMessage('success', '✅ Role updated! (Note: This updates locally only)');
              setShowRoleModal(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

// Avatar Picker Modal with compression
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
        console.error('Error compressing image:', error);
        alert('Failed to process image. Please try a different file.');
      } finally {
        setIsCompressing(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl max-w-2xl w-full p-6 border-2 border-purple-200 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
            🖼️ Choose Avatar for {currentUserName}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Current Avatar */}
        <div className="mb-6 text-center">
          <p className="text-sm font-bold text-gray-700 mb-2">Current Avatar:</p>
          <img src={currentAvatar} alt="Current" className="w-20 h-20 rounded-full mx-auto border-4 border-purple-200" />
        </div>

        {/* Upload Custom Image */}
        <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border-2 border-purple-200">
          <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Upload Custom Image
          </h3>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
            disabled={isCompressing}
          />
          {isCompressing && (
            <div className="mt-3 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">Compressing image...</p>
            </div>
          )}
          {preview && !isCompressing && (
            <div className="mt-3 text-center">
              <img src={preview} alt="Preview" className="w-20 h-20 rounded-full mx-auto border-2 border-purple-300" />
              <button
                onClick={() => onSelect(preview)}
                className="mt-2 btn-primary text-sm"
              >
                ✅ Use This Image
              </button>
            </div>
          )}
        </div>

        {/* URL Input */}
        <div className="mb-6 p-4 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg border-2 border-cyan-200">
          <h3 className="font-bold text-gray-800 mb-3">🔗 Or Enter Image URL</h3>
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
          <h3 className="font-bold text-gray-800 mb-3">🎨 Choose from Gallery</h3>
          <div className="grid grid-cols-5 gap-3">
            {AVATAR_GALLERY.map((avatar, index) => (
              <button
                key={index}
                onClick={() => onSelect(avatar)}
                className="group relative"
              >
                <img
                  src={avatar}
                  alt={`Avatar ${index + 1}`}
                  className="w-full h-full rounded-lg border-2 border-purple-200 hover:border-purple-500 transition-all hover:scale-110 cursor-pointer"
                />
                <div className="absolute inset-0 bg-purple-600 bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-all flex items-center justify-center">
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

// Role Picker Modal
const RolePickerModal = ({ user, onClose, onUpdate }) => {
  const [selectedRole, setSelectedRole] = useState(user?.isAdmin);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl max-w-md w-full p-6 border-2 border-purple-200"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
            🎭 Change Role
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="mb-6">
          <p className="text-gray-600 mb-4">
            Select role for <span className="font-bold text-purple-600">{user?.name}</span>:
          </p>

          <div className="space-y-3">
            <button
              onClick={() => setSelectedRole(false)}
              className={`w-full p-4 rounded-lg border-2 transition-all ${
                !selectedRole
                  ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-cyan-50'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <User className="w-8 h-8 text-blue-600" />
                <div className="text-left">
                  <p className="font-bold text-gray-800">👤 User</p>
                  <p className="text-sm text-gray-600">Regular access - Can view leaderboard and manage own profile</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => setSelectedRole(true)}
              className={`w-full p-4 rounded-lg border-2 transition-all ${
                selectedRole
                  ? 'border-purple-500 bg-gradient-to-r from-purple-50 to-pink-50'
                  : 'border-gray-200 hover:border-purple-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <Crown className="w-8 h-8 text-purple-600" />
                <div className="text-left">
                  <p className="font-bold text-gray-800">👑 Admin</p>
                  <p className="text-sm text-gray-600">Full access - Can manage users and FTD data</p>
                </div>
              </div>
            </button>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => onUpdate(selectedRole)}
            className="flex-1 btn-primary"
          >
            ✅ Update Role
          </button>
          <button
            onClick={onClose}
            className="flex-1 btn-secondary"
          >
            ❌ Cancel
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// Create User Modal Component
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
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl max-w-md w-full p-6 border-2 border-purple-200"
      >
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-6">
          ➕ Create New User
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">👤 Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">📧 Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">🔒 Password</label>
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
              className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
            />
            <label className="ml-2 text-sm text-gray-700 font-medium">👑 Admin privileges</label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 btn-primary"
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