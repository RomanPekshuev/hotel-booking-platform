import { useState } from 'react';
import { useChatSocket } from '../chat/useChatSocket';

export default function AdminChatPanel() {
  const [input, setInput] = useState('');
  const token = localStorage.getItem('token');
  
  // Подключаемся к чату
  const { status, messages, sendMessage } = useChatSocket('http://localhost:3000', token);
  
  // Отправка сообщения от имени поддержки
  const handleSend = (e) => {
    e.preventDefault();
    if (input.trim() && status === 'connected') {
      // Отправляем сообщение (бэкенд должен определить что это от support)
      sendMessage(input);
      setInput('');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Панель поддержки</h1>
      
      <div style={{ 
        marginBottom: '20px', 
        padding: '10px',
        backgroundColor: status === 'connected' ? '#d1fae5' : '#fee2e2',
        borderRadius: '5px'
      }}>
        Статус: {status === 'connected' ? '🟢 Онлайн' : '🔴 Оффлайн'}
      </div>
      
      {/* Область сообщений */}
      <div style={{ 
        height: '500px', 
        overflowY: 'auto', 
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '16px',
        backgroundColor: '#f9fafb'
      }}>
        {messages.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#6b7280' }}>
            Нет сообщений
          </p>
        ) : (
          messages.map((msg) => (
            <div 
              key={msg.id} 
              style={{ 
                marginBottom: '12px',
                textAlign: msg.author === 'support' ? 'right' : 'left'
              }}
            >
              <div 
                style={{
                  display: 'inline-block',
                  padding: '12px',
                  backgroundColor: msg.author === 'support' 
                    ? '#3b82f6'  // Синий для поддержки
                    : '#e5e7eb',  // Серый для пользователей
                  color: msg.author === 'support' ? 'white' : '#1f2937',
                  borderRadius: '8px',
                  maxWidth: '80%',
                  textAlign: 'left'
                }}
              >
                <div style={{ fontWeight: 'bold', marginBottom: '4px', fontSize: '12px' }}>
                  {msg.author === 'support' ? '🎧 Поддержка' : `👤 ${msg.author || 'Пользователь'}`}
                </div>
                <div>{msg.text}</div>
                <div style={{ fontSize: '11px', opacity: 0.8, marginTop: '4px' }}>
                  {new Date(msg.createdAt).toLocaleString()}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* Форма отправки */}
      <form onSubmit={handleSend} style={{ 
        display: 'flex',
        gap: '8px'
      }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Введите ответ..."
          disabled={status !== 'connected'}
          style={{
            flex: 1,
            padding: '12px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '14px'
          }}
        />
        <button
          type="submit"
          disabled={status !== 'connected' || !input.trim()}
          style={{
            padding: '12px 24px',
            backgroundColor: status === 'connected' && input.trim() ? '#3b82f6' : '#9ca3af',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: status === 'connected' && input.trim() ? 'pointer' : 'not-allowed',
            fontWeight: 'bold'
          }}
        >
          Отправить
        </button>
      </form>
    </div>
  );
}