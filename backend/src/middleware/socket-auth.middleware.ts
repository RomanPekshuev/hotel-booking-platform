import type { Socket } from 'socket.io';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export function authenticateSocket(socket: Socket, next: (err?: Error) => void) {
  const token = 
    socket.handshake.auth.token || 
    socket.handshake.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return next(new Error('Authentication required'));
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number; username: string };
    
    socket.data.userId = decoded.id;
    socket.data.nickname = decoded.username;
    
    next();
  } catch (error) {
    next(new Error('Invalid token'));
  }
}