import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { authenticateToken } from "../middleware/auth";

const router = Router();
const prisma = new PrismaClient();

router.get("/my", authenticateToken, async (req: Request, res: Response) => {
  try {
    // @ts-ignore - userId добавляется middleware authenticateToken
    const userId = req.user?.id;
    
    const bookings = await prisma.booking.findMany({
      where: { userId },
      include: { 
        room: { include: { hotel: true } }
      },
      orderBy: { createdAt: "desc" }
    });
    
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});

router.post("/", authenticateToken, async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const userId = req.user?.id;
    const { roomId, checkIn, checkOut } = req.body;
    
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
    res.status(500).json({ error: "Failed to create booking" });
  }
});

router.delete("/:id", authenticateToken, async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const userId = req.user?.id;
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
    res.status(500).json({ error: "Failed to cancel booking" });
  }
});

export default router;