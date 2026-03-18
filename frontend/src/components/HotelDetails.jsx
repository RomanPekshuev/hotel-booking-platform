import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getHotelById } from '../api/hotels';
import BookingForm from './BoockingForm';

export default function HotelDetails() {
  const { id } = useParams();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRoom, setSelectedRoom] = useState(null);

  useEffect(() => {
    loadHotel();
  }, [id]);

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
    </div>
  );
}