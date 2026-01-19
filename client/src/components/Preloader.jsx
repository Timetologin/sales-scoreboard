import React, { useState, useEffect } from 'react';

const Preloader = ({ onComplete, minDisplayTime = 2500 }) => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // 2.5 שניות ואז נעלם
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => {
        onComplete();
      }, 500);
    }, minDisplayTime);

    return () => clearTimeout(timer);
  }, [minDisplayTime, onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center transition-opacity duration-500 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
      style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)',
      }}
    >
      {/* Animated background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Lottie Animation - iframe שעובד! */}
        <div 
          className="w-80 h-80 mb-4"
          style={{
            filter: 'drop-shadow(0 0 30px rgba(255, 149, 0, 0.6))'
          }}
        >
          <iframe 
            src="https://lottie.host/embed/719cc542-fb72-4649-86f4-c04fbc22d58b/vjKvPxrrsj.lottie"
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              background: 'transparent',
            }}
            title="Loading Animation"
          />
        </div>

        {/* Brand Name */}
        <h1 
          className="text-5xl md:text-6xl font-extrabold mb-4 animate-pulse"
          style={{
            background: 'linear-gradient(135deg, #FFD700 0%, #FF9500 50%, #FF6B00 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 0 40px rgba(255, 149, 0, 0.5)',
          }}
        >
          JUSTIN'S LEOPARDS
        </h1>

        {/* Loading text */}
        <div className="flex items-center gap-2 text-orange-400 text-xl font-bold">
          <span>🔥</span>
          <span>Loading the Pride...</span>
          <span>🔥</span>
        </div>

        {/* Loading dots */}
        <div className="flex gap-2 mt-6">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-3 h-3 bg-orange-500 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>

      {/* Bottom decoration */}
      <div className="absolute bottom-8 text-center">
        <p className="text-orange-300/60 text-sm">
          🐆 Sales Excellence Platform 🐆
        </p>
      </div>
    </div>
  );
};

export default Preloader;