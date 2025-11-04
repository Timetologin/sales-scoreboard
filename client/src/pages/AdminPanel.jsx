import React, { useState, useEffect } from 'react';
import { usersAPI, settingsAPI, notesAPI } from '../services/api';
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
    TrendingUp,
    Calendar,
    FileText,
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
            reject(new Error('Invalid file type'));
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
                        height = (height * maxWidth) / width;
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width = (width * maxHeight) / height;
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
                        const reader = new FileReader();
                        reader.onloadend = () => resolve(reader.result);
                        reader.readAsDataURL(blob);
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
    const [showTargetsModal, setShowTargetsModal] = useState(false);
    const [showMonthlyTargetModal, setShowMonthlyTargetModal] = useState(false);
    const [editingFTDs, setEditingFTDs] = useState(null);
    const [editingPlusOnes, setEditingPlusOnes] = useState(null);
    const [showAvatarModal, setShowAvatarModal] = useState(null);
    const [message, setMessage] = useState({ type: '', text: '' });

    // ⭐ NEW: Notes states
    const [showNotesPanel, setShowNotesPanel] = useState(false);
    const [allNotes, setAllNotes] = useState([]);
    const [notesLoading, setNotesLoading] = useState(false);

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

    // ⭐ NEW: Fetch all notes
    const fetchAllNotes = async () => {
        setNotesLoading(true);
        try {
            const response = await notesAPI.getAllNotes();
            setAllNotes(response.data.allNotes || []);
        } catch (err) {
            console.error('Failed to fetch all notes:', err);
            showMessage('error', '❌ Failed to fetch notes');
        } finally {
            setNotesLoading(false);
        }
    };

    // ⭐ NEW: Toggle notes panel
    const handleToggleNotesPanel = async () => {
        if (!showNotesPanel) {
            await fetchAllNotes();
        }
        setShowNotesPanel(!showNotesPanel);
    };

    // ⭐ NEW: Get color classes for notes
    const getColorClasses = (color) => {
        const colors = {
            blue: 'bg-blue-900/40 border-blue-500',
            green: 'bg-green-900/40 border-green-500',
            purple: 'bg-purple-900/40 border-purple-500',
            orange: 'bg-orange-900/40 border-orange-500'
        };
        return colors[color] || colors.blue;
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
        const user = users.find((u) => u.id === userId);
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
            showMessage('success', '✅ Added +1 Plus One!');
        } catch (err) {
            showMessage('error', '❌ Failed to add Plus One');
        }
    };

    const handleDecrementPlusOne = async (userId) => {
        const user = users.find((u) => u.id === userId);
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
            await usersAPI.updateUserProfile(userId, { profilePicture: newAvatar });
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
    const totalNotes = allNotes.reduce((sum, userNotes) => sum + (userNotes.notes?.length || 0), 0);

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

                {/* Toast Messages */}
                <AnimatePresence>
                    {message.text && (
                        <motion.div
                            initial={{ opacity: 0, y: -50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -50 }}
                            className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-xl flex items-center gap-3 ${
                                message.type === 'success'
                                    ? 'bg-green-600 text-white'
                                    : 'bg-red-600 text-white'
                            }`}
                        >
                            {message.type === 'success' ? (
                                <CheckCircle className="w-6 h-6" />
                            ) : (
                                <AlertCircle className="w-6 h-6" />
                            )}
                            <span className="font-semibold">{message.text}</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Stats Cards */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
                >
                    <div className="card-alpha text-center">
                        <Users className="w-12 h-12 text-tiger-orange mx-auto mb-3" />
                        <h3 className="text-lg font-bold text-orange-200">Total Users</h3>
                        <p className="text-4xl font-extrabold alpha-text">{users.length}</p>
                    </div>

                    <div className="card-alpha text-center">
                        <Target className="w-12 h-12 text-green-400 mx-auto mb-3" />
                        <h3 className="text-lg font-bold text-orange-200">Total FTD's</h3>
                        <p className="text-4xl font-extrabold alpha-text">{totalFTDs}</p>
                    </div>

                    <div className="card-alpha text-center">
                        <Award className="w-12 h-12 text-blue-400 mx-auto mb-3" />
                        <h3 className="text-lg font-bold text-orange-200">Total Plus Ones</h3>
                        <p className="text-4xl font-extrabold alpha-text">{totalPlusOnes}</p>
                    </div>

                    <div className="card-alpha text-center">
                        <Crown className="w-12 h-12 text-tiger-yellow mx-auto mb-3" />
                        <h3 className="text-lg font-bold text-orange-200">Top Player</h3>
                        <p className="text-2xl font-extrabold alpha-text truncate">
                            {users.length > 0 ? users[0].name : '-'}
                        </p>
                    </div>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-wrap gap-4 mb-8"
                >
                    {/* ⭐ NEW: All Notes Button */}
                    <button
                        onClick={handleToggleNotesPanel}
                        className="btn-secondary flex items-center gap-2"
                    >
                        <FileText className="w-5 h-5" />
                        📝 {showNotesPanel ? 'Hide All Notes' : 'View All Notes'}
                        {showNotesPanel && totalNotes > 0 && (
                            <span className="ml-1 px-2 py-0.5 bg-tiger-orange rounded-full text-xs font-bold">
                                {totalNotes}
                            </span>
                        )}
                    </button>

                    <button
                        onClick={() => setShowTargetsModal(true)}
                        className="btn-secondary flex items-center gap-2"
                    >
                        <Target className="w-5 h-5" />
                        🎯 Manage Daily Targets
                    </button>

                    <button
                        onClick={() => setShowMonthlyTargetModal(true)}
                        className="btn-alpha flex items-center gap-2"
                    >
                        <Calendar className="w-5 h-5" />
                        📅 Set Monthly Target
                    </button>

                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="btn-secondary flex items-center gap-2"
                    >
                        <PlusCircle className="w-5 h-5" />
                        ➕ Create New User
                    </button>

                    <button
                        onClick={fetchUsers}
                        className="btn-secondary flex items-center gap-2"
                    >
                        <RefreshCw className="w-5 h-5" />
                        🔄 Refresh
                    </button>
                </motion.div>

                {/* ⭐ NEW: All Notes Panel */}
                <AnimatePresence>
                    {showNotesPanel && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mb-8"
                        >
                            <div className="card-alpha">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-3xl font-bold alpha-text flex items-center gap-2">
                                        <FileText className="w-8 h-8" />
                                        📝 All User Notes
                                    </h2>
                                    <button
                                        onClick={fetchAllNotes}
                                        className="btn-secondary flex items-center gap-2 text-sm"
                                    >
                                        <RefreshCw className="w-4 h-4" />
                                        Refresh Notes
                                    </button>
                                </div>

                                {notesLoading ? (
                                    <div className="text-center py-8">
                                        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-tiger-orange mx-auto mb-4"></div>
                                        <p className="text-tiger-orange">Loading notes...</p>
                                    </div>
                                ) : allNotes.length === 0 ? (
                                    <div className="text-center py-12">
                                        <FileText className="w-24 h-24 text-tiger-orange/30 mx-auto mb-4" />
                                        <h3 className="text-2xl font-bold text-tiger-orange mb-2">No notes yet</h3>
                                        <p className="text-orange-200">Users haven't created any notes</p>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {allNotes.map((userNotes) => (
                                            <div key={userNotes.userId} className="border-b border-tiger-orange/30 pb-6 last:border-b-0">
                                                {/* User Header */}
                                                <div className="flex items-center gap-3 mb-4">
                                                    <img
                                                        src={userNotes.userAvatar}
                                                        alt={userNotes.userName}
                                                        className="w-12 h-12 rounded-full border-2 border-tiger-orange"
                                                    />
                                                    <div>
                                                        <h3 className="text-xl font-bold text-tiger-yellow">
                                                            {userNotes.userName}
                                                        </h3>
                                                        <p className="text-sm text-orange-200">{userNotes.userEmail}</p>
                                                    </div>
                                                    <div className="ml-auto">
                                                        <span className="px-3 py-1 bg-tiger-orange/30 text-tiger-yellow rounded-full text-sm font-bold">
                                                            {userNotes.notes.length} {userNotes.notes.length === 1 ? 'Note' : 'Notes'}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Notes Grid */}
                                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                    {userNotes.notes.map((note) => (
                                                        <div
                                                            key={note._id}
                                                            className={`p-4 rounded-lg border-2 ${getColorClasses(note.color)}`}
                                                        >
                                                            <h4 className="font-bold text-tiger-yellow text-sm mb-2">
                                                                {note.title}
                                                            </h4>
                                                            <p className="text-orange-200 text-xs whitespace-pre-wrap mb-2">
                                                                {note.content}
                                                            </p>
                                                            <p className="text-orange-300/60 text-xs">
                                                                {new Date(note.updatedAt).toLocaleDateString()} at{' '}
                                                                {new Date(note.updatedAt).toLocaleTimeString()}
                                                            </p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Users Table */}
                <div className="card-alpha overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b-2 border-tiger-orange">
                                    <th className="px-4 py-4 text-center alpha-text">🏆 Rank</th>
                                    <th className="px-4 py-4 text-center alpha-text">👤 User</th>
                                    <th className="px-4 py-4 text-center alpha-text">📧 Email</th>
                                    <th className="px-4 py-4 text-center alpha-text">🎯 FTD's</th>
                                    <th className="px-4 py-4 text-center alpha-text">⭐ Plus Ones</th>
                                    <th className="px-4 py-4 text-center alpha-text">📊 Daily Progress</th>
                                    <th className="px-4 py-4 text-center alpha-text">👑 Role</th>
                                    <th className="px-4 py-4 text-center alpha-text">🎮 Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {users.map((user, index) => (
                                    <motion.tr
                                        key={user.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="border-b border-gray-700 hover:bg-tiger-orange/10 transition-colors"
                                    >
                                        {/* Rank */}
                                        <td className="px-4 py-4 text-center">
                                            <div className="flex items-center justify-center">
                                                <span
                                                    className={`px-4 py-2 rounded-full font-bold ${
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
                                                    <div
                                                        className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 rounded-full transition-all flex items-center justify-center cursor-pointer"
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

                                        {/* FTD's with +/- buttons */}
                                        <td className="px-4 py-4">
                                            {editingFTDs === user.id ? (
                                                <div className="flex items-center justify-center gap-2">
                                                    <input
                                                        type="number"
                                                        defaultValue={user.ftds}
                                                        onKeyPress={(e) => {
                                                            if (e.key === 'Enter') {
                                                                handleUpdateFTDs(user.id, e.target.value);
                                                            }
                                                        }}
                                                        className="w-20 px-2 py-1 bg-gray-700 border border-tiger-orange rounded text-center text-white"
                                                        autoFocus
                                                    />
                                                    <button
                                                        onClick={(e) => {
                                                            const input = e.target.parentElement.querySelector('input');
                                                            handleUpdateFTDs(user.id, input.value);
                                                        }}
                                                        className="p-1 bg-green-600 hover:bg-green-700 rounded"
                                                    >
                                                        <Save className="w-4 h-4 text-white" />
                                                    </button>
                                                    <button
                                                        onClick={() => setEditingFTDs(null)}
                                                        className="p-1 bg-red-600 hover:bg-red-700 rounded"
                                                    >
                                                        <X className="w-4 h-4 text-white" />
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
                                                        title="Remove FTD"
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
                                                        title="Add FTD"
                                                    >
                                                        <Plus className="w-4 h-4 text-white" />
                                                    </button>
                                                </div>
                                            )}
                                        </td>

                                        {/* Plus Ones with +/- buttons */}
                                        <td className="px-4 py-4">
                                            {editingPlusOnes === user.id ? (
                                                <div className="flex items-center justify-center gap-2">
                                                    <input
                                                        type="number"
                                                        defaultValue={user.plusOnes}
                                                        onKeyPress={(e) => {
                                                            if (e.key === 'Enter') {
                                                                handleUpdatePlusOnes(user.id, e.target.value);
                                                            }
                                                        }}
                                                        className="w-20 px-2 py-1 bg-gray-700 border border-tiger-orange rounded text-center text-white"
                                                        autoFocus
                                                    />
                                                    <button
                                                        onClick={(e) => {
                                                            const input = e.target.parentElement.querySelector('input');
                                                            handleUpdatePlusOnes(user.id, input.value);
                                                        }}
                                                        className="p-1 bg-green-600 hover:bg-green-700 rounded"
                                                    >
                                                        <Save className="w-4 h-4 text-white" />
                                                    </button>
                                                    <button
                                                        onClick={() => setEditingPlusOnes(null)}
                                                        className="p-1 bg-red-600 hover:bg-red-700 rounded"
                                                    >
                                                        <X className="w-4 h-4 text-white" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={() => handleDecrementPlusOne(user.id)}
                                                        disabled={user.plusOnes <= 0}
                                                        className={`p-2 rounded-lg transition-all ${
                                                            user.plusOnes <= 0
                                                                ? 'bg-gray-600 cursor-not-allowed opacity-50'
                                                                : 'bg-red-600 hover:bg-red-700 prowl-effect'
                                                        }`}
                                                        title="Remove Plus One"
                                                    >
                                                        <Minus className="w-4 h-4 text-white" />
                                                    </button>

                                                    <span
                                                        onClick={() => setEditingPlusOnes(user.id)}
                                                        className="text-2xl font-bold text-blue-400 min-w-[3rem] text-center cursor-pointer hover:text-blue-300 transition-colors"
                                                    >
                                                        {user.plusOnes}
                                                    </span>

                                                    <button
                                                        onClick={() => handleIncrementPlusOne(user.id)}
                                                        className="p-2 bg-green-600 hover:bg-green-700 rounded-lg transition-all prowl-effect"
                                                        title="Add Plus One"
                                                    >
                                                        <Plus className="w-4 h-4 text-white" />
                                                    </button>
                                                </div>
                                            )}
                                        </td>

                                        {/* Daily Progress */}
                                        <td className="px-4 py-4">
                                            <div className="text-center">
                                                {user.dailyTarget && user.dailyTarget > 0 ? (
                                                    <div className="space-y-1">
                                                        <div className="flex items-center justify-center gap-2">
                                                            <Calendar className="w-4 h-4 text-tiger-orange" />
                                                            <span className="text-sm text-orange-200">
                                                                {user.todayFTDs || 0} / {user.dailyTarget}
                                                            </span>
                                                        </div>
                                                        <div className="w-full bg-gray-700 rounded-full h-2">
                                                            <div
                                                                className="bg-tiger-gradient h-2 rounded-full transition-all"
                                                                style={{
                                                                    width: `${Math.min(
                                                                        ((user.todayFTDs || 0) / user.dailyTarget) * 100,
                                                                        100
                                                                    )}%`,
                                                                }}
                                                            ></div>
                                                        </div>
                                                        {user.todayFTDs >= user.dailyTarget && (
                                                            <span className="text-xs text-green-400 font-bold">
                                                                ✅ Target Achieved!
                                                            </span>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="text-sm text-gray-500">No target</span>
                                                )}
                                            </div>
                                        </td>

                                        {/* Role */}
                                        <td className="px-4 py-4">
                                            <div className="flex justify-center">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-sm font-bold ${
                                                        user.isAdmin
                                                            ? 'bg-purple-600 text-white'
                                                            : 'bg-gray-600 text-white'
                                                    }`}
                                                >
                                                    {user.isAdmin ? '👑 Admin' : '👤 User'}
                                                </span>
                                            </div>
                                        </td>

                                        {/* Actions */}
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
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Instructions */}
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
                                <li>
                                    <strong className="text-green-400">Plus (+)</strong> button adds 1 FTD
                                </li>
                                <li>
                                    <strong className="text-red-400">Minus (-)</strong> button removes 1 FTD
                                </li>
                                <li>FTD count cannot go below 0</li>
                                <li>Click on number to edit directly</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-tiger-yellow font-bold mb-2 flex items-center gap-2">
                                <Award className="w-5 h-5" />
                                Plus Ones Management:
                            </h4>
                            <ul className="list-disc list-inside space-y-1 text-sm">
                                <li>Same controls as FTDs</li>
                                <li>Track bonus achievements</li>
                                <li>Plus Ones cannot go below 0</li>
                                <li>Click on number to edit directly</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-tiger-yellow font-bold mb-2 flex items-center gap-2">
                                <Image className="w-5 h-5" />
                                Avatar Management:
                            </h4>
                            <ul className="list-disc list-inside space-y-1 text-sm">
                                <li>Click on user avatar to change it</li>
                                <li>Upload custom image (auto-compressed)</li>
                                <li>Choose from avatar gallery</li>
                                <li>Use image URL</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-tiger-yellow font-bold mb-2 flex items-center gap-2">
                                <FileText className="w-5 h-5" />
                                Notes Management:
                            </h4>
                            <ul className="list-disc list-inside space-y-1 text-sm">
                                <li>View all user notes in one place</li>
                                <li>See notes organized by user</li>
                                <li>Track user engagement</li>
                                <li>Read-only access to user notes</li>
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

            {showTargetsModal && (
                <TargetsModal
                    users={users}
                    onClose={() => setShowTargetsModal(false)}
                    onSuccess={() => {
                        setShowTargetsModal(false);
                        fetchUsers();
                        showMessage('success', '✅ Targets updated successfully!');
                    }}
                    onError={(msg) => showMessage('error', msg)}
                />
            )}

            {showMonthlyTargetModal && (
                <MonthlyTargetModal
                    onClose={() => setShowMonthlyTargetModal(false)}
                    onSuccess={() => {
                        setShowMonthlyTargetModal(false);
                        showMessage('success', '✅ Monthly target updated successfully!');
                    }}
                    onError={(msg) => showMessage('error', msg)}
                />
            )}
        </div>
    );
};

// ⭐ Targets Modal Component
const TargetsModal = ({ users, onClose, onSuccess, onError }) => {
    const [targets, setTargets] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const initialTargets = {};
        users.forEach((user) => {
            initialTargets[user.id] = user.dailyTarget || 0;
        });
        setTargets(initialTargets);
    }, [users]);

    const handleSaveTargets = async () => {
        setLoading(true);
        try {
            const promises = Object.entries(targets).map(([userId, target]) => {
                return usersAPI.updateDailyTarget(userId, parseInt(target) || 0);
            });
            await Promise.all(promises);
            onSuccess();
        } catch (err) {
            console.error('Failed to update targets:', err);
            onError('❌ Failed to update targets');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="card-alpha max-w-2xl w-full p-6 max-h-[80vh] overflow-y-auto"
            >
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold alpha-text flex items-center gap-2">
                            <Target className="w-8 h-8" />
                            🎯 Manage Daily Targets
                        </h2>
                        <p className="text-sm text-orange-200 mt-1">Set daily FTD targets for each user</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-tiger-orange hover:text-tiger-yellow transition-colors p-2"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="space-y-4">
                    {users.map((user) => (
                        <div
                            key={user.id}
                            className="flex items-center justify-between p-4 bg-tiger-orange/10 rounded-lg border border-tiger-orange/30"
                        >
                            <div className="flex items-center gap-3">
                                <img
                                    src={user.profilePicture}
                                    alt={user.name}
                                    className="w-10 h-10 rounded-full border-2 border-tiger-orange"
                                />
                                <div>
                                    <p className="font-bold text-tiger-yellow">{user.name}</p>
                                    <p className="text-xs text-orange-200">
                                        Current: {user.ftds} FTDs | Today: {user.todayFTDs || 0} FTDs
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <label className="text-sm text-orange-200 font-semibold">Daily Target:</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={targets[user.id] || 0}
                                    onChange={(e) =>
                                        setTargets({
                                            ...targets,
                                            [user.id]: e.target.value,
                                        })
                                    }
                                    className="w-20 px-3 py-2 bg-gray-700 border-2 border-tiger-orange rounded-lg text-center text-white font-bold focus:outline-none focus:border-tiger-yellow"
                                />
                                <span className="text-sm text-orange-200">FTDs</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex gap-3 pt-6 mt-6 border-t border-tiger-orange/30">
                    <button
                        onClick={handleSaveTargets}
                        disabled={loading}
                        className="flex-1 btn-alpha flex items-center justify-center gap-2"
                    >
                        <Save className="w-5 h-5" />
                        {loading ? '⏳ Saving...' : '💾 Save Targets'}
                    </button>
                    <button onClick={onClose} className="flex-1 btn-secondary flex items-center justify-center gap-2">
                        <X className="w-5 h-5" />
                        ❌ Cancel
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

// ⭐ Monthly Target Modal Component
const MonthlyTargetModal = ({ onClose, onSuccess, onError }) => {
    const [monthlyTarget, setMonthlyTarget] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCurrentTarget();
    }, []);

    const fetchCurrentTarget = async () => {
        try {
            const response = await settingsAPI.getMonthlyTarget();
            setMonthlyTarget(response.data.monthlyTarget);
        } catch (err) {
            console.error('Failed to fetch monthly target:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            await settingsAPI.updateMonthlyTarget(parseInt(monthlyTarget) || 0);
            onSuccess();
        } catch (err) {
            console.error('Failed to update monthly target:', err);
            onError('❌ Failed to update monthly target');
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
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold alpha-text flex items-center gap-2">
                            <Calendar className="w-8 h-8" />
                            📅 Monthly Team Target
                        </h2>
                        <p className="text-sm text-orange-200 mt-1">
                            Set the FTD goal for {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-tiger-orange hover:text-tiger-yellow transition-colors p-2"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {loading ? (
                    <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-tiger-orange mx-auto"></div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="p-4 bg-tiger-orange/20 rounded-lg border-2 border-tiger-orange">
                            <label className="block text-sm font-bold text-tiger-yellow mb-3">
                                🎯 Monthly Target (Total FTDs)
                            </label>
                            <input
                                type="number"
                                min="0"
                                value={monthlyTarget}
                                onChange={(e) => setMonthlyTarget(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-700 border-2 border-tiger-orange rounded-lg text-center text-white text-3xl font-bold focus:outline-none focus:border-tiger-yellow"
                            />
                            <p className="text-xs text-orange-200 mt-2 text-center">
                                This is the total FTDs target for the entire team this month
                            </p>
                        </div>

                        <div className="flex gap-3 pt-4">
                            <button
                                onClick={handleSave}
                                disabled={loading}
                                className="flex-1 btn-alpha flex items-center justify-center gap-2"
                            >
                                <Save className="w-5 h-5" />
                                {loading ? '⏳ Saving...' : '💾 Save Target'}
                            </button>
                            <button onClick={onClose} className="flex-1 btn-secondary flex items-center justify-center gap-2">
                                <X className="w-5 h-5" />
                                ❌ Cancel
                            </button>
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

// Edit User Modal
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

// Password Modal
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

// Avatar Modal
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
        <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
            onClick={(e) => {
                if (e.target === e.currentTarget) {
                    onClose();
                }
            }}
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
                        <p className="text-sm text-orange-200">
                            For: <strong>{userName}</strong>
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-tiger-orange hover:text-tiger-yellow transition-colors p-2"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="mb-6 text-center">
                    <p className="text-sm text-tiger-yellow mb-2 font-bold">Current Avatar:</p>
                    <img
                        src={currentAvatar}
                        alt="Current"
                        className="w-24 h-24 rounded-full mx-auto border-4 border-tiger-orange"
                    />
                </div>

                <div className="mb-6 p-4 bg-tiger-orange/20 rounded-lg border-2 border-tiger-orange">
                    <h3 className="font-bold text-tiger-yellow mb-3">📤 Upload Custom Image</h3>
                    <label className="block">
                        <div className="btn-alpha flex items-center justify-center gap-2 cursor-pointer">
                            <Upload className="w-5 h-5" />
                            {uploading ? '⏳ Processing...' : '📤 Choose Image'}
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
                            <img
                                src={uploadedImage}
                                alt="Preview"
                                className="w-32 h-32 rounded-full mx-auto border-4 border-tiger-yellow mb-3"
                            />
                            <button onClick={() => onSelect(uploadedImage)} className="btn-alpha">
                                ✅ Use This Image
                            </button>
                        </div>
                    )}
                </div>

                <div className="mb-6 p-4 bg-tiger-orange/20 rounded-lg border-2 border-tiger-orange">
                    <h3 className="font-bold text-tiger-yellow mb-3">🔗 Use Image URL</h3>
                    <div className="flex gap-2">
                        <input
                            type="url"
                            value={customUrl}
                            onChange={(e) => setCustomUrl(e.target.value)}
                            placeholder="https://example.com/image.jpg"
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