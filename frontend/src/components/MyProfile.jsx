import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUserProfile, getUserBookings, logout } from '../api/auth';
import '../styles/profile.css';

export default function MyProfile() {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('bookings');
  const navigate = useNavigate();

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      setLoading(true);
      
      const userData = await getUserProfile();
      setUser(userData);
      
      const bookingsData = await getUserBookings();
      setBookings(bookingsData);
      
      setError('');
    } catch (err) {
      setError('Failed to load profile');
      console.error(err);
      if (err.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  function getStatusBadge(status) {
    const styles = {
      confirmed: 'status-confirmed',
      pending: 'status-pending',
      cancelled: 'status-cancelled'
    };
    const labels = {
      confirmed: 'Confirmed',
      pending: 'Pending',
      cancelled: 'Cancelled'
    };
    return <span className={`status-badge ${styles[status]}`}>{labels[status]}</span>;
  }

  if (loading) {
    return <div className="loading">Loading profile...</div>;
  }

  if (error) {
    return (
      <div className="profile-error">
        <p>{error}</p>
        <Link to="/login" className="btn">Sign In</Link>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-avatar">
          {user?.username?.[0]?.toUpperCase() || '👤'}
        </div>
        <div className="profile-info">
          <h1>Welcome, {user?.username}!</h1>
          <p className="profile-email">{user?.email}</p>
          <p className="profile-member">Member since {formatDate(user?.createdAt)}</p>
        </div>
        <button className="btn-logout" onClick={handleLogout}>
          Sign Out
        </button>
      </div>

      <div className="profile-tabs">
        <button 
          className={`tab-btn ${activeTab === 'bookings' ? 'active' : ''}`}
          onClick={() => setActiveTab('bookings')}
        >
          My Bookings ({bookings.length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'info' ? 'active' : ''}`}
          onClick={() => setActiveTab('info')}
        >
          Account Info
        </button>
      </div>

      <div className="profile-content">
        
        {activeTab === 'bookings' && (
          <div className="bookings-list">
            {bookings.length === 0 ? (
              <div className="empty-bookings">
                <p>No bookings yet</p>
                <Link to="/" className="btn">Browse Hotels</Link>
              </div>
            ) : (
              bookings.map(booking => (
                <div key={booking.id} className="booking-card">
                  <div className="booking-header">
                    <h3>{booking.room?.hotel?.name || 'Unknown Hotel'}</h3>
                    {getStatusBadge(booking.status)}
                  </div>
                  
                  <div className="booking-details">
                    <div className="detail-row">
                      <span>Room:</span>
                      <strong>{booking.room?.type || 'Standard'}</strong>
                    </div>
                    <div className="detail-row">
                      <span>Check-in:</span>
                      <strong>{formatDate(booking.checkIn)}</strong>
                    </div>
                    <div className="detail-row">
                      <span>Check-out:</span>
                      <strong>{formatDate(booking.checkOut)}</strong>
                    </div>
                    <div className="detail-row">
                      <span>Price:</span>
                      <strong>${booking.room?.price || 0}/night</strong>
                    </div>
                  </div>
                  
                  <div className="booking-actions">
                    {booking.status === 'pending' && (
                      <button className="btn-cancel">Cancel Booking</button>
                    )}
                    <Link to={`/hotels/${booking.room?.hotelId}`} className="btn-view">
                      View Hotel
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'info' && (
          <div className="account-info">
            <div className="info-card">
              <h3>Personal Information</h3>
              <div className="info-row">
                <label>Username</label>
                <p>{user?.username}</p>
              </div>
              <div className="info-row">
                <label>Email</label>
                <p>{user?.email}</p>
              </div>
              <div className="info-row">
                <label>Member Since</label>
                <p>{formatDate(user?.createdAt)}</p>
              </div>
              <button className="btn-edit">✏️ Edit Profile</button>
            </div>

            <div className="info-card security">
              <h3>Security</h3>
              <p>Change your password regularly to keep your account secure.</p>
              <button className="btn-secondary">Change Password</button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}