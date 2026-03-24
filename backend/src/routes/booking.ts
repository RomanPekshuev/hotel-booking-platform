import express from 'express';
import bookingController from '../controllers/booking.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/my', authenticateToken, (req, res) => bookingController.getMyBookings(req, res));

router.get('/:id', authenticateToken, (req, res) => bookingController.getBookingById(req, res));

router.post('/', authenticateToken, (req, res) => bookingController.createBooking(req, res));

router.delete('/:id', authenticateToken, (req, res) => bookingController.cancelBooking(req, res));

export default router;