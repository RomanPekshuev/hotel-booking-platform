import { useState } from 'react';
import { getToken } from '../api/auth';

export default function ReviewForm({ hotelId, onReviewAdded }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    const token = getToken();
    if (!token) {
      setError('Пожалуйста, войдите в аккаунт');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/reviews/hotel/${hotelId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ rating, comment })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to submit review');
      }

      setSuccess(true);
      setRating(5);
      setComment('');
      onReviewAdded?.();  // Уведомляем родителя что отзыв добавлен
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ 
      padding: '20px', 
      border: '1px solid #e5e7eb', 
      borderRadius: '8px',
      marginTop: '20px'
    }}>
      <h3 style={{ marginBottom: '16px' }}>Оставить отзыв</h3>
      
      {error && (
        <div style={{ 
          padding: '10px', 
          backgroundColor: '#fee2e2', 
          color: '#dc2626',
          borderRadius: '5px',
          marginBottom: '16px'
        }}>
          {error}
        </div>
      )}
      
      {success && (
        <div style={{ 
          padding: '10px', 
          backgroundColor: '#d1fae5', 
          color: '#059669',
          borderRadius: '5px',
          marginBottom: '16px'
        }}>
          Спасибо за отзыв!
        </div>
      )}
      
      {/* Звёздный рейтинг */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
          Рейтинг:
        </label>
        <div style={{ display: 'flex', gap: '4px' }}>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '32px',
                cursor: 'pointer',
                color: star <= rating ? '#fbbf24' : '#d1d5db',
                padding: '0 4px'
              }}
            >
              ★
            </button>
          ))}
        </div>
      </div>
      
      {/* Комментарий */}
      <div style={{ marginBottom: '16px' }}>
        <label 
          htmlFor="comment" 
          style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}
        >
          Комментарий:
        </label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Расскажите о вашем пребывании..."
          rows={4}
          style={{
            width: '100%',
            padding: '12px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '14px',
            resize: 'vertical'
          }}
          required
        />
      </div>
      
      <button
        type="submit"
        style={{
          padding: '12px 24px',
          backgroundColor: '#7c3aed',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: 'bold'
        }}
      >
        Отправить отзыв
      </button>
    </form>
  );
}