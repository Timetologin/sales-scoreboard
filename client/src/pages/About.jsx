import React from 'react';
import { Trophy, Target, Users, Zap, Award, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const About = () => {
  const features = [
    {
      icon: <Trophy className="w-8 h-8" />,
      title: 'Real-Time Rankings',
      description: 'Track your position on the leaderboard with live updates every 30 seconds.',
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: 'Goal Tracking',
      description: 'Set personal sales goals and monitor your progress against top performers.',
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Team Competition',
      description: 'Healthy competition drives results. See how you stack up against colleagues.',
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'AI Assistant',
      description: 'Get instant sales tips and motivation from our built-in AI coach.',
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: 'Achievement System',
      description: 'Earn recognition for top performance with special badges and highlights.',
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'Performance Analytics',
      description: 'Track your growth over time with detailed sales statistics.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="gradient-bg py-20 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto text-center"
        >
          <Trophy className="w-20 h-20 text-white mx-auto mb-6" />
          <h1 className="text-5xl font-bold text-white mb-6">
            About Sales Scoreboard
          </h1>
          <p className="text-xl text-primary-100 max-w-2xl mx-auto">
            Empowering sales teams to achieve excellence through friendly competition,
            real-time tracking, and data-driven insights.
          </p>
        </motion.div>
      </div>

      {/* Mission Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card text-center mb-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            We believe that healthy competition and transparent performance tracking drive
            success. Our Sales Scoreboard platform transforms individual effort into team
            achievement by making sales performance visible, celebrated, and rewarding for
            everyone involved.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Platform Features
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="card hover:scale-105 transition-transform"
              >
                <div className="text-primary-600 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Company Values */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card bg-gradient-to-br from-primary-50 to-primary-100"
        >
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
            Our Values
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Excellence</h3>
              <p className="text-gray-700">
                We strive for excellence in everything we do, from product features to
                customer support.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Teamwork</h3>
              <p className="text-gray-700">
                Success is a team sport. We celebrate individual achievements while
                fostering collaboration.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Innovation</h3>
              <p className="text-gray-700">
                We continuously improve our platform with cutting-edge features like AI
                assistance.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16 grid md:grid-cols-3 gap-6"
        >
          <div className="card text-center">
            <p className="text-5xl font-bold text-primary-600 mb-2">100%</p>
            <p className="text-gray-600">Real-Time Accuracy</p>
          </div>
          <div className="card text-center">
            <p className="text-5xl font-bold text-primary-600 mb-2">24/7</p>
            <p className="text-gray-600">Platform Availability</p>
          </div>
          <div className="card text-center">
            <p className="text-5xl font-bold text-primary-600 mb-2">∞</p>
            <p className="text-gray-600">Growth Potential</p>
          </div>
        </motion.div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16 text-center card gradient-bg"
        >
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your Sales Team?
          </h2>
          <p className="text-primary-100 mb-6 text-lg">
            Join thousands of sales professionals who use our platform to achieve their goals.
          </p>
          <button className="bg-white text-primary-600 hover:bg-primary-50 font-bold py-3 px-8 rounded-lg transition-colors">
            Get Started Today
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
