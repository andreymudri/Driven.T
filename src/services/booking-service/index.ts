import { forbiddenError, notFoundError } from '@/errors';
import bookingRepository from '@/repositories/booking-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';
import ticketRepository from '@/repositories/tickets-repository';

async function getBooking(userId: number) {
  const booking = await bookingRepository.getBooking(userId);
  if (!booking) throw notFoundError();

  return booking;
}
async function checkBooking(userId: number, roomId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);

  if (ticket.TicketType.isRemote || !ticket.TicketType.includesHotel || ticket.status !== 'PAID') {
    throw forbiddenError();
  }
  const booking = await bookingRepository.getBooking(userId);
  if (!booking.Room) throw notFoundError();
  if (!booking) throw notFoundError();
  const room = booking.Room;
  const count = await bookingRepository.countRoomBookings(roomId);
  if (room.capacity === count) throw forbiddenError();
}
async function createBooking(userId: number, roomId: number) {
  await checkBooking(userId, roomId);
  const booking = await bookingRepository.createBooking(roomId, userId);
  return booking;
}

async function updateBooking(userId: number, bookingId: number, roomId: number) {
  await checkBooking(userId, roomId);
  const booking = await bookingRepository.updateBooking(bookingId, roomId);
  return booking;
}

const bookingService = {
  getBooking,
  createBooking,
  updateBooking,
};
export default bookingService;
