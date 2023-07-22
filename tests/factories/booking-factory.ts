import faker from '@faker-js/faker';
import { prisma } from '@/config';

export async function createBooking(userId: number, roomId: number) {
  const Booking = await prisma.booking.create({
    data: {
      userId,
      roomId,
      createdAt: new Date(),
    },
  });
  return Booking;
}

export async function updateBooking(roomId: number, id: number) {
  const updatebooking = await prisma.booking.update({
    where: {
      id,
    },
    data: {
      roomId,
      updatedAt: faker.date.future(0.5),
    },
  });
  return updatebooking;
}
