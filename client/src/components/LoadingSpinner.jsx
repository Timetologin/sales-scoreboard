import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { LOTTIE_URLS } from './LottieAnimation';

const LoadingSpinner = ({ 
  size = 'md', 
  text = 'Loading...', 
  showText = true,
  fullScreen = false,
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
    xl: 'w-48 h-48',
  };

  const content = (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className={sizeClasses[size]}>
        <DotLottieReact
          src={LOTTIE_URLS.loading}
          loop={true}
          autoplay={true}
          style={{ width: '100%', height: '100%' }}
        />
      </div>
      {showText && (
        <p className="text-tiger-orange font-semibold mt-2 animate-pulse">
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/80 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return content;
};

export const InlineSpinner = ({ size = 20 }) => (
  <div style={{ width: size, height: size }} className="inline-block">
    <DotLottieReact
      src={LOTTIE_URLS.loading}
      loop={true}
      autoplay={true}
      style={{ width: '100%', height: '100%' }}
    />
  </div>
);

export default LoadingSpinner;