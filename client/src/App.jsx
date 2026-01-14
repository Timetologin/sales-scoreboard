import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navigation from './components/Navigation';
import ChatWidget from './components/ChatWidget';
import BackgroundEffects from './components/BackgroundEffects';
import Preloader from './components/Preloader';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import AdminPanel from './pages/AdminPanel';
import About from './pages/About';

const ConditionalBackgroundEffects = () => {
  const location = useLocation();
  const showBackground = !['/login', '/register'].includes(location.pathname);
  return showBackground ? <BackgroundEffects /> : null;
};

function App() {
  const [showPreloader, setShowPreloader] = useState(true);
  const [appReady, setAppReady] = useState(false);

  const handlePreloaderComplete = () => {
    setShowPreloader(false);
    setAppReady(true);
  };

  return (
    <>
      {showPreloader && (
        <Preloader 
          onComplete={handlePreloaderComplete} 
          minDisplayTime={4000}
        />
      )}

      <div style={{ 
        opacity: appReady ? 1 : 0, 
        transition: 'opacity 0.5s ease-in-out',
        visibility: showPreloader ? 'hidden' : 'visible'
      }}>
        <BrowserRouter>
          <AuthProvider>
            <ConditionalBackgroundEffects />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <Navigation>
                      <Dashboard />
                      <ChatWidget />
                    </Navigation>
                  </PrivateRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <Navigation>
                      <Profile />
                      <ChatWidget />
                    </Navigation>
                  </PrivateRoute>
                }
              />
              <Route
                path="/about"
                element={
                  <PrivateRoute>
                    <Navigation>
                      <About />
                      <ChatWidget />
                    </Navigation>
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <PrivateRoute adminOnly={true}>
                    <Navigation>
                      <AdminPanel />
                      <ChatWidget />
                    </Navigation>
                  </PrivateRoute>
                }
              />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;