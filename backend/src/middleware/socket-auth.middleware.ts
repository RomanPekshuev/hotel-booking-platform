import type { Socket } from 'socket.io';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export function authenticateSocket(socket: Socket, next: (err?: Error) => void) {
  // Получаем токен из auth объекта или заголовка
  const token = 
    socket.handshake.auth.token || 
    socket.handshake.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return next(new Error('Authentication required'));
  }

  try {
    // Верифицируем токен
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number; username: string };
    
    // Сохраняем данные пользователя в сокете (доступно в chatSockets)
    socket.data.userId = decoded.id;
    socket.data.nickname = decoded.username;  // Используем username как никнейм
    
    next();  // Разрешаем подключение
  } catch (error) {
    next(new Error('Invalid token'));  // Отклоняем подключение
  }
}