import express, { Request, Response, NextFunction } from "express";
import { hashPass } from "../utils/hashPass";
import prisma from "../ws/db";
import { comparePass } from "../utils/comparePass";
import jwt from 'jsonwebtoken';
import { authenticateToken } from "../middleware/auth.middleware";

interface RegisterBody {
  username?: string;
  email?: string;
  password?: string;
}

const router = express.Router();

router.post("/login", async (req: Request<{}, {}, { email: string; password: string }>, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isPasswordValid = await comparePass(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const { password: _, ...safeUser } = user;
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '1h' });
    res.json({ ...safeUser, token });
    
  } catch (e) {
    console.error("Login error:", e);
    res.status(500).json({ error: "Login failed" });
  }
});

router.post("/logout", async (req, res) => {
  res.status(200).json({ message: "Logged out" });
});

router.post(
  "/register",
  async (req: Request<{}, {}, RegisterBody>, res: Response) => {
    try {
      const { username, email, password } = req.body;

      if (!username || !email || !password) {
        return res.status(400).json({ 
          error: "Username, email and password are required" 
        });
      }

      const existingUser = await prisma.user.findFirst({
        where: { OR: [{ email }, { username }] }
      });

      if (existingUser) {
        return res.status(400).json({ error: "User already exists" });
      }

      const hashedPass = await hashPass(password);
      const newUser = await prisma.user.create({
        data: { username, email, password: hashedPass },
      });

      const token = jwt.sign({ id: newUser.id, email: newUser.email }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '1h' });
      const { password: _, ...safeUser } = newUser;

      return res.status(201).json({ ...safeUser, token });
    } catch (e) {
      console.error("Registration error:", e);
      return res.status(500).json({ 
        error: e instanceof Error ? e.message : "Internal server error" 
      });
    }
  }
);

router.get("/me", authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true
      }
    });
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    res.json(user);
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

export default router;