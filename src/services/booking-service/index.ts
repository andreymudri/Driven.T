import { forbiddenError, notFoundError } from '@/errors';
import bookingRepository from '@/repositories/booking-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';
import ticketRepository from '@/repositories/tickets-repository';

async function getBooking(userId: number) {
  const booking = await bookingRepository.getBooking(userId);
  if (!booking) throw notFoundError();

  return booking;
}

async function createBooking(userId: number, roomId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);
  if (ticket.TicketType.isRemote || !ticket.TicketType.includesHotel || ticket.status !== 'PAID') {
    throw forbiddenError();
  }
  const room = await bookingRepository.getRoomById(roomId);
  if (!room) throw notFoundError();
  const count = await bookingRepository.countRoomBookings(roomId);
  if (room.capacity === count) throw forbiddenError();
  const booking = await bookingRepository.createBooking(userId, roomId);
  return booking;
}

async function updateBooking(userId: number, bookingId: number, roomId: number) {
  const getbooking = await bookingRepository.getBooking(userId);
  if (!getbooking.Room) throw notFoundError();

  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);
  if (ticket.TicketType.isRemote || !ticket.TicketType.includesHotel || ticket.status !== 'PAID') {
    throw forbiddenError();
  }
  const room = await bookingRepository.getRoomById(roomId);
  if (!room) throw notFoundError();
  const count = await bookingRepository.countRoomBookings(roomId);
  if (room.capacity === count) throw forbiddenError();
  const booking = await bookingRepository.updateBooking(bookingId, roomId);
  return booking;
}

const bookingService = {
  getBooking,
  createBooking,
  updateBooking,
};
export default bookingService;
