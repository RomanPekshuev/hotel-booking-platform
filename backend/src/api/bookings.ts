import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { authenticateUser, type AuthRequest } from '../middleware/authenticateUser';

const router = Router();
const prisma = new PrismaClient();

router.get("/my", authenticateUser, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const bookings = await prisma.booking.findMany({
      where: { userId },
      include: { 
        room: { include: { hotel: true } }
      },
      orderBy: { createdAt: "desc" }
    });
    
    res.json(bookings);
  } catch (error) {
    console.error("Fetch bookings error:", error);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});

router.post("/", authenticateUser, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const { roomId, checkIn, checkOut } = req.body;
    
    if (!roomId || !checkIn || !checkOut) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    
    const room = await prisma.room.findUnique({
      where: { id: Number(roomId) }
    });
    
    if (!room || !room.available) {
      return res.status(400).json({ error: "Room not available" });
    }
    
    const booking = await prisma.booking.create({
      data: {
        userId,
        roomId: Number(roomId),
        checkIn: new Date(checkIn),
        checkOut: new Date(checkOut),
        status: "confirmed"
      }
    });
    
    res.status(201).json(booking);
  } catch (error) {
    console.error("Create booking error:", error);
    res.status(500).json({ error: "Failed to create booking" });
  }
});

router.delete("/:id", authenticateUser, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const { id } = req.params;
    
    const booking = await prisma.booking.findUnique({
      where: { id: Number(id) }
    });
    
    if (!booking) return res.status(404).json({ error: "Booking not found" });
    if (booking.userId !== userId) return res.status(403).json({ error: "Access denied" });
    
    await prisma.booking.update({
      where: { id: Number(id) },
      data: { status: "cancelled" }
    });
    
    res.json({ message: "Booking cancelled" });
  } catch (error) {
    console.error("Cancel booking error:", error);
    res.status(500).json({ error: "Failed to cancel booking" });
  }
});

export default router;