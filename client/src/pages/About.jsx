import React from 'react';
import { Crown, Target, Users, Zap, Award, TrendingUp, Flame, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

const About = () => {
  const features = [
    {
      icon: <Crown className="w-10 h-10" />,
      title: 'Alpha Leadership',
      description: 'Rule your territory with confidence. Track every hunt and dominate the leaderboard.',
    },
    {
      icon: <Target className="w-10 h-10" />,
      title: 'Territory Tracking',
      description: 'Set hunting goals and monitor your progress against other fierce tigers.',
    },
    {
      icon: <Users className="w-10 h-10" />,
      title: 'Pride Competition',
      description: 'Fierce competition drives results. See how you measure up in the pack.',
    },
    {
      icon: <Zap className="w-10 h-10" />,
      title: 'Tiger AI Assistant',
      description: 'Get instant hunting tips and motivation from our AI tiger coach.',
    },
    {
      icon: <Award className="w-10 h-10" />,
      title: 'Achievement System',
      description: 'Earn your stripes with special badges and recognition for top performance.',
    },
    {
      icon: <TrendingUp className="w-10 h-10" />,
      title: 'Performance Analytics',
      description: 'Track your hunting prowess over time with detailed territory statistics.',
    },
  ];

  const values = [
    {
      icon: <Crown className="w-12 h-12" />,
      title: 'Dominance',
      description: 'We strive for excellence in every hunt, from tracking prey to claiming territory.',
      emoji: '👑',
    },
    {
      icon: <Users className="w-12 h-12" />,
      title: 'Pride Unity',
      description: 'Success is a pack sport. We celebrate individual fierceness while fostering unity.',
      emoji: '🐯',
    },
    {
      icon: <Zap className="w-12 h-12" />,
      title: 'Fierce Innovation',
      description: 'We continuously evolve our hunting strategies with cutting-edge tiger technology.',
      emoji: '⚡',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-tiger-gradient py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Animated stripes background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-tiger-stripes"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto text-center relative z-10"
        >
          <div className="flex justify-center items-center gap-4 mb-6">
            <Flame className="w-16 h-16 text-tiger-yellow animate-pulse" />
            <span className="text-8xl animate-roar">🐯</span>
            <Flame className="w-16 h-16 text-tiger-yellow animate-pulse" />
          </div>
          <h1 className="text-6xl font-extrabold text-white mb-6">
            About Tiger's Pride
          </h1>
          <p className="text-2xl text-white max-w-2xl mx-auto font-bold">
            🔥 Unleash your inner predator. Dominate the territory. Rule the hunting grounds. 🔥
          </p>
        </motion.div>
      </div>

      {/* Mission Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card-alpha text-center mb-16 prowl-effect"
        >
          <div className="flex justify-center mb-6">
            <Crown className="w-16 h-16 text-tiger-yellow animate-bounce tiger-eyes" />
          </div>
          <h2 className="text-4xl font-extrabold alpha-text mb-6">Our Mission</h2>
          <p className="text-xl text-orange-100 max-w-3xl mx-auto leading-relaxed">
            We believe that fierce competition and transparent territory tracking drive success. 
            Our Tiger's Pride platform transforms individual hunting prowess into pack dominance 
            by making performance visible, celebrated, and rewarding for every tiger in the pride.
          </p>
          <div className="flex justify-center gap-4 mt-8">
            <span className="text-4xl animate-bounce">🐯</span>
            <span className="text-4xl animate-bounce" style={{ animationDelay: '0.1s' }}>🔥</span>
            <span className="text-4xl animate-bounce" style={{ animationDelay: '0.2s' }}>👑</span>
            <span className="text-4xl animate-bounce" style={{ animationDelay: '0.3s' }}>⚡</span>
            <span className="text-4xl animate-bounce" style={{ animationDelay: '0.4s' }}>🐯</span>
          </div>
        </motion.div>

        {/* Features Grid */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-extrabold tiger-text mb-4">
              Territory Features
            </h2>
            <p className="text-tiger-orange font-bold text-xl">
              Everything a fierce tiger needs to dominate 🔥
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="card hover:scale-105 transition-transform prowl-effect"
              >
                <div className="text-tiger-orange mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-tiger-yellow mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Pride Values */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card-alpha mb-16"
        >
          <div className="text-center mb-8">
            <h2 className="text-5xl font-extrabold tiger-text mb-4">
              Pride Values
            </h2>
            <p className="text-tiger-orange font-bold text-lg">
              What makes us the fiercest pack 🐯
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="text-center"
              >
                <div className="w-20 h-20 bg-tiger-gradient rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg prowl-effect">
                  {value.icon}
                </div>
                <div className="text-4xl mb-3">{value.emoji}</div>
                <h3 className="text-2xl font-bold text-tiger-yellow mb-2">{value.title}</h3>
                <p className="text-orange-100">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid md:grid-cols-3 gap-6 mb-16"
        >
          <div className="card text-center prowl-effect">
            <p className="text-6xl font-extrabold alpha-text mb-2">100%</p>
            <p className="text-tiger-orange font-bold">Real-Time Tracking</p>
            <p className="text-gray-400 text-sm mt-2">Every hunt, every moment</p>
          </div>
          <div className="card text-center prowl-effect">
            <p className="text-6xl font-extrabold alpha-text mb-2">24/7</p>
            <p className="text-tiger-orange font-bold">Territory Access</p>
            <p className="text-gray-400 text-sm mt-2">Hunt whenever you're ready</p>
          </div>
          <div className="card text-center prowl-effect">
            <p className="text-6xl font-extrabold alpha-text mb-2">∞</p>
            <p className="text-tiger-orange font-bold">Hunting Potential</p>
            <p className="text-gray-400 text-sm mt-2">No limits to your dominance</p>
          </div>
        </motion.div>

        {/* Tiger Code */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="card bg-tiger-gradient text-white mb-16"
        >
          <div className="text-center mb-8">
            <Shield className="w-16 h-16 mx-auto mb-4" />
            <h2 className="text-4xl font-extrabold mb-4">The Tiger Code</h2>
            <p className="text-xl font-bold">Rules every fierce tiger must follow 🐯</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="text-3xl">🔥</span>
                <div>
                  <h3 className="font-bold text-lg mb-1">Hunt with Honor</h3>
                  <p className="text-sm opacity-90">Every territory must be earned through fierce effort and skill.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-3xl">👑</span>
                <div>
                  <h3 className="font-bold text-lg mb-1">Respect the Alpha</h3>
                  <p className="text-sm opacity-90">Leadership is earned, not given. The strongest leads the pack.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-3xl">🐯</span>
                <div>
                  <h3 className="font-bold text-lg mb-1">Support the Pride</h3>
                  <p className="text-sm opacity-90">Individual strength builds collective power.</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="text-3xl">⚡</span>
                <div>
                  <h3 className="font-bold text-lg mb-1">Never Stop Growing</h3>
                  <p className="text-sm opacity-90">Every hunt is a chance to sharpen your skills.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-3xl">💪</span>
                <div>
                  <h3 className="font-bold text-lg mb-1">Compete Fiercely</h3>
                  <p className="text-sm opacity-90">Competition brings out the best in every tiger.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-3xl">🏆</span>
                <div>
                  <h3 className="font-bold text-lg mb-1">Celebrate Victories</h3>
                  <p className="text-sm opacity-90">Every achievement deserves recognition.</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="card-alpha text-center prowl-effect"
        >
          <div className="flex justify-center mb-6">
            <div className="relative">
              <span className="text-8xl animate-roar">🐯</span>
              <Crown className="absolute -top-4 -right-4 w-16 h-16 text-tiger-yellow animate-bounce tiger-eyes" />
            </div>
          </div>
          <h2 className="text-4xl font-extrabold text-white mb-4">
            Ready to Join the Pride?
          </h2>
          <p className="text-tiger-yellow mb-8 text-xl font-bold">
            Thousands of fierce tigers already dominate their territories with us.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button className="btn-alpha text-lg px-8 py-4">
              🔥 Start Hunting Now
            </button>
            <button className="btn-primary text-lg px-8 py-4">
              👑 Claim Your Territory
            </button>
          </div>
        </motion.div>

        {/* Footer Quote */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-16 text-center"
        >
          <div className="card bg-dark-tiger">
            <p className="text-3xl font-extrabold alpha-text mb-4">
              "In the jungle of sales, only the fierce survive"
            </p>
            <div className="flex justify-center gap-3 text-4xl">
              <span className="animate-bounce">🐯</span>
              <span className="animate-bounce" style={{ animationDelay: '0.1s' }}>🔥</span>
              <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>👑</span>
              <span className="animate-bounce" style={{ animationDelay: '0.3s' }}>🔥</span>
              <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>🐯</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;