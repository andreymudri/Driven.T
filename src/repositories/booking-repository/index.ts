import { prisma } from '@/config';

async function getBooking(userId: number) {
  const bookings = await prisma.booking.findFirst({
    select: {
      id: true,
      Room: true,
    },
    where: { userId },
  });
  return bookings;
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
      roomId,
      updatedAt: new Date(),
    },
  });
  return updatedbooking;
}

async function countRoomBookings(roomId: number) {
  const counter = prisma.booking.count({
    where: { roomId },
  });
  return counter;
}

const bookingRepository = {
  getBooking,
  createBooking,
  updateBooking,
  countRoomBookings,
};
export default bookingRepository;
