import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Crown,
  LayoutDashboard,
  User,
  Users,
  Info,
  LogOut,
  Menu,
  X,
  Flame,
} from 'lucide-react';
import { useState } from 'react';

const Navigation = ({ children }) => {
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" />, label: 'Pride Rankings' },
    { path: '/profile', icon: <User className="w-5 h-5" />, label: 'My Territory' },
    { path: '/about', icon: <Info className="w-5 h-5" />, label: 'About Pack' },
  ];

  if (isAdmin) {
    navLinks.splice(2, 0, {
      path: '/admin',
      icon: <Crown className="w-5 h-5" />,
      label: 'Alpha Control',
    });
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-gray-800 shadow-[0_0_30px_rgba(255,149,0,0.3)] sticky top-0 z-40 border-b-2 border-tiger-orange">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo - עכשיו עם לוגו אמיתי + fallback לאימוג'י */}
            <Link to="/dashboard" className="flex items-center gap-3 hover:opacity-80 transition group">
              <div className="relative">
                <div className="w-12 h-12 bg-tiger-gradient rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-[0_0_20px_rgba(255,149,0,0.6)] transition-all animate-prowl overflow-hidden">
                  {/* לוגו אמיתי - אם יש */}
                  <img 
                    src="/logo-192.png" 
                    alt="LEOS LEOPARDS" 
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      // Fallback לאימוג'י אם הלוגו לא נטען
                      e.target.style.display = 'none';
                      e.target.nextElementSibling.style.display = 'block';
                    }}
                  />
                  {/* Fallback אימוג'י */}
                  <span className="text-3xl" style={{ display: 'none' }}>🐯</span>
                </div>
                {isAdmin && user && (
                  <Crown className="absolute -top-2 -right-2 w-6 h-6 text-tiger-yellow animate-bounce tiger-eyes" />
                )}
              </div>
              <div>
                <span className="text-xl font-bold tiger-text hidden sm:block">
                  LEOS LEOPARDS
                </span>
                <span className="text-xs text-tiger-orange font-semibold hidden sm:block">
                  Sales Territory
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    isActive(link.path)
                      ? 'bg-tiger-gradient text-white font-bold shadow-lg'
                      : 'text-tiger-orange hover:bg-gray-700 hover:text-tiger-yellow'
                  }`}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </Link>
              ))}
            </nav>

            {/* User Menu */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-3 bg-gray-700 px-4 py-2 rounded-lg border border-gray-600">
                <div className="relative">
                  <img
                    src={user?.profilePicture}
                    alt={user?.name}
                    className="w-10 h-10 rounded-full border-2 border-tiger-orange shadow-lg"
                  />
                  {isAdmin && (
                    <Crown className="absolute -top-1 -right-1 w-4 h-4 text-tiger-yellow animate-pulse" />
                  )}
                </div>
                <div className="hidden lg:block">
                  <p className="text-sm font-bold text-tiger-orange flex items-center gap-1">
                    {user?.name}
                    {isAdmin && <Flame className="w-4 h-4 text-tiger-yellow" />}
                  </p>
                  <p className="text-xs text-gray-300">
                    {user?.isAdmin ? '👑 Alpha Tiger' : '🐯 Pack Member'}
                  </p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="hidden md:flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-gray-700 rounded-lg transition-all border border-red-900 hover:border-red-500"
              >
                <LogOut className="w-5 h-5" />
                <span>Leave Pride</span>
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-tiger-orange hover:bg-gray-700 rounded-lg border border-tiger-orange"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-700">
              <div className="flex items-center gap-3 mb-4 p-3 bg-gray-700 rounded-lg">
                <div className="relative">
                  <img
                    src={user?.profilePicture}
                    alt={user?.name}
                    className="w-12 h-12 rounded-full border-2 border-tiger-orange"
                  />
                  {isAdmin && (
                    <Crown className="absolute -top-1 -right-1 w-5 h-5 text-tiger-yellow animate-pulse" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-bold text-tiger-orange">{user?.name}</p>
                  <p className="text-xs text-gray-300">
                    {user?.isAdmin ? '👑 Alpha Tiger' : '🐯 Pack Member'}
                  </p>
                </div>
              </div>

              <nav className="space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                      isActive(link.path)
                        ? 'bg-tiger-gradient text-white font-bold'
                        : 'text-tiger-orange hover:bg-gray-700'
                    }`}
                  >
                    {link.icon}
                    <span>{link.label}</span>
                  </Link>
                ))}
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-red-400 hover:bg-gray-700 rounded-lg transition-all"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Leave Pride</span>
                </button>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer - עם לוגו מעודכן */}
      <footer className="bg-gray-800 text-orange-100 py-8 mt-auto border-t-2 border-tiger-orange shadow-[0_-10px_30px_rgba(255,149,0,0.2)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-tiger-gradient rounded-lg flex items-center justify-center overflow-hidden">
                  {/* לוגו בfooter */}
                  <img 
                    src="/logo-192.png" 
                    alt="LEOS LEOPARDS" 
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextElementSibling.style.display = 'block';
                    }}
                  />
                  <span className="text-2xl" style={{ display: 'none' }}>🐯</span>
                </div>
                <span className="text-lg font-bold tiger-text">LEOS LEOPARDS</span>
              </div>
              <p className="text-gray-300 text-sm">
                🔥 Unleash your inner tiger. Dominate the territory. Rule the pride.
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-tiger-orange">Territory Map</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>
                  <Link to="/dashboard" className="hover:text-tiger-orange transition flex items-center gap-2">
                    <span>🏆</span> Pride Rankings
                  </Link>
                </li>
                <li>
                  <Link to="/profile" className="hover:text-tiger-orange transition flex items-center gap-2">
                    <span>🐾</span> My Territory
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="hover:text-tiger-orange transition flex items-center gap-2">
                    <span>ℹ️</span> About Pack
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-tiger-orange">Alpha Contact</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-center gap-2">
                  <span>📧</span> info@leosleopards.com
                </li>
                <li className="flex items-center gap-2">
                  <span>📞</span> (555) LEOPARD-1
                </li>
                <li className="flex items-center gap-2">
                  <span>🏔️</span> LEOS HQ
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-sm text-gray-400 flex items-center justify-center gap-2">
              <span>🦁</span>
              <span>&copy; {new Date().getFullYear()} LEOS LEOPARDS. All territories reserved.</span>
              <span>🔥</span>
            </p>
            <p className="text-xs text-tiger-orange mt-2 font-semibold">
              "Excellence is not a skill, it's an attitude" 💪
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Navigation;