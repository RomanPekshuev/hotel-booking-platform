import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import RegistrationForm from './components/RegistrationForm';
import LoginForm from './components/LoginForm';
import HotelList from './components/HotelList';
import HotelDetails from './components/HotelDetails';
import MyBookings from './components/MyBookings';
import { useState, useEffect } from 'react';
import { isAuthenticated, logout } from './api/auth';
import MyProfile from './components/MyProfile';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setIsLoggedIn(isAuthenticated());
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
    window.location.href = '/';
  };

  return (
    <Router>
      <nav className={scrolled ? 'scrolled' : ''}>
        <div>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <Link to="/" style={{ textDecoration: 'none', fontWeight: 'bold' }}>🏨 Hotels</Link>
            
            {!isLoggedIn && (
              <>
                <Link to="/login" style={{ textDecoration: 'none' }}>Sign in</Link>
                <Link to="/register" style={{ textDecoration: 'none' }}>Registration</Link>
              </>
            )}
            
            {isLoggedIn && (
              <Link to="/bookings" style={{ textDecoration: 'none' }}>My reservations</Link>
            )}

            {isLoggedIn && (
              <>
                <Link to="/profile" style={{ textDecoration: 'none' }}>👤 Profile</Link>
                <Link to="/bookings" style={{ textDecoration: 'none' }}>My reservations</Link>
              </>
            )}
          </div>
          
          {isLoggedIn && (
            <button 
              onClick={handleLogout}
              style={{
                padding: '8px 16px',
                background: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Выйти
            </button>
          )}
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<HotelList />} />
        <Route path="/hotels/:id" element={<HotelDetails />} />
        <Route path="/register" element={<RegistrationForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/bookings" element={<MyBookings />} />
        <Route path="/profile" element={<MyProfile />} />
      </Routes>
    </Router>
  );
}

export default App;