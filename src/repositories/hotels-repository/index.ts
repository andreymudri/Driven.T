import { prisma } from '@/config';

async function findAllHotels() {
  return await prisma.hotel.findMany();
}

async function getHotelRooms(id: number) {
  const hotelRooms = await prisma.hotel.findMany({
    where: {
      id,
    },
    include: {
      Rooms: true,
    },
  });
  return hotelRooms;
}
const hotelsRepository = {
  getHotelRooms,
  findAllHotels,
};

export default hotelsRepository;
