import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, AlertCircle, Flame, Crown } from 'lucide-react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { LOTTIE_URLS } from '../components/LottieAnimation';
import { InlineSpinner } from '../components/LoadingSpinner';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await login({ email, password });
    
    setIsLoading(false);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-tiger-orange rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-bounce-slow"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-tiger-yellow rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-bounce-slow" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-tiger-darkOrange rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-bounce-slow" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="paw-print"
            style={{
              left: `${10 + i * 15}%`,
              animationDelay: `${i * 1.5}s`,
            }}
          >
            <span className="text-4xl opacity-60">🐾</span>
          </div>
        ))}
      </div>

      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-8 animate-fadeIn">
          <div className="flex justify-center mb-4">
            <div className="w-48 h-48 md:w-56 md:h-56">
              <DotLottieReact
                src={LOTTIE_URLS.leopard}
                loop={true}
                autoplay={true}
                style={{ width: '100%', height: '100%' }}
              />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-extrabold mb-3 alpha-text animate-prowl">
            Justin's LEOPARDS
          </h1>
          <p className="text-tiger-orange font-bold text-xl flex items-center justify-center gap-2">
            <span>🔥</span>
            <span>Enter the Territory</span>
            <span>🔥</span>
          </p>
          <p className="text-gray-400 mt-2 text-sm">
            Only the fierce survive in this jungle
          </p>
        </div>

        <div className="card-alpha animate-slideUp">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Flame className="w-8 h-8 text-tiger-yellow animate-pulse" />
            <h2 className="text-3xl font-bold tiger-text">
              Welcome Back, Tiger
            </h2>
            <Flame className="w-8 h-8 text-tiger-yellow animate-pulse" />
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-900/30 border-2 border-red-500 rounded-lg flex items-start prowl-effect">
              <AlertCircle className="w-5 h-5 text-red-400 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-300 font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-tiger-orange mb-2 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Territory Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-tiger-orange w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-10"
                  placeholder="tiger@pride.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-tiger-orange mb-2 flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Secret Roar
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-tiger-orange w-5 h-5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-10"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-alpha py-4 text-xl font-extrabold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-3">
                  <InlineSpinner size={24} />
                  <span>Entering Territory...</span>
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <span>🐯</span>
                  <span>Enter Pride</span>
                  <span>🔥</span>
                </span>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              Not part of the pride yet?{' '}
              <Link 
                to="/register" 
                className="text-tiger-orange hover:text-tiger-yellow font-bold transition-colors"
              >
                Join the Pack 🐯
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-tiger-orange font-bold flex items-center justify-center gap-2">
            <Crown className="w-4 h-4 animate-bounce" />
            <span>Secure Alpha Authentication</span>
            <Crown className="w-4 h-4 animate-bounce" />
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;