import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface SearchFilters {
  query?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  sortBy?: 'rating' | 'price-low' | 'price-high' | 'name';
  location?: string;
}

export class SearchService {
  
  async searchHotels(filters: SearchFilters) {
    const { query, minPrice, maxPrice, minRating, sortBy = 'rating', location } = filters;

    const where: any = {};

    if (query || location) {
      where.OR = [];
      
      if (query) {
        where.OR.push(
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } }
        );
      }
      
      if (location) {
        where.OR.push(
          { location: { contains: location, mode: 'insensitive' } }
        );
      }
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = minPrice;
      if (maxPrice) where.price.lte = maxPrice;
    }

    if (minRating) {
      where.rating = { gte: minRating };
    }

    let orderBy: any = {};
    switch (sortBy) {
      case 'rating':
        orderBy = { rating: 'desc' };
        break;
      case 'price-low':
        orderBy = { price: 'asc' };
        break;
      case 'price-high':
        orderBy = { price: 'desc' };
        break;
      case 'name':
        orderBy = { name: 'asc' };
        break;
    }

    const hotels = await prisma.hotel.findMany({
      where,
      orderBy,
      include: {
        rooms: true
      }
    });

    return hotels;
  }

  async getHotelById(id: number) {
    return await prisma.hotel.findUnique({
      where: { id },
      include: {
        rooms: true,
        reviews: true
      }
    });
  }

  async getAllHotels() {
    return await prisma.hotel.findMany({
      include: {
        rooms: true
      }
    });
  }
}

export default new SearchService();