import { Room } from '@prisma/client';
import { prisma } from '@/config';

async function getBooking(userId: number): Promise<{ id: number; Room: Room }> {
  return await prisma.booking.findFirst({
    where: { userId },
    include: {
      Room: true,
    },
  });
}

async function createBooking(userId: number, roomId: number) {
  const createbooking = await prisma.booking.create({
    data: {
      userId: userId,
      roomId: roomId,
    },
  });
  return createbooking;
}

async function updateBooking(bookingId: number, roomId: number) {
  const updatedbooking = await prisma.booking.update({
    where: { id: bookingId },
    data: {
      roomId: roomId,
      updatedAt: new Date(),
    },
  });
  return updatedbooking;
}

async function countRoomBookings(roomId: number) {
  const counter = await prisma.booking.count({
    where: { roomId },
  });
  return counter;
}
async function getRoomById(roomId: number) {
  const room = await prisma.room.findFirst({
    where: {
      id: roomId,
    },
  });
  return room;
}
const bookingRepository = {
  getBooking,
  createBooking,
  updateBooking,
  countRoomBookings,
  getRoomById,
};
export default bookingRepository;
