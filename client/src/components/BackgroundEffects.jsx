import React, { useEffect } from 'react';
import { Crown, Flame, Zap } from 'lucide-react';

const BackgroundEffects = () => {
  useEffect(() => {
    // Create tiger paw prints
    const createPawPrints = () => {
      const pawContainer = document.getElementById('paw-prints-container');
      if (!pawContainer) return;

      for (let i = 0; i < 12; i++) {
        const paw = document.createElement('div');
        paw.className = 'paw-print';
        paw.innerHTML = '🐾';
        paw.style.left = `${Math.random() * 100}%`;
        paw.style.fontSize = `${20 + Math.random() * 30}px`;
        paw.style.animationDelay = `${Math.random() * 5}s`;
        paw.style.animationDuration = `${8 + Math.random() * 4}s`;
        pawContainer.appendChild(paw);
      }
    };

    createPawPrints();
  }, []);

  const tigerIcons = [
    { Icon: Crown, color: 'text-tiger-yellow', size: 'w-8 h-8' },
    { Icon: Flame, color: 'text-tiger-orange', size: 'w-7 h-7' },
    { Icon: Zap, color: 'text-tiger-yellow', size: 'w-6 h-6' },
  ];

  return (
    <>
      {/* Paw prints container */}
      <div id="paw-prints-container" className="fixed inset-0 pointer-events-none z-0"></div>

      {/* Floating tiger icons */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {tigerIcons.map((item, index) => (
          <div
            key={index}
            className="paw-print"
            style={{
              left: `${15 + index * 30}%`,
              animationDelay: `${index * 2}s`,
              animationDuration: '10s',
            }}
          >
            <item.Icon className={`${item.size} ${item.color} opacity-30`} />
          </div>
        ))}
      </div>

      {/* Floating tiger emojis */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {['🐯', '🔥', '👑', '⚡'].map((emoji, index) => (
          <div
            key={emoji + index}
            className="paw-print"
            style={{
              left: `${20 + index * 20}%`,
              animationDelay: `${index * 1.5 + 1}s`,
              animationDuration: '12s',
              fontSize: '40px',
            }}
          >
            {emoji}
          </div>
        ))}
      </div>

      {/* Gradient orbs - Tiger themed */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-20 left-10 w-96 h-96 bg-tiger-orange rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-bounce-slow"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-tiger-yellow rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-bounce-slow" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-tiger-darkOrange rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-bounce-slow" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Tiger stripe overlay */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 opacity-5">
          <div className="h-full w-full" style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              transparent,
              transparent 80px,
              rgba(255, 140, 0, 0.3) 80px,
              rgba(255, 140, 0, 0.3) 82px
            )`
          }}></div>
        </div>
      </div>
    </>
  );
};

export default BackgroundEffects;