import React, { useState, useEffect } from 'react';
import { usersAPI } from '../services/api';
import { Trophy, Crown, Medal, TrendingDown, Users, Target } from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLeaderboard();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchLeaderboard, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await usersAPI.getLeaderboard();
      setLeaderboard(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load leaderboard');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Medal className="w-6 h-6 text-orange-600" />;
      default:
        return null;
    }
  };

  const getRankBadgeColor = (rank) => {
    switch (rank) {
      case 1:
        return 'gold-gradient text-white pulse-glow';
      case 2:
        return 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800';
      case 3:
        return 'bg-gradient-to-r from-orange-400 to-orange-600 text-white';
      default:
        return 'bg-primary-600 text-white';
    }
  };

  const totalFTDs = leaderboard.reduce((sum, user) => sum + user.ftds, 0);
  const minFTDs = leaderboard[0]?.ftds || 0;
  const maxFTDs = leaderboard[leaderboard.length - 1]?.ftds || 1;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Stats */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-3">
              <Trophy className="w-10 h-10 text-yellow-500" />
              FTD Leaderboard
            </h1>
            <p className="text-gray-600">First Time Deposits - Lower is Better! 🎯</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="card text-center">
              <Users className="w-8 h-8 text-primary-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Total Players</p>
              <p className="text-3xl font-bold text-gray-900">{leaderboard.length}</p>
            </div>
            <div className="card text-center">
              <Target className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Total FTD's</p>
              <p className="text-3xl font-bold text-gray-900">{totalFTDs}</p>
            </div>
            <div className="card text-center">
              <TrendingDown className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Best (Lowest)</p>
              <p className="text-3xl font-bold text-gray-900">
                {leaderboard[0] ? `${leaderboard[0].ftds} FTD's` : '0 FTD\'s'}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Leaderboard */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <div className="space-y-3">
          {leaderboard.map((user, index) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`card flex items-center gap-4 ${
                user.rank === 1 ? 'ring-2 ring-yellow-400 shadow-2xl' : ''
              }`}
            >
              {/* Rank Badge */}
              <div className="flex-shrink-0">
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg ${getRankBadgeColor(
                    user.rank
                  )}`}
                >
                  {user.rank === 1 && <Crown className="w-6 h-6" />}
                  {user.rank !== 1 && `#${user.rank}`}
                </div>
              </div>

              {/* Profile Picture */}
              <img
                src={user.profilePicture}
                alt={user.name}
                className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-md"
              />

              {/* User Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-bold text-gray-900 truncate">{user.name}</h3>
                  {getRankIcon(user.rank)}
                </div>
                <p className="text-sm text-gray-600 truncate">{user.email}</p>
                
                {/* Progress Bar - Inverted logic */}
                <div className="mt-2 bg-gray-200 rounded-full h-2 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ 
                      width: maxFTDs > 0 
                        ? `${100 - ((user.ftds / maxFTDs) * 100)}%` 
                        : '0%'
                    }}
                    transition={{ duration: 1, delay: index * 0.05 }}
                    className={`h-full ${
                      user.rank === 1 ? 'gold-gradient' : 'bg-primary-600'
                    }`}
                  />
                </div>
              </div>

              {/* FTDs Count */}
              <div className="text-right flex-shrink-0">
                <p className="text-2xl font-bold text-primary-600">
                  {user.ftds} FTD's
                </p>
                <p className="text-xs text-gray-500">
                  {user.rank === 1 ? '🏆 Leader' : `+${user.ftds - minFTDs} from leader`}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {leaderboard.length === 0 && !loading && (
          <div className="text-center py-12">
            <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No data yet</h3>
            <p className="text-gray-500">Start getting FTD's to appear on the leaderboard!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;