import express from 'express';
import hotelController from '../controllers/hotel.controller.js';

const router = express.Router();

router.get('/', (req, res) => hotelController.getHotels(req, res));

router.get('/:id', (req, res) => hotelController.getHotelById(req, res));

export default router;