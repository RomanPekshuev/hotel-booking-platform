import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { authenticateToken } from "../middleware/auth";

const router = Router();
const prisma = new PrismaClient();

router.get("/", async (req: Request, res: Response) => {
  try {
    const { location, minPrice, maxPrice, search } = req.query;
    
    const hotels = await prisma.hotel.findMany({
      where: {
        AND: [
          location ? { location: { contains: location as string, mode: "insensitive" } } : {},
          search ? { 
            OR: [
              { name: { contains: search as string, mode: "insensitive" } },
              { description: { contains: search as string, mode: "insensitive" } }
            ] 
          } : {}
        ]
      },
      include: { rooms: true }
    });
    
    res.json(hotels);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch hotels" });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const hotel = await prisma.hotel.findUnique({
      where: { id: Number(id) },
      include: { 
        rooms: true,
        reviews: { include: { user: { select: { username: true } } } }
      }
    });
    
    if (!hotel) return res.status(404).json({ error: "Hotel not found" });
    
    res.json(hotel);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch hotel" });
  }
});

router.post("/", authenticateToken, async (req: Request, res: Response) => {
  try {
    const { name, description, location, rating, image } = req.body;
    
    const hotel = await prisma.hotel.create({
      data: { name, description, location, rating, image }
    });
    
    res.status(201).json(hotel);
  } catch (error) {
    res.status(500).json({ error: "Failed to create hotel" });
  }
});

router.get("/:id/rooms", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { checkIn, checkOut } = req.query;
    
    const rooms = await prisma.room.findMany({
      where: { 
        hotelId: Number(id),
        available: true
      }
    });
    
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch rooms" });
  }
});

export default router;