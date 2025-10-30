import React, { useState, useEffect } from 'react';
import { usersAPI } from '../services/api';
import { Trophy, Crown, Medal, TrendingUp, Users, Target, Award } from 'lucide-react';
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
      
      // ⭐ שינוי: מיון מהגבוה לנמוך (הפוך מהקוד המקורי)
      const sortedData = response.data.sort((a, b) => b.ftds - a.ftds);
      
      // עדכון דירוגים
      const rankedData = sortedData.map((user, index) => ({
        ...user,
        rank: index + 1
      }));
      
      setLeaderboard(rankedData);
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
        return <Crown className="w-8 h-8 text-yellow-400" />;
      case 2:
        return <Medal className="w-8 h-8 text-gray-400" />;
      case 3:
        return <Medal className="w-8 h-8 text-orange-600" />;
      default:
        return null;
    }
  };

  const getPodiumHeight = (rank) => {
    switch (rank) {
      case 1:
        return 'h-80'; // ⭐ Increased height for winner
      case 2:
        return 'h-64';
      case 3:
        return 'h-56';
      default:
        return 'h-40';
    }
  };

  const getPodiumOrder = (rank) => {
    switch (rank) {
      case 1:
        return 'order-2'; // מרכז
      case 2:
        return 'order-1'; // שמאל
      case 3:
        return 'order-3'; // ימין
      default:
        return '';
    }
  };

  const totalFTDs = leaderboard.reduce((sum, user) => sum + user.ftds, 0);
  const totalPlusOnes = leaderboard.reduce((sum, user) => sum + (user.plusOnes || 0), 0);
  const maxFTDs = leaderboard[0]?.ftds || 0; // ⭐ שינוי: max במקום min

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

  // TOP 3 Players
  const topThree = leaderboard.slice(0, 3);
  const restOfPlayers = leaderboard.slice(3);

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
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
            {/* ⭐ שינוי: Higher is Better */}
            <p className="text-tiger-orange font-bold text-xl flex items-center justify-center gap-2">
              First Time Deposits - 🔥 Higher is Better! 🚀
            </p>
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
              {/* ⭐ שינוי: TrendingUp במקום TrendingDown */}
              <TrendingUp className="w-10 h-10 text-blue-500 mx-auto mb-2" />
              <p className="text-sm text-tiger-yellow font-bold">Best (Highest)</p>
              <p className="text-4xl font-extrabold alpha-text">
                {leaderboard[0] ? `${leaderboard[0].ftds} FTD's` : '0 FTD\'s'}
              </p>
            </div>
          </div>
        </motion.div>

        {/* ⭐ חדש: TOP 3 PODIUM - FIXED SPACING! */}
        {topThree.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <h2 className="text-4xl font-extrabold text-center alpha-text mb-8 flex items-center justify-center gap-3">
              <Trophy className="w-10 h-10 text-yellow-400" />
              🏆 TOP 3 CHAMPIONS 🏆
              <Trophy className="w-10 h-10 text-yellow-400" />
            </h2>

            <div className="flex justify-center items-end gap-6 mb-8 flex-wrap md:flex-nowrap px-4">
              {topThree.map((user) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: user.rank * 0.2 }}
                  className={`${getPodiumOrder(user.rank)} ${getPodiumHeight(user.rank)} 
                    ${user.rank === 1 ? 'w-80' : 'w-72'} 
                    card-alpha relative overflow-hidden group prowl-effect flex flex-col justify-between`}
                  style={{
                    background: user.rank === 1 
                      ? 'linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(255, 165, 0, 0.1))'
                      : user.rank === 2
                      ? 'linear-gradient(135deg, rgba(192, 192, 192, 0.2), rgba(169, 169, 169, 0.1))'
                      : 'linear-gradient(135deg, rgba(205, 127, 50, 0.2), rgba(184, 115, 51, 0.1))',
                    borderWidth: user.rank === 1 ? '4px' : '3px',
                    borderColor: user.rank === 1 
                      ? '#FFD700' 
                      : user.rank === 2 
                      ? '#C0C0C0' 
                      : '#CD7F32',
                  }}
                >
                  {/* Rank Badge */}
                  <div className="absolute top-4 right-4 z-10">
                    <div className={`
                      ${user.rank === 1 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-yellow-900' : ''}
                      ${user.rank === 2 ? 'bg-gradient-to-r from-gray-400 to-gray-500 text-gray-900' : ''}
                      ${user.rank === 3 ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white' : ''}
                      px-4 py-2 rounded-full font-bold shadow-lg text-xl
                    `}>
                      #{user.rank}
                    </div>
                  </div>

                  {/* Top Section */}
                  <div className="pt-4">
                    {/* Medal/Crown */}
                    <div className="text-center mb-3">
                      {user.rank === 1 && (
                        <motion.div
                          animate={{ rotate: [0, -10, 10, -10, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <Crown className="w-20 h-20 text-yellow-400 mx-auto drop-shadow-lg" />
                        </motion.div>
                      )}
                      {user.rank === 2 && <Medal className="w-16 h-16 text-gray-400 mx-auto drop-shadow-lg" />}
                      {user.rank === 3 && <Medal className="w-16 h-16 text-orange-600 mx-auto drop-shadow-lg" />}
                    </div>

                    {/* Profile Picture */}
                    <div className="flex justify-center mb-3">
                      <img
                        src={user.profilePicture}
                        alt={user.name}
                        className={`rounded-full object-cover shadow-2xl
                          ${user.rank === 1 ? 'w-32 h-32 border-8 border-yellow-400' : 'w-24 h-24 border-6 border-tiger-orange'}
                        `}
                      />
                    </div>

                    {/* ⭐ FIXED: User Name with better spacing */}
                    <h3 className={`text-center font-extrabold px-4 leading-tight
                      ${user.rank === 1 ? 'text-2xl text-yellow-300 mb-2' : 'text-xl text-tiger-yellow mb-2'}
                    `}>
                      {user.name}
                    </h3>

                    {/* ⭐ FIXED: Email with better spacing */}
                    <p className="text-center text-xs text-orange-200 px-4 mb-3 leading-relaxed">
                      {user.email}
                    </p>
                  </div>

                  {/* Bottom Section */}
                  <div className="pb-4">
                    {/* FTD Count - BIG */}
                    <div className="text-center mb-2">
                      <p className={`font-extrabold leading-none
                        ${user.rank === 1 ? 'text-5xl text-yellow-400' : 'text-4xl alpha-text'}
                      `}>
                        {user.ftds}
                      </p>
                      <p className="text-sm text-tiger-orange font-bold mt-1">FTD's</p>
                    </div>

                    {/* Plus Ones */}
                    <div className="flex justify-center items-center gap-2 mb-3">
                      <Award className="w-5 h-5 text-cyan-400" />
                      <span className="text-cyan-300 font-bold text-sm">
                        {user.plusOnes || 0} +1's
                      </span>
                    </div>

                    {/* Celebration Text for Winner */}
                    {user.rank === 1 && (
                      <motion.div
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="text-center px-2"
                      >
                        <p className="text-yellow-300 font-extrabold text-base mb-1">
                          👑 THE CHAMPION! 👑
                        </p>
                        <p className="text-yellow-400 font-bold text-xs">
                          🎉 Everyone bow down! 🎉
                        </p>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Rest of Leaderboard */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/30 border-2 border-red-500 rounded-lg">
            <p className="text-red-300 font-bold">{error}</p>
          </div>
        )}

        {restOfPlayers.length > 0 && (
          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-center alpha-text mb-6">
              📊 All Players
            </h2>
            <div className="space-y-3">
              {restOfPlayers.map((user, index) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="card-alpha flex items-center gap-4 prowl-effect"
                >
                  {/* Rank Badge */}
                  <div className="flex-shrink-0">
                    <div className="tiger-badge">
                      #{user.rank}
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
                      <h3 className="text-xl font-extrabold text-tiger-yellow truncate">
                        {user.name}
                      </h3>
                    </div>
                    <p className="text-sm text-orange-200 truncate">{user.email}</p>
                    
                    {/* Stats Row */}
                    <div className="flex gap-4 mt-2">
                      <div className="flex items-center gap-1">
                        <Target className="w-4 h-4 text-tiger-yellow" />
                        <span className="text-xs text-tiger-orange font-bold">
                          {user.ftds} FTD's
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Award className="w-4 h-4 text-cyan-400" />
                        <span className="text-xs text-cyan-300 font-bold">
                          {user.plusOnes || 0} +1's
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-2 bg-dark-bg rounded-full h-3 overflow-hidden border border-tiger-orange">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ 
                          width: maxFTDs > 0 ? `${(user.ftds / maxFTDs) * 100}%` : '0%'
                        }}
                        transition={{ duration: 1, delay: index * 0.05 }}
                        className="h-full tiger-gradient"
                      />
                    </div>
                  </div>

                  {/* FTDs Count */}
                  <div className="text-right flex-shrink-0">
                    <p className="text-3xl font-extrabold alpha-text">
                      {user.ftds}
                    </p>
                    <p className="text-xs text-tiger-orange font-bold">
                      {maxFTDs - user.ftds > 0 
                        ? `-${maxFTDs - user.ftds} from leader` 
                        : '👑 Leader'}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

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