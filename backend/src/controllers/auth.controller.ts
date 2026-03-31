import { Request, Response } from 'express';
import authService from '../services/auth.service';

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const { email, password, username } = req.body;
      
      const user = await authService.register(username, email, password);
      
      res.status(201).json({
        message: 'User registered successfully',
        user: {
          id: user.id,
          email: user.email,
          username: user.username
        }
      });
    } catch (error: any) {
      console.error('Register error:', error);
      res.status(400).json({ error: error.message });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const userAgent = req.headers['user-agent'];
      const ipAddress = req.ip;
      
      const tokens = await authService.login(email, password, userAgent as string, ipAddress as string);
      
      res.json({
        message: 'Login successful',
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken
      });
    } catch (error: any) {
      console.error('Login error:', error);
      res.status(401).json({ error: error.message });
    }
  }

  async refresh(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;
      
      const tokens = await authService.refreshToken(refreshToken);
      
      res.json({
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken
      });
    } catch (error: any) {
      console.error('Refresh error:', error);
      res.status(403).json({ error: 'Invalid refresh token' });
    }
  }

  async logout(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;
      
      await authService.logout(refreshToken);
      
      res.json({ message: 'Logged out' });
    } catch (error: any) {
      console.error('Logout error:', error);
      res.status(400).json({ error: error.message });
    }
  }

  async getProfile(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      
      const user = await authService.getUserProfile(userId);
      
      res.json(user);
    } catch (error: any) {
      console.error('Get profile error:', error);
      res.status(500).json({ error: error.message });
    }
  }

  async updateProfile(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const { username, email } = req.body;
      
      const user = await authService.updateProfile(userId, username, email);
      
      res.json(user);
    } catch (error: any) {
      console.error('Update profile error:', error);
      res.status(500).json({ error: error.message });
    }
  }

  async getSessions(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      
      const sessions = await authService.getUserSessions(userId);
      
      res.json({ sessions });
    } catch (error: any) {
      console.error('Get sessions error:', error);
      res.status(500).json({ error: error.message });
    }
  }

  async deleteSession(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const { sessionId } = req.params;
      
      await authService.deleteSession(userId, Number(sessionId));
      
      res.json({ message: 'Session deleted' });
    } catch (error: any) {
      console.error('Delete session error:', error);
      res.status(400).json({ error: error.message });
    }
  }
}

export default new AuthController();