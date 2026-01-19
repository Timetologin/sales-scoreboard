import React, { useState, useEffect } from 'react';
import Lottie from 'lottie-react';

const Preloader = ({ onComplete, minDisplayTime = 3000 }) => {
  const [fadeOut, setFadeOut] = useState(false);
  const [cuteTigerAnim, setCuteTigerAnim] = useState(null);

  useEffect(() => {
    // Load Cute Tiger animation
    const loadAnimation = async () => {
      try {
        const res = await fetch('/Cute Tiger.json');
        const data = await res.json();
        setCuteTigerAnim(data);
      } catch (err) {
        console.error('Failed to load animation:', err);
      }
    };
    loadAnimation();

    // Timer for preloader
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
        {/* Cute Tiger Lottie Animation */}
        <div 
          className="w-64 h-64 md:w-80 md:h-80 mb-4"
          style={{
            filter: 'drop-shadow(0 0 30px rgba(255, 149, 0, 0.6))'
          }}
        >
          {cuteTigerAnim ? (
            <Lottie
              animationData={cuteTigerAnim}
              loop={true}
              autoplay={true}
              style={{ 
                width: '100%', 
                height: '100%',
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-500"></div>
            </div>
          )}
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