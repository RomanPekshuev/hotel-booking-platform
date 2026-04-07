import React, { useState, useRef, useEffect } from 'react';
import { useChatSocket } from '../chat/useChatSocket';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  
  // Получаем токен из localStorage (проверяем все возможные ключи)
  const token = typeof window !== 'undefined' 
    ? localStorage.getItem('accessToken')
    || localStorage.getItem('token')
    || localStorage.getItem('authToken')
    : null;
  
  // ← ВАЖНО: передаём только backendUrl (как требует useChatSocket из референса)
  const { status, error, messages, connect, disconnect, sendMessage } = useChatSocket('http://localhost:3000');
  
  const messagesEndRef = useRef(null);
  const hasConnectedRef = useRef(false);

  // Авто-скролл к последнему сообщению
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ← ВАЖНО: вручную подключаемся при наличии токена
  useEffect(() => {
    if (token && !hasConnectedRef.current) {
      console.log('🔌 Подключаемся к чату...');
      connect({ 
        room: 'public', 
        nickname: 'user'  // или можно получить username из токена/профиля
      });
      hasConnectedRef.current = true;
    }
    
    return () => {
      disconnect();
      hasConnectedRef.current = false;
    };
  }, [token, connect, disconnect]);

  const handleSend = (e) => {
    e.preventDefault();
    console.log('🔵 Клик по отправке!');
    console.log('📝 Текст:', input);
    console.log('📡 Статус:', status);
    console.log('🔑 Токен:', token ? 'есть' : 'нет');

    if (input.trim() && status === 'connected') {
      sendMessage(input);
      setInput('');
      console.log('✅ Отправлено');
    } else if (!token) {
      console.log('❌ Нет токена — не авторизован');
    } else if (status !== 'connected') {
      console.log('❌ Статус не connected:', status);
    }
  };

  const getStatusColor = () => {
    if (status === 'connected') return '🟢';
    if (status === 'connecting') return '🟡';
    return '🔴';
  };

  const getStatusText = () => {
    if (status === 'connected') return 'Онлайн';
    if (status === 'connecting') return 'Подключение...';
    return 'Не подключено';
  };

  return (
    <>
      {/* Кнопка */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '56px',
          height: '56px',
          backgroundColor: '#2563eb',
          color: 'white',
          borderRadius: '50%',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          zIndex: 9999,
          border: 'none',
          cursor: 'pointer',
          fontSize: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        💬
      </button>
      
      {/* Окно чата */}
      {isOpen && (
        <div 
          style={{
            position: 'fixed',
            bottom: '96px',
            right: '24px',
            width: '320px',
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            zIndex: 9999,
            overflow: 'hidden'
          }}
        >
          {/* Заголовок */}
          <div style={{ 
            backgroundColor: '#2563eb', 
            color: 'white', 
            padding: '12px 16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <div style={{ fontWeight: 'bold', fontSize: '16px' }}>Поддержка</div>
              <div style={{ fontSize: '12px', opacity: 0.9 }}>
                {getStatusColor()} {getStatusText()}
                {error && <span style={{color: '#fecaca'}}> — {error}</span>}
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              style={{ 
                background: 'none', 
                border: 'none', 
                color: 'white',
                fontSize: '24px', 
                cursor: 'pointer',
                padding: '0 4px',
                lineHeight: 1
              }}
            >
              ✕
            </button>
          </div>
          
          {/* Сообщения */}
          <div style={{ 
            height: '300px', 
            overflowY: 'auto', 
            padding: '16px',
            backgroundColor: '#f9fafb'
          }}>
            {messages.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#6b7280', marginTop: '40px' }}>
                <p>Нет сообщений</p>
                <p style={{ fontSize: '12px', marginTop: '8px' }}>Напишите нам!</p>
              </div>
            ) : (
              messages.map((msg) => (
                <div 
                  key={msg.id} 
                  style={{ 
                    marginBottom: '12px',
                    textAlign: (msg.author === 'support' || msg.kind === 'system') ? 'left' : 'right'
                  }}
                >
                  <div 
                    style={{
                      display: 'inline-block',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      maxWidth: '85%',
                      backgroundColor: (msg.author === 'support' || msg.kind === 'system') 
                        ? '#e5e7eb' 
                        : '#2563eb',
                      color: (msg.author === 'support' || msg.kind === 'system')
                        ? '#1f2937'
                        : 'white',
                      wordWrap: 'break-word'
                    }}
                  >
                    {msg.text}
                  </div>
                  <div style={{ fontSize: '10px', color: '#9ca3af', marginTop: '4px' }}>
                    {new Date(msg.createdAt).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Форма ввода */}
          <form onSubmit={handleSend} style={{ 
            padding: '12px 16px',
            borderTop: '1px solid #e5e7eb',
            display: 'flex',
            gap: '8px'
          }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Введите сообщение..."
              disabled={false}
              style={{
                flex: 1,
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                outline: 'none'
              }}
            />
            <button
              type="submit"
              disabled={!input.trim()}
              style={{
                padding: '8px 16px',
                backgroundColor: status === 'connected' && input.trim() ? '#2563eb' : '#9ca3af',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: status === 'connected' && input.trim() ? 'pointer' : 'not-allowed',
                fontSize: '14px'
              }}
            >
              ➤
            </button>
          </form>
        </div>
      )}
    </>
  );
}