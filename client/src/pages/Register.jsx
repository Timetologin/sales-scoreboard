import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, AlertCircle, Flame, Crown } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Your roars don\'t match! Try again, tiger.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Your roar must be at least 6 characters fierce!');
      return;
    }

    setIsLoading(true);

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      navigate('/dashboard');
    } catch (err) {
      setError(
        err.response?.data?.message || 
        'Failed to join the pride. The territory might already be claimed!'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-tiger-stripes opacity-5"></div>
      
      {/* Floating paw prints */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float"
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
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="bg-tiger-gradient p-6 rounded-full shadow-[0_0_50px_rgba(255,140,0,0.6)] animate-roar">
                {/* לוגו LEOS LEOPARDS */}
                <img 
                  src="/logo-192.png" 
                  alt="LEOS LEOPARDS" 
                  className="w-16 h-16 object-contain"
                  onError={(e) => {
                    // Fallback לאימוג'י אם הלוגו לא נטען
                    e.target.style.display = 'none';
                    e.target.nextElementSibling.style.display = 'block';
                  }}
                />
                <span className="text-6xl" style={{ display: 'none' }}>🐯</span>
              </div>
              <Flame className="absolute -top-2 -right-2 w-12 h-12 text-tiger-yellow animate-pulse tiger-eyes" />
            </div>
          </div>
          <h1 className="text-6xl font-extrabold mb-3 alpha-text animate-prowl">
            LEOS LEOPARDS
          </h1>
          <p className="text-tiger-orange font-bold text-xl flex items-center justify-center gap-2">
            <span>🔥</span>
            <span>Join the Hunt</span>
            <span>🔥</span>
          </p>
          <p className="text-gray-400 mt-2 text-sm">
            Prove you have what it takes to run with leopards
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
                Hunter Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-tiger-orange w-5 h-5" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input-field pl-10"
                  placeholder="Your legendary name"
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
                  placeholder="hunter@leosleopards.com"
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
                  <span>🦁</span>
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
                Enter Territory 🦁
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