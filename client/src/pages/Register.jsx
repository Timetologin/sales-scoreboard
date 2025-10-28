import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, AlertCircle, Flame, User } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Roars do not match! 🐯');
      return;
    }

    if (formData.password.length < 6) {
      setError('Your roar must be at least 6 characters strong! 💪');
      return;
    }

    setIsLoading(true);

    const result = await register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
    });
    
    setIsLoading(false);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-tiger-orange rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-bounce-slow"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-tiger-yellow rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-bounce-slow" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-tiger-darkOrange rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-bounce-slow" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Floating paw prints */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="paw-print"
            style={{
              left: `${5 + i * 12}%`,
              animationDelay: `${i * 1.2}s`,
            }}
          >
            <span className="text-3xl opacity-50">🐾</span>
          </div>
        ))}
      </div>

      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-8 animate-fadeIn">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="bg-tiger-gradient p-6 rounded-full shadow-[0_0_50px_rgba(255,140,0,0.6)] animate-roar">
                <span className="text-6xl">🐯</span>
              </div>
              <Flame className="absolute -top-2 -right-2 w-12 h-12 text-tiger-yellow animate-pulse tiger-eyes" />
            </div>
          </div>
          <h1 className="text-6xl font-extrabold mb-3 alpha-text animate-prowl">
            Tiger's Pride
          </h1>
          <p className="text-tiger-orange font-bold text-xl flex items-center justify-center gap-2">
            <span>🔥</span>
            <span>Join the Hunt</span>
            <span>🔥</span>
          </p>
          <p className="text-gray-400 mt-2 text-sm">
            Prove you have what it takes to run with tigers
          </p>
        </div>

        <div className="card-alpha animate-slideUp">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Flame className="w-8 h-8 text-tiger-yellow animate-pulse" />
            <h2 className="text-3xl font-bold tiger-text">
              Join The Pack
            </h2>
            <Flame className="w-8 h-8 text-tiger-yellow animate-pulse" />
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-900/30 border-2 border-red-500 rounded-lg flex items-start prowl-effect">
              <AlertCircle className="w-5 h-5 text-red-400 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-300 font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-tiger-orange mb-2 flex items-center gap-2">
                <User className="w-4 h-4" />
                Tiger Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-tiger-orange w-5 h-5" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input-field pl-10"
                  placeholder="Fierce Tiger"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-tiger-orange mb-2 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Territory Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-tiger-orange w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
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
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input-field pl-10"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-tiger-orange mb-2 flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Confirm Your Roar
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-tiger-orange w-5 h-5" />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="input-field pl-10"
                  placeholder="••••••••"
                  required
                  minLength={6}
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
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-dark-bg"></div>
                  <span>Joining Pride...</span>
                  <span>🐾</span>
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <span>🐯</span>
                  <span>Join Pride</span>
                  <span>🔥</span>
                </span>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              Already in the pride?{' '}
              <Link 
                to="/login" 
                className="text-tiger-orange hover:text-tiger-yellow font-bold transition-colors"
              >
                Enter Territory 🐯
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-tiger-orange font-bold">
            🔥 By joining, you agree to follow the pride's hunting code 🔥
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;