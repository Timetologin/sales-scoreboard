import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

// Reusable Lottie Animation Component
const LottieAnimation = ({ 
  src, 
  loop = true, 
  autoplay = true, 
  className = '',
  style = {},
  onComplete,
  onLoad
}) => {
  return (
    <DotLottieReact
      src={src}
      loop={loop}
      autoplay={autoplay}
      className={className}
      style={style}
      onComplete={onComplete}
      onLoad={onLoad}
    />
  );
};

// Lottie URLs - centralized
export const LOTTIE_URLS = {
  // Main leopard animation - for Login and Dashboard
  leopard: 'https://lottie.host/719cc542-fb72-4649-86f4-c04fbc22d58b/wkTgTDBEko.lottie',
  
  // Loading spinner animation
  loading: 'https://lottie.host/94687e66-ec33-437a-8289-108eed6fe9b7/gWwQ2KCEcm.lottie',
  
  // Preloader animation
  preloader: 'https://lottie.host/3b1dc1ed-c932-4128-81b2-a758aa308615/5p37fbFR14.lottie',
};

export default LottieAnimation;