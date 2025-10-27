import React, { useEffect } from 'react';
import { DollarSign, TrendingUp, Award, Target, Zap, Star } from 'lucide-react';

const BackgroundEffects = () => {
  useEffect(() => {
    // Create stars
    const createStars = () => {
      const starsContainer = document.getElementById('stars-container');
      if (!starsContainer) return;

      for (let i = 0; i < 50; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.animationDelay = `${Math.random() * 3}s`;
        starsContainer.appendChild(star);
      }
    };

    createStars();
  }, []);

  const icons = [
    { Icon: DollarSign, color: 'text-green-500' },
    { Icon: TrendingUp, color: 'text-blue-500' },
    { Icon: Award, color: 'text-yellow-500' },
    { Icon: Target, color: 'text-red-500' },
    { Icon: Zap, color: 'text-purple-500' },
    { Icon: Star, color: 'text-pink-500' },
  ];

  return (
    <>
      {/* Stars container */}
      <div id="stars-container" className="fixed inset-0 pointer-events-none z-0"></div>

      {/* Floating icons */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {icons.map((item, index) => (
          <div
            key={index}
            className="coin"
            style={{
              left: `${10 + index * 15}%`,
              animationDelay: `${index * 1.5}s`,
            }}
          >
            <item.Icon className={`w-full h-full ${item.color} opacity-70`} />
          </div>
        ))}
      </div>

      {/* Gradient orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-20 left-10 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-bounce-slow"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-bounce-slow" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-bounce-slow" style={{ animationDelay: '2s' }}></div>
      </div>
    </>
  );
};

export default BackgroundEffects;