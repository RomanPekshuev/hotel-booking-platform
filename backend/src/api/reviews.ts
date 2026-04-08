import { Router, Request, Response } from 'express';
import prisma from '../ws/db';

const router = Router();

// Получить все отзывы для отеля + средний рейтинг
router.get('/hotel/:hotelId', async (req: Request, res: Response) => {
  try {
    const hotelId = parseInt(req.params.hotelId as string);
    
    const reviews = await prisma.review.findMany({
      where: { hotelId },
      include: { user: { select: { username: true } } },
      orderBy: { createdAt: 'desc' }
    });
    
    // Расчёт среднего рейтинга
    const avgRating = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;
    
    // Обновим рейтинг отеля в базе
    await prisma.hotel.update({
      where: { id: hotelId },
      data: { rating: Math.round(avgRating * 10) / 10 }
    });
    
    res.json({ reviews, avgRating: Math.round(avgRating * 10) / 10 });
  } catch (e) {
    console.error('Get reviews error:', e);
    res.status(500).json({ error: 'Failed to get reviews' });
  }
});

// Создать отзыв
router.post('/hotel/:hotelId', async (req: Request, res: Response) => {
  try {
    const hotelId = parseInt(req.params.hotelId as string);
    const { rating, comment } = req.body;
    
    // Получаем userId из токена (нужно добавить middleware)
    const token = req.headers.authorization?.replace('Bearer ', '');
    // ... декодирование токена (как в auth middleware)
    const userId = 1; // ← Временно хардкод, потом раскомментировать декодирование
    
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be 1-5' });
    }
    
    const review = await prisma.review.create({
      data: {
        userId,
        hotelId,
        rating,
        comment
      },
      include: { user: { select: { username: true } } }
    });
    
    // Пересчитаем средний рейтинг
    const allReviews = await prisma.review.findMany({ where: { hotelId } });
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    
    await prisma.hotel.update({
      where: { id: hotelId },
      data: { rating: Math.round(avgRating * 10) / 10 }
    });
    
    res.status(201).json(review);
  } catch (e) {
    console.error('Create review error:', e);
    res.status(500).json({ error: 'Failed to create review' });
  }
});

export default router;