import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class BookingController {
  async getMyBookings(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;

      const bookings = await prisma.booking.findMany({
        where: { userId },
        include: {
          room: {
            include: {
              hotel: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });

      res.json(bookings);
    } catch (error: any) {
      console.error('Get bookings error:', error);
      res.status(500).json({ error: 'Failed to fetch bookings' });
    }
  }

  async getBookingById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).user.id;

      const booking = await prisma.booking.findUnique({
        where: { id: Number(id), userId },
        include: {
          room: {
            include: {
              hotel: true
            }
          }
        }
      });

      if (!booking) {
        return res.status(404).json({ error: 'Booking not found' });
      }

      res.json(booking);
    } catch (error: any) {
      console.error('Get booking error:', error);
      res.status(500).json({ error: 'Failed to fetch booking' });
    }
  }

  async createBooking(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const { roomId, checkIn, checkOut, guests } = req.body;

      const booking = await prisma.booking.create({
        data: {
          userId,
          roomId,
          checkIn: new Date(checkIn),
          checkOut: new Date(checkOut),
          guests
        },
        include: {
          room: {
            include: {
              hotel: true
            }
          }
        }
      });

      res.status(201).json(booking);
    } catch (error: any) {
      console.error('Create booking error:', error);
      res.status(500).json({ error: 'Failed to create booking' });
    }
  }

  async cancelBooking(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).user.id;

      const booking = await prisma.booking.update({
        where: { id: Number(id), userId },
        data: { status: 'cancelled' }
      });

      res.json(booking);
    } catch (error: any) {
      console.error('Cancel booking error:', error);
      res.status(500).json({ error: 'Failed to cancel booking' });
    }
  }
}

export default new BookingController();