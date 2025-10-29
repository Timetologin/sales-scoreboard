import React, { useState, useEffect } from 'react';
import { usersAPI } from '../services/api';
import { Trophy, Crown, Medal, TrendingDown, Users, Target, Award } from 'lucide-react';
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
        return <Crown className="w-6 h-6 text-tiger-yellow" />;
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
        return 'alpha-badge';
      case 2:
        return 'bg-gradient-to-r from-gray-400 to-gray-500 text-gray-900 px-4 py-2 rounded-full font-bold shadow-lg';
      case 3:
        return 'bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-full font-bold shadow-lg';
      default:
        return 'tiger-badge';
    }
  };

  const totalFTDs = leaderboard.reduce((sum, user) => sum + user.ftds, 0);
  const totalPlusOnes = leaderboard.reduce((sum, user) => sum + (user.plusOnes || 0), 0);
  const minFTDs = leaderboard[0]?.ftds || 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-tiger-orange mx-auto mb-4"></div>
          <p className="text-tiger-orange font-semibold">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Stats */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="text-center mb-6">
            <h1 className="text-5xl font-extrabold alpha-text mb-2 flex items-center justify-center gap-3">
              <Trophy className="w-12 h-12 text-tiger-yellow" />
              FTD Leaderboard
            </h1>
            <p className="text-tiger-orange font-bold text-xl">First Time Deposits - Lower is Better! 🎯</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="card-alpha text-center prowl-effect">
              <Users className="w-10 h-10 text-tiger-orange mx-auto mb-2" />
              <p className="text-sm text-tiger-yellow font-bold">Total Players</p>
              <p className="text-4xl font-extrabold alpha-text">{leaderboard.length}</p>
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
              <TrendingDown className="w-10 h-10 text-blue-500 mx-auto mb-2" />
              <p className="text-sm text-tiger-yellow font-bold">Best (Lowest)</p>
              <p className="text-4xl font-extrabold alpha-text">
                {leaderboard[0] ? `${leaderboard[0].ftds} FTD's` : '0 FTD\'s'}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Leaderboard */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/30 border-2 border-red-500 rounded-lg">
            <p className="text-red-300 font-bold">{error}</p>
          </div>
        )}

        <div className="space-y-3">
          {leaderboard.map((user, index) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`card-alpha flex items-center gap-4 prowl-effect ${
                user.rank === 1 ? 'ring-4 ring-tiger-yellow shadow-2xl' : ''
              }`}
            >
              {/* Rank Badge */}
              <div className="flex-shrink-0">
                <div className={getRankBadgeColor(user.rank)}>
                  {user.rank === 1 && <Crown className="w-8 h-8" />}
                  {user.rank !== 1 && `#${user.rank}`}
                </div>
              </div>

              {/* Profile Picture */}
              <img
                src={user.profilePicture}
                alt={user.name}
                className="w-20 h-20 rounded-full object-cover border-4 border-tiger-orange shadow-lg"
              />

              {/* User Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-xl font-extrabold text-tiger-yellow truncate">{user.name}</h3>
                  {getRankIcon(user.rank)}
                </div>
                <p className="text-sm text-orange-200 truncate">{user.email}</p>
                
                {/* Stats Row */}
                <div className="flex gap-4 mt-2">
                  <div className="flex items-center gap-1">
                    <Target className="w-4 h-4 text-tiger-yellow" />
                    <span className="text-xs text-tiger-orange font-bold">{user.ftds} FTD's</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Award className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs text-cyan-300 font-bold">{user.plusOnes || 0} +1's</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-2 bg-dark-bg rounded-full h-3 overflow-hidden border border-tiger-orange">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ 
                      width: `${100 - ((user.ftds / (leaderboard[leaderboard.length - 1]?.ftds || 1)) * 100)}%`
                    }}
                    transition={{ duration: 1, delay: index * 0.05 }}
                    className={user.rank === 1 ? 'h-full alpha-tiger' : 'h-full tiger-gradient'}
                  />
                </div>
              </div>

              {/* FTDs Count */}
              <div className="text-right flex-shrink-0">
                <p className="text-3xl font-extrabold alpha-text">
                  {user.ftds}
                </p>
                <p className="text-xs text-tiger-orange font-bold">
                  {user.rank === 1 ? '🏆 Leader' : `+${user.ftds - minFTDs} from leader`}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {leaderboard.length === 0 && !loading && (
          <div className="text-center py-12">
            <Trophy className="w-24 h-24 text-tiger-orange/30 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-tiger-orange mb-2">No data yet</h3>
            <p className="text-orange-200">Start getting FTD's to appear on the leaderboard!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;