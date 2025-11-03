import React, { useState, useEffect } from 'react';
import { usersAPI, settingsAPI } from '../services/api';
import {
    Users,
    Plus,
    Minus,
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
    Key,
    Shield,
    Mail,
    User as UserIcon,
    Upload,
    Star,
    TrendingUp,
    Calendar,
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
            const img = new window.Image();
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

const AdminPanel = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(null);
    const [showPasswordModal, setShowPasswordModal] = useState(null);
    const [showTargetsModal, setShowTargetsModal] = useState(false); // ⭐ NEW
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
            const sortedUsers = response.data.sort((a, b) => b.ftds - a.ftds);
            setUsers(sortedUsers);
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
            showMessage('success', "✅ FTD's updated successfully!");
        } catch (err) {
            showMessage('error', "❌ Failed to update FTD's");
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

    const handleDecrementFTD = async (userId) => {
        const user = users.find(u => u.id === userId);
        if (user && user.ftds <= 0) {
            showMessage('error', '❌ FTDs cannot be less than 0');
            return;
        }
        try {
            await usersAPI.decrementFTD(userId);
            await fetchUsers();
            showMessage('success', '✅ Removed -1 FTD!');
        } catch (err) {
            showMessage('error', '❌ Failed to remove FTD');
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

    const handleDecrementPlusOne = async (userId) => {
        const user = users.find(u => u.id === userId);
        if (user && user.plusOnes <= 0) {
            showMessage('error', '❌ Plus Ones cannot be less than 0');
            return;
        }
        try {
            await usersAPI.decrementPlusOne(userId);
            await fetchUsers();
            showMessage('success', '✅ Removed -1 Plus One!');
        } catch (err) {
            showMessage('error', '❌ Failed to remove Plus One');
        }
    };

    const handleUpdateAvatar = async (userId, newAvatar) => {
        try {
            const user = users.find((u) => u.id === userId);
            await usersAPI.updateUserProfile(userId, {
                name: user.name,
                profilePicture: newAvatar,
            });
            await fetchUsers();
            setShowAvatarModal(null);
            showMessage('success', '✅ Avatar updated successfully!');
        } catch (err) {
            console.error('Update avatar error:', err);
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

    const totalFTDs = users.reduce((sum, user) => sum + (user.ftds || 0), 0);
    const totalPlusOnes = users.reduce((sum, user) => sum + (user.plusOnes || 0), 0);

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
        <div className="min-h-screen p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-5xl font-extrabold alpha-text mb-2 flex items-center gap-3">
                        <Shield className="w-12 h-12 text-tiger-orange" />
                        Admin Panel
                    </h1>
                    <p className="text-tiger-orange text-xl font-bold">
                        🎮 Manage Users, FTDs & Plus Ones - Higher is Better! 🔥
                    </p>
                </motion.div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="card-alpha text-center prowl-effect">
                        <Users className="w-10 h-10 text-tiger-orange mx-auto mb-2" />
                        <p className="text-sm text-tiger-yellow font-bold">Total Users</p>
                        <p className="text-4xl font-extrabold alpha-text">{users.length}</p>
                    </div>
                    <div className="card-alpha text-center prowl-effect">
                        <Target className="w-10 h-10 text-green-500 mx-auto mb-2" />
                        <p className="text-sm text-tiger-yellow font-bold">Total FTD's</p>
                        <p className="text-4xl font-extrabold alpha-text">{totalFTDs}</p>
                    </div>
                    <div className="card-alpha text-center prowl-effect">
                        <Award className="w-10 h-10 text-cyan-400 mx-auto mb-2" />
                        <p className="text-sm text-tiger-yellow font-bold">Total Plus Ones</p>
                        <p className="text-4xl font-extrabold alpha-text">{totalPlusOnes}</p>
                    </div>
                    <div className="card-alpha text-center prowl-effect">
                        <Crown className="w-10 h-10 text-yellow-400 mx-auto mb-2" />
                        <p className="text-sm text-tiger-yellow font-bold">Top Player</p>
                        <p className="text-2xl font-extrabold alpha-text truncate">
                            {users[0]?.name || 'N/A'}
                        </p>
                    </div>
                </div>

                {/* Action Buttons - ⭐ הוספתי כפתור Manage Targets */}
                <div className="flex gap-4 mb-8">
                    <button
                        onClick={() => setShowTargetsModal(true)}
                        className="btn-alpha flex items-center gap-2"
                    >
                        <Star className="w-5 h-5" />
                        🎯 Manage Targets
                    </button>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="btn-alpha flex items-center gap-2"
                    >
                        <PlusCircle className="w-5 h-5" />
                        Create New User
                    </button>
                    <button onClick={fetchUsers} className="btn-secondary flex items-center gap-2">
                        <RefreshCw className="w-5 h-5" />
                        Refresh
                    </button>
                </div>

                {/* Messages */}
                <AnimatePresence>
                    {message.text && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className={`mb-6 p-4 rounded-lg border-2 ${
                                message.type === 'success'
                                    ? 'bg-green-900/30 border-green-500'
                                    : 'bg-red-900/30 border-red-500'
                            }`}
                        >
                            <p
                                className={`font-bold text-center flex items-center justify-center gap-2 ${
                                    message.type === 'success' ? 'text-green-300' : 'text-red-300'
                                }`}
                            >
                                {message.type === 'success' ? (
                                    <CheckCircle className="w-5 h-5" />
                                ) : (
                                    <AlertCircle className="w-5 h-5" />
                                )}
                                {message.text}
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Users Table - ⭐ הוספתי עמודת Daily Progress */}
                <div className="card-alpha overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-tiger-orange/20 border-b-2 border-tiger-orange">
                                <tr>
                                    <th className="px-4 py-4 text-center text-tiger-yellow font-bold">🏆 Rank</th>
                                    <th className="px-4 py-4 text-center text-tiger-yellow font-bold">👤 User</th>
                                    <th className="px-4 py-4 text-center text-tiger-yellow font-bold">📧 Email</th>
                                    <th className="px-4 py-4 text-center text-tiger-yellow font-bold">🎯 FTD's</th>
                                    <th className="px-4 py-4 text-center text-tiger-yellow font-bold">🏅 Plus Ones</th>
                                    {/* ⭐ עמודה חדשה */}
                                    <th className="px-4 py-4 text-center text-tiger-yellow font-bold">📊 Daily Progress</th>
                                    <th className="px-4 py-4 text-center text-tiger-yellow font-bold">👑 Role</th>
                                    <th className="px-4 py-4 text-center text-tiger-yellow font-bold">🛠️ Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user, index) => {
                                    // ⭐ חישוב התקדמות יומית
                                    const dailyProgress = user.dailyTarget > 0 
                                        ? (user.dailyFTDs / user.dailyTarget) * 100 
                                        : 0;
                                    const dailyAchieved = user.dailyFTDs >= user.dailyTarget && user.dailyTarget > 0;

                                    return (
                                        <motion.tr
                                            key={user.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="border-b border-tiger-orange/20 hover:bg-tiger-orange/10 transition-colors"
                                        >
                                            {/* ...rest of the table cells remain the same until Daily Progress... */}
                                            {/* (כל הקוד הקיים של Rank, User, Email, FTDs, Plus Ones נשאר אותו דבר) */}
                                            
                                            {/* Rank */}
                                            <td className="px-4 py-4">
                                                <div className="flex justify-center">
                                                    <span
                                                        className={`inline-flex items-center justify-center w-10 h-10 rounded-full font-bold ${
                                                            index === 0
                                                                ? 'bg-yellow-400 text-yellow-900'
                                                                : index === 1
                                                                ? 'bg-gray-400 text-gray-900'
                                                                : index === 2
                                                                ? 'bg-orange-500 text-white'
                                                                : 'bg-tiger-orange/30 text-tiger-orange'
                                                        }`}
                                                    >
                                                        #{index + 1}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* User Avatar & Name */}
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-3 justify-center">
                                                    <div className="relative group">
                                                        <img
                                                            src={user.profilePicture}
                                                            alt={user.name}
                                                            className="w-12 h-12 rounded-full object-cover border-2 border-tiger-orange cursor-pointer hover:border-tiger-yellow transition-all"
                                                            onClick={() => setShowAvatarModal(user.id)}
                                                        />
                                                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 rounded-full transition-all flex items-center justify-center cursor-pointer"
                                                            onClick={() => setShowAvatarModal(user.id)}
                                                        >
                                                            <Image className="w-5 h-5 text-white opacity-0 group-hover:opacity-100" />
                                                        </div>
                                                    </div>
                                                    <div className="text-center">
                                                        <p className="text-tiger-yellow font-bold">{user.name}</p>
                                                        {index < 3 && (
                                                            <p className="text-xs text-tiger-orange">
                                                                {index === 0
                                                                    ? '👑 Champion'
                                                                    : index === 1
                                                                    ? '🥈 Runner-up'
                                                                    : '🥉 Third Place'}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Email */}
                                            <td className="px-4 py-4 text-center text-orange-200">{user.email}</td>

                                            {/* FTD's with +/- buttons (קיים - לא שינינו) */}
                                            <td className="px-4 py-4">
                                                {editingFTDs === user.id ? (
                                                    <div className="flex items-center justify-center gap-2">
                                                        <input
                                                            type="number"
                                                            defaultValue={user.ftds}
                                                            className="w-20 px-2 py-1 bg-dark-bg border-2 border-tiger-orange rounded text-center text-tiger-yellow font-bold"
                                                            onKeyPress={(e) => {
                                                                if (e.key === 'Enter') {
                                                                    handleUpdateFTDs(user.id, e.target.value);
                                                                }
                                                            }}
                                                            autoFocus
                                                        />
                                                        <button
                                                            onClick={() => {
                                                                const input = document.querySelector('input[type="number"]');
                                                                handleUpdateFTDs(user.id, input.value);
                                                            }}
                                                            className="p-1 bg-green-600 hover:bg-green-700 rounded"
                                                        >
                                                            <Save className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => setEditingFTDs(null)}
                                                            className="p-1 bg-red-600 hover:bg-red-700 rounded"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center justify-center gap-2">
                                                        <button
                                                            onClick={() => handleDecrementFTD(user.id)}
                                                            disabled={user.ftds <= 0}
                                                            className={`p-2 rounded-lg transition-all ${
                                                                user.ftds <= 0
                                                                    ? 'bg-gray-600 cursor-not-allowed opacity-50'
                                                                    : 'bg-red-600 hover:bg-red-700 prowl-effect'
                                                            }`}
                                                        >
                                                            <Minus className="w-4 h-4 text-white" />
                                                        </button>

                                                        <span
                                                            onClick={() => setEditingFTDs(user.id)}
                                                            className="text-2xl font-bold alpha-text min-w-[3rem] text-center cursor-pointer hover:text-tiger-yellow transition-colors"
                                                        >
                                                            {user.ftds}
                                                        </span>

                                                        <button
                                                            onClick={() => handleIncrementFTD(user.id)}
                                                            className="p-2 bg-green-600 hover:bg-green-700 rounded-lg transition-all prowl-effect"
                                                        >
                                                            <Plus className="w-4 h-4 text-white" />
                                                        </button>
                                                    </div>
                                                )}
                                            </td>

                                            {/* Plus Ones (קיים - לא שינינו) */}
                                            <td className="px-4 py-4">
                                                {editingPlusOnes === user.id ? (
                                                    <div className="flex items-center justify-center gap-2">
                                                        <input
                                                            type="number"
                                                            defaultValue={user.plusOnes || 0}
                                                            className="w-20 px-2 py-1 bg-dark-bg border-2 border-cyan-400 rounded text-center text-cyan-300 font-bold"
                                                            onKeyPress={(e) => {
                                                                if (e.key === 'Enter') {
                                                                    handleUpdatePlusOnes(user.id, e.target.value);
                                                                }
                                                            }}
                                                            autoFocus
                                                        />
                                                        <button
                                                            onClick={() => {
                                                                const input = document.querySelector('input[type="number"]');
                                                                handleUpdatePlusOnes(user.id, input.value);
                                                            }}
                                                            className="p-1 bg-green-600 hover:bg-green-700 rounded"
                                                        >
                                                            <Save className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => setEditingPlusOnes(null)}
                                                            className="p-1 bg-red-600 hover:bg-red-700 rounded"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center justify-center gap-2">
                                                        <button
                                                            onClick={() => handleDecrementPlusOne(user.id)}
                                                            disabled={(user.plusOnes || 0) <= 0}
                                                            className={`p-2 rounded-lg transition-all ${
                                                                (user.plusOnes || 0) <= 0
                                                                    ? 'bg-gray-600 cursor-not-allowed opacity-50'
                                                                    : 'bg-orange-600 hover:bg-orange-700 prowl-effect'
                                                            }`}
                                                        >
                                                            <Minus className="w-4 h-4 text-white" />
                                                        </button>

                                                        <span
                                                            onClick={() => setEditingPlusOnes(user.id)}
                                                            className="text-2xl font-bold text-cyan-300 min-w-[3rem] text-center cursor-pointer hover:text-cyan-400 transition-colors"
                                                        >
                                                            {user.plusOnes || 0}
                                                        </span>

                                                        <button
                                                            onClick={() => handleIncrementPlusOne(user.id)}
                                                            className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-all prowl-effect"
                                                        >
                                                            <Plus className="w-4 h-4 text-white" />
                                                        </button>
                                                    </div>
                                                )}
                                            </td>

                                            {/* ⭐ עמודת Daily Progress - חדש! */}
                                            <td className="px-4 py-4">
                                                <div className="flex flex-col items-center gap-2">
                                                    {user.dailyTarget > 0 ? (
                                                        <>
                                                            <div className="flex items-center gap-2 w-full max-w-[150px]">
                                                                <div className="flex-1 h-4 bg-gray-800 rounded-full overflow-hidden border border-tiger-orange/30">
                                                                    <div
                                                                        style={{ width: `${Math.min(dailyProgress, 100)}%` }}
                                                                        className={`h-full rounded-full transition-all ${
                                                                            dailyAchieved 
                                                                                ? 'bg-gradient-to-r from-green-400 to-green-600' 
                                                                                : 'bg-gradient-to-r from-tiger-orange to-tiger-yellow'
                                                                        }`}
                                                                    />
                                                                </div>
                                                                <span className="text-xs font-semibold text-tiger-yellow w-12 text-right">
                                                                    {user.dailyFTDs}/{user.dailyTarget}
                                                                </span>
                                                            </div>
                                                            {dailyAchieved && (
                                                                <span className="flex items-center gap-1 px-2 py-0.5 bg-green-600/30 text-green-300 text-xs rounded-full font-medium border border-green-500">
                                                                    <Star className="w-3 h-3 fill-current" />
                                                                    Achieved!
                                                                </span>
                                                            )}
                                                        </>
                                                    ) : (
                                                        <span className="text-sm text-gray-500">No target</span>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Role (קיים - לא שינינו) */}
                                            <td className="px-4 py-4">
                                                <div className="flex justify-center">
                                                    <span
                                                        className={`px-4 py-2 rounded-lg font-bold ${
                                                            user.isAdmin
                                                                ? 'bg-purple-600 text-white'
                                                                : 'bg-gray-600 text-white'
                                                        }`}
                                                    >
                                                        {user.isAdmin ? '👑 Admin' : '👤 User'}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Actions (קיים - לא שינינו) */}
                                            <td className="px-4 py-4">
                                                <div className="flex justify-center gap-2">
                                                    <button
                                                        onClick={() => setShowEditModal(user.id)}
                                                        className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-all prowl-effect"
                                                        title="Edit User"
                                                    >
                                                        <Edit className="w-5 h-5 text-white" />
                                                    </button>
                                                    <button
                                                        onClick={() => setShowPasswordModal(user.id)}
                                                        className="p-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg transition-all prowl-effect"
                                                        title="Change Password"
                                                    >
                                                        <Key className="w-5 h-5 text-white" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteUser(user.id)}
                                                        className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-all prowl-effect"
                                                        title="Delete User"
                                                    >
                                                        <Trash2 className="w-5 h-5 text-white" />
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Instructions - עדכנתי עם Target Management */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-8 card-alpha"
                >
                    <h3 className="text-2xl font-bold alpha-text mb-4 text-center">📋 Admin Instructions</h3>
                    <div className="grid md:grid-cols-2 gap-6 text-orange-200">
                        <div>
                            <h4 className="text-tiger-yellow font-bold mb-2 flex items-center gap-2">
                                <Target className="w-5 h-5" />
                                FTD Management:
                            </h4>
                            <ul className="list-disc list-inside space-y-1 text-sm">
                                <li><strong className="text-green-400">Plus (+)</strong> button adds 1 FTD</li>
                                <li><strong className="text-red-400">Minus (-)</strong> button removes 1 FTD</li>
                                <li>FTD count cannot go below 0</li>
                                <li>Click number to edit manually</li>
                                <li>Leaderboard updates automatically</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-tiger-yellow font-bold mb-2 flex items-center gap-2">
                                <Award className="w-5 h-5" />
                                Plus One Management:
                            </h4>
                            <ul className="list-disc list-inside space-y-1 text-sm">
                                <li><strong className="text-blue-400">Plus (+)</strong> button adds 1 Plus One</li>
                                <li><strong className="text-orange-400">Minus (-)</strong> button removes 1 Plus One</li>
                                <li>Plus One count cannot go below 0</li>
                                <li>Click number to edit manually</li>
                                <li>Track additional achievements</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-tiger-yellow font-bold mb-2 flex items-center gap-2">
                                <Star className="w-5 h-5" />
                                Target Management:
                            </h4>
                            <ul className="list-disc list-inside space-y-1 text-sm">
                                <li>Click "🎯 Manage Targets" to set goals</li>
                                <li>Set <strong>Monthly Target</strong> for entire team</li>
                                <li>Set <strong>Daily Target</strong> for each individual</li>
                                <li>Daily targets reset at midnight (Israel Time)</li>
                                <li>Progress bars show real-time achievements</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-tiger-yellow font-bold mb-2 flex items-center gap-2">
                                <Image className="w-5 h-5" />
                                User Management:
                            </h4>
                            <ul className="list-disc list-inside space-y-1 text-sm">
                                <li>Click avatar to change profile picture</li>
                                <li>Edit: Change name, email, admin status</li>
                                <li>Password: Reset user password</li>
                                <li>Delete: Remove user (cannot be undone)</li>
                            </ul>
                        </div>
                    </div>
                </motion.div>

                {users.length === 0 && (
                    <div className="text-center py-12">
                        <Users className="w-24 h-24 text-tiger-orange/30 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold text-tiger-orange mb-2">No users found</h3>
                        <p className="text-orange-200">Create your first user to get started!</p>
                    </div>
                )}
            </div>

            {/* Modals */}
            {showCreateModal && (
                <CreateUserModal
                    onClose={() => setShowCreateModal(false)}
                    onSuccess={() => {
                        setShowCreateModal(false);
                        fetchUsers();
                        showMessage('success', '✅ User created successfully!');
                    }}
                    onError={(msg) => showMessage('error', msg)}
                />
            )}

            {showEditModal && (
                <EditUserModal
                    userId={showEditModal}
                    user={users.find((u) => u.id === showEditModal)}
                    onClose={() => setShowEditModal(null)}
                    onSuccess={() => {
                        setShowEditModal(null);
                        fetchUsers();
                        showMessage('success', '✅ User updated successfully!');
                    }}
                    onError={(msg) => showMessage('error', msg)}
                />
            )}

            {showPasswordModal && (
                <PasswordModal
                    userId={showPasswordModal}
                    userName={users.find((u) => u.id === showPasswordModal)?.name}
                    onClose={() => setShowPasswordModal(null)}
                    onSuccess={() => {
                        setShowPasswordModal(null);
                        showMessage('success', '✅ Password changed successfully!');
                    }}
                    onError={(msg) => showMessage('error', msg)}
                />
            )}

            {showAvatarModal && (
                <AvatarModal
                    userId={showAvatarModal}
                    currentAvatar={users.find((u) => u.id === showAvatarModal)?.profilePicture}
                    userName={users.find((u) => u.id === showAvatarModal)?.name}
                    onClose={() => setShowAvatarModal(null)}
                    onSelect={(newAvatar) => handleUpdateAvatar(showAvatarModal, newAvatar)}
                />
            )}

            {/* ⭐ NEW: Targets Modal */}
            {showTargetsModal && (
                <TargetsModal
                    users={users}
                    onClose={() => setShowTargetsModal(null)}
                    onSuccess={() => {
                        setShowTargetsModal(null);
                        fetchUsers();
                        showMessage('success', '✅ Targets updated successfully!');
                    }}
                    onError={(msg) => showMessage('error', msg)}
                />
            )}
        </div>
    );
};

// ⭐ NEW: Targets Modal Component
const TargetsModal = ({ users, onClose, onSuccess, onError }) => {
    const [monthlyTarget, setMonthlyTarget] = useState(100);
    const [userTargets, setUserTargets] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const response = await settingsAPI.getMonthlyTarget();
            setMonthlyTarget(response.data.monthlyTarget);
            
            // Initialize user targets
            const targets = {};
            users.forEach(user => {
                targets[user.id] = user.dailyTarget || 0;
            });
            setUserTargets(targets);
        } catch (err) {
            console.error('Failed to fetch settings:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            // Update monthly target
            await settingsAPI.updateMonthlyTarget(monthlyTarget);
            
            // Update daily targets for each user
            for (const userId in userTargets) {
                await usersAPI.updateDailyTarget(userId, userTargets[userId]);
            }
            
            onSuccess();
        } catch (err) {
            onError(err.response?.data?.message || 'Failed to update targets');
        } finally {
            setSaving(false);
        }
    };

    const updateUserTarget = (userId, value) => {
        setUserTargets(prev => ({
            ...prev,
            [userId]: Math.max(0, parseInt(value) || 0)
        }));
    };

    if (loading) {
        return (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="card-alpha max-w-4xl w-full p-6">
                    <p className="text-center text-tiger-orange">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="card-alpha max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-3xl font-bold alpha-text flex items-center gap-2">
                            <Star className="w-8 h-8 text-tiger-yellow" />
                            🎯 Manage Targets
                        </h2>
                        <p className="text-sm text-orange-200 mt-1">
                            Set monthly team goals and daily individual targets
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-tiger-orange hover:text-tiger-yellow transition-colors p-2"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Monthly Target */}
                <div className="mb-8 p-6 bg-gradient-to-r from-purple-900/40 to-blue-900/40 rounded-lg border-2 border-purple-500">
                    <div className="flex items-center gap-3 mb-4">
                        <Calendar className="w-8 h-8 text-purple-400" />
                        <div>
                            <h3 className="text-2xl font-bold text-purple-300">Monthly Team Target</h3>
                            <p className="text-sm text-purple-200">
                                Goal for {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                            </p>
                        </div>
                    </div>
                    <input
                        type="number"
                        value={monthlyTarget}
                        onChange={(e) => setMonthlyTarget(Math.max(0, parseInt(e.target.value) || 0))}
                        className="input-field text-3xl font-bold text-center"
                        min="0"
                    />
                    <p className="text-center text-sm text-purple-300 mt-2">
                        Total FTDs the entire team should achieve this month
                    </p>
                </div>

                {/* Daily Targets */}
                <div>
                    <h3 className="text-2xl font-bold alpha-text mb-4 flex items-center gap-2">
                        <Target className="w-6 h-6 text-tiger-orange" />
                        Daily Individual Targets
                    </h3>
                    <p className="text-sm text-orange-200 mb-4">
                        Set daily FTD goals for each team member (resets at midnight Israel Time)
                    </p>
                    
                    <div className="space-y-3">
                        {users.map((user) => (
                            <div key={user.id} className="flex items-center gap-4 p-4 bg-tiger-orange/10 rounded-lg border border-tiger-orange/30">
                                <img
                                    src={user.profilePicture}
                                    alt={user.name}
                                    className="w-12 h-12 rounded-full border-2 border-tiger-orange"
                                />
                                <div className="flex-1">
                                    <p className="font-bold text-tiger-yellow">{user.name}</p>
                                    <p className="text-xs text-orange-300">{user.email}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <label className="text-sm font-bold text-tiger-orange">Daily Target:</label>
                                    <input
                                        type="number"
                                        value={userTargets[user.id] || 0}
                                        onChange={(e) => updateUserTarget(user.id, e.target.value)}
                                        className="w-24 px-3 py-2 bg-dark-bg border-2 border-tiger-orange rounded text-center text-tiger-yellow font-bold"
                                        min="0"
                                    />
                                    <span className="text-sm text-tiger-orange">FTDs/day</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-6 pt-6 border-t-2 border-tiger-orange/30">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex-1 btn-alpha flex items-center justify-center gap-2"
                    >
                        <Save className="w-5 h-5" />
                        {saving ? '⏳ Saving...' : '💾 Save All Targets'}
                    </button>
                    <button
                        onClick={onClose}
                        className="flex-1 btn-secondary flex items-center justify-center gap-2"
                    >
                        <X className="w-5 h-5" />
                        ❌ Cancel
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

// Edit User Modal (unchanged)
const EditUserModal = ({ userId, user, onClose, onSuccess, onError }) => {
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        isAdmin: user?.isAdmin || false,
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await usersAPI.editUser(userId, formData);
            onSuccess();
        } catch (err) {
            onError(err.response?.data?.message || 'Failed to update user');
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
                <h2 className="text-2xl font-bold alpha-text mb-6">✏️ Edit User</h2>

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
                        <button type="submit" disabled={loading} className="flex-1 btn-alpha">
                            {loading ? '⏳ Saving...' : '💾 Save Changes'}
                        </button>
                        <button type="button" onClick={onClose} className="flex-1 btn-secondary">
                            ❌ Cancel
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

// Password Modal (unchanged)
const PasswordModal = ({ userId, userName, onClose, onSuccess, onError }) => {
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password.length < 6) {
            onError('Password must be at least 6 characters');
            return;
        }
        setLoading(true);
        try {
            await usersAPI.changePassword(userId, password);
            onSuccess();
        } catch (err) {
            onError(err.response?.data?.message || 'Failed to change password');
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
                <h2 className="text-2xl font-bold alpha-text mb-2">🔑 Change Password</h2>
                <p className="text-orange-200 mb-6">
                    For user: <strong>{userName}</strong>
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-tiger-orange mb-2">🔒 New Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input-field"
                            required
                            minLength={6}
                            placeholder="Enter new password (min 6 characters)"
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button type="submit" disabled={loading} className="flex-1 btn-alpha">
                            {loading ? '⏳ Changing...' : '✅ Change Password'}
                        </button>
                        <button type="button" onClick={onClose} className="flex-1 btn-secondary">
                            ❌ Cancel
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

// Avatar Modal (unchanged from original)
const AvatarModal = ({ userId, currentAvatar, userName, onClose, onSelect }) => {
    const [uploadedImage, setUploadedImage] = useState(null);
    const [customUrl, setCustomUrl] = useState('');
    const [uploading, setUploading] = useState(false);

    const handleFileUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const compressedImage = await compressImage(file);
            setUploadedImage(compressedImage);
        } catch (err) {
            alert('Failed to process image: ' + err.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="card-alpha max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold alpha-text">🖼️ Change Avatar</h2>
                        <p className="text-sm text-orange-200">For: <strong>{userName}</strong></p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-tiger-orange hover:text-tiger-yellow transition-colors p-2"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Current Avatar */}
                <div className="mb-6 text-center">
                    <p className="text-sm text-tiger-yellow mb-2 font-bold">Current Avatar:</p>
                    <img
                        src={currentAvatar}
                        alt="Current"
                        className="w-24 h-24 rounded-full mx-auto border-4 border-tiger-orange"
                    />
                </div>

                {/* Upload Section */}
                <div className="mb-6 p-4 bg-tiger-orange/20 rounded-lg border-2 border-tiger-orange">
                    <h3 className="font-bold text-tiger-yellow mb-3">📤 Upload Custom Image</h3>
                    <label className="block">
                        <div className="btn-alpha flex items-center justify-center gap-2 cursor-pointer">
                            <Upload className="w-5 h-5" />
                            {uploading ? 'Processing...' : 'Choose Image'}
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="hidden"
                            disabled={uploading}
                        />
                    </label>
                    {uploadedImage && (
                        <div className="mt-4 text-center">
                            <p className="text-sm text-tiger-yellow mb-2">Preview:</p>
                            <img
                                src={uploadedImage}
                                alt="Preview"
                                className="w-32 h-32 rounded-full mx-auto border-4 border-tiger-orange"
                            />
                            <button onClick={() => onSelect(uploadedImage)} className="mt-2 btn-alpha text-sm">
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
                            onClick={() => customUrl && onSelect(customUrl)}
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

// Create User Modal (unchanged from original)
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
                <h2 className="text-2xl font-bold alpha-text mb-6">➕ Create New User</h2>

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
                        <button type="submit" disabled={loading} className="flex-1 btn-alpha">
                            {loading ? '⏳ Creating...' : '✨ Create User'}
                        </button>
                        <button type="button" onClick={onClose} className="flex-1 btn-secondary">
                            ❌ Cancel
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default AdminPanel;