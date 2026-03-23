import { Request, Response } from 'express';
import searchService from '../services/search.service';

export class HotelController {
  
  async getHotels(req: Request, res: Response) {
    try {
      const { 
        query, 
        minPrice, 
        maxPrice, 
        minRating, 
        sortBy,
        location 
      } = req.query;

      const filters = {
        query: query as string,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        minRating: minRating ? Number(minRating) : undefined,
        sortBy: sortBy as 'rating' | 'price-low' | 'price-high' | 'name',
        location: location as string
      };

      const hotels = await searchService.searchHotels(filters);

      res.json(hotels);
      
    } catch (error) {
      console.error('Error in getHotels:', error);
      res.status(500).json({ 
        error: 'Failed to fetch hotels',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async getHotelById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const hotel = await searchService.getHotelById(Number(id));

      if (!hotel) {
        return res.status(404).json({ error: 'Hotel not found' });
      }

      res.json(hotel);
      
    } catch (error) {
      console.error('Error in getHotelById:', error);
      res.status(500).json({ 
        error: 'Failed to fetch hotel',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async getAllHotels(req: Request, res: Response) {
    try {
      const hotels = await searchService.getAllHotels();
      res.json(hotels);
    } catch (error) {
      console.error('Error in getAllHotels:', error);
      res.status(500).json({ 
        error: 'Failed to fetch hotels' 
      });
    }
  }
}

export default new HotelController();