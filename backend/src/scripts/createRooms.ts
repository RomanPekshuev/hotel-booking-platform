import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createRooms() {
  const rooms = [
    // Grand Hotel (id=1)
    {
      hotelId: 1,
      type: 'Standard',
      price: 100,
      capacity: 2,
      available: true
    },
    {
      hotelId: 1,
      type: 'Deluxe',
      price: 200,
      capacity: 3,
      available: true
    },
    // Eleon (id=2)
    {
      hotelId: 2,
      type: 'Standard',
      price: 120,
      capacity: 2,
      available: true
    },
    {
      hotelId: 2,
      type: 'Suite',
      price: 250,
      capacity: 4,
      available: true
    },
    // Moskow (id=3)
    {
      hotelId: 3,
      type: 'Standard',
      price: 90,
      capacity: 2,
      available: true
    },
    {
      hotelId: 3,
      type: 'Double',
      price: 150,
      capacity: 3,
      available: true
    }
  ];

  for (const room of rooms) {
    await prisma.room.create({ data: room });
  }

  console.log('Rooms created successfully!');
}

createRooms()
  .catch(console.error)
  .finally(() => prisma.$disconnect());