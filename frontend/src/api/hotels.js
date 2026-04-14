const API_URL = 'http://localhost:3000';

export const getHotels = async () => {
  try {
    const response = await fetch(`${API_URL}/hotels`);
    if (!response.ok) throw new Error('Failed to fetch hotels');
    return await response.json();
  } catch (error) {
    console.error('Error fetching hotels:', error);
    throw error;
  }
};

export const getHotelById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/hotels/${id}`);
    if (!response.ok) throw new Error('Failed to fetch hotel');
    return await response.json();
  } catch (error) {
    console.error('Error fetching hotel:', error);
    throw error;
  }
};

export const getHotelRooms = async (hotelId, checkIn, checkOut) => {
  try {
    let url = `${API_URL}/hotels/${hotelId}/rooms`;
    if (checkIn && checkOut) {
      url += `?checkIn=${checkIn}&checkOut=${checkOut}`;
    }
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch rooms');
    return await response.json();
  } catch (error) {
    console.error('Error fetching rooms:', error);
    throw error;
  }
};

export const createBooking = async (bookingData) => {
  try {
    const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
    const response = await fetch(`${API_URL}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(bookingData)
    });
    if (!response.ok) throw new Error('Failed to create booking');
    return await response.json();
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
};

export const getMyBookings = async () => {
  try {
    const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
    const response = await fetch(`${API_URL}/bookings/my`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Failed to fetch bookings');
    return await response.json();
  } catch (error) {
    console.error('Error fetching bookings:', error);
    throw error;
  }
};

export const cancelBooking = async (bookingId) => {
  try {
    const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
    const response = await fetch(`${API_URL}/bookings/${bookingId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Failed to cancel booking');
    return await response.json();
  } catch (error) {
    console.error('Error canceling booking:', error);
    throw error;
  }
};