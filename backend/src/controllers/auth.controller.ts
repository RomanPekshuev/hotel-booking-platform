import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const { email, password, username, role = 'user' } = req.body;

      // Проверка существования пользователя
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });

      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
      }

      // Хэширование пароля
      const hashedPassword = await bcrypt.hash(password, 10);

      // Создание пользователя
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          username,
          role
        }
      });

      res.status(201).json({
        message: 'User registered successfully',
        user: {
          id: user.id,
          email: user.email,
          name: user.username,
          role: user.role
        }
      });
    } catch (error: any) {
      console.error('Register error:', error);
      res.status(500).json({ error: 'Failed to register user' });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      // Поиск пользователя
      const user = await prisma.user.findUnique({
        where: { email }
      });

      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Проверка пароля
      const validPassword = await bcrypt.compare(password, user.password);

      if (!validPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Генерация токена
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.username,
          role: user.role
        }
      });
    } catch (error: any) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Failed to login' });
    }
  }

  async getProfile(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          username: true,
          role: true,
          createdAt: true
        }
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json(user);
    } catch (error: any) {
      console.error('Get profile error:', error);
      res.status(500).json({ error: 'Failed to get profile' });
    }
  }

  async updateProfile(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const { username, email } = req.body;

      const user = await prisma.user.update({
        where: { id: userId },
        data: { username, email },
        select: {
          id: true,
          email: true,
          username: true,
          role: true
        }
      });

      res.json(user);
    } catch (error: any) {
      console.error('Update profile error:', error);
      res.status(500).json({ error: 'Failed to update profile' });
    }
  }
}

export default new AuthController();