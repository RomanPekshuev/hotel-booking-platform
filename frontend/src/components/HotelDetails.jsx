import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getHotelById } from '../api/hotels';
import BookingForm from './BoockingForm';
import ReviewForm from './ReviewForm';

export default function HotelDetails() {
  const { id } = useParams();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);

  useEffect(() => {
    loadHotel();
  }, [id]);

  useEffect(() => {
  if (hotel?.id) {
    loadReviews();
  }
}, [hotel?.id]);

async function loadReviews() {
  try {
    const response = await fetch(`http://localhost:3000/reviews/hotel/${hotel.id}`);
    const data = await response.json();
    setReviews(data.reviews);
    setAvgRating(data.avgRating);
  } catch (e) {
    console.error('Failed to load reviews:', e);
  }
}

useEffect(() => {
  if (hotel?.id) {
    loadReviews();
  }
}, [hotel?.id]);

async function loadReviews() {
  try {
    const response = await fetch(`http://localhost:3000/reviews/hotel/${hotel.id}`);
    const data = await response.json();
    setReviews(data.reviews);
    setAvgRating(data.avgRating);
  } catch (e) {
    console.error('Failed to load reviews:', e);
  }
}

async function handleReviewAdded() {
  await loadReviews();  // Перезагружаем отзывы после добавления
}

  async function loadHotel() {
    try {
      setLoading(true);
      const data = await getHotelById(id);
      setHotel(data);
      setError('');
    } catch (err) {
      setError('Failed to load hotel details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!hotel) {
    return <div className="error">Hotel not found</div>;
  }

  return (
    <div className="hotel-details">
      <Link to="/" className="back-link">← Back to Hotels</Link>
      
      {hotel.image && (
        <img src={hotel.image} alt={hotel.name} className="hotel-image" />
      )}
      
      <h1>{hotel.name}</h1>
      <p className="location">📍 {hotel.location}</p>
      <p className="rating">⭐ {hotel.rating}/5</p>
      <p className="description">{hotel.description}</p>
      
      <h2>Available Rooms</h2>
      {hotel.rooms && hotel.rooms.length > 0 ? (
        <div className="rooms-list">
          {hotel.rooms.map(room => (
            <div key={room.id} className="room-card">
              <h3>{room.type}</h3>
              <p className="price">${room.price}/night</p>
              <p className="capacity">👤 Up to {room.capacity} guests</p>
              <p className="availability">
                {room.available ? '✅ Available' : '❌ Not Available'}
              </p>
              
              {room.available && (
                <>
                  {selectedRoom?.id === room.id ? (
                    <BookingForm 
                      room={room} 
                      hotel={hotel}
                    />
                  ) : (
                    <button 
                      onClick={() => setSelectedRoom(room)}
                      className="btn-book"
                    >
                      Book Now
                    </button>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>No rooms available at the moment.</p>
      )}

      <div style={{ marginTop: '40px', borderTop: '2px solid #e5e7eb', paddingTop: '24px' }}>
        <h2 style={{ marginBottom: '16px' }}>
          Отзывы ({reviews.length})
          {avgRating > 0 && (
            <span style={{ color: '#fbbf24', marginLeft: '12px' }}>
              {'★'.repeat(Math.round(avgRating))}
              <span style={{ color: '#6b7280', fontSize: '16px' }}>
                {' '}({avgRating.toFixed(1)})
              </span>
            </span>
          )}
        </h2>
        
        <ReviewForm hotelId={hotel.id} onReviewAdded={handleReviewAdded} />
        
        <div style={{ marginTop: '24px' }}>
          {reviews.length === 0 ? (
            <p style={{ color: '#6b7280' }}>Пока нет отзывов. Будьте первым!</p>
          ) : (
            reviews.map((review) => (
              <div 
                key={review.id}
                style={{
                  padding: '16px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  marginBottom: '12px',
                  backgroundColor: '#f9fafb'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div>
                    <strong>{review.user?.username || 'Аноним'}</strong>
                    <span style={{ color: '#fbbf24', marginLeft: '8px' }}>
                      {'★'.repeat(review.rating)}
                    </span>
                  </div>
                  <span style={{ color: '#6b7280', fontSize: '14px' }}>
                    {new Date(review.createdAt).toLocaleDateString('ru-RU')}
                  </span>
                </div>
                <p style={{ color: '#374151' }}>{review.comment}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}