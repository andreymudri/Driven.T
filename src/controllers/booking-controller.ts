import { Response } from 'express';
import httpStatus from 'http-status';
import bookingService from '@/services/booking-service';
import { AuthenticatedRequest } from '@/middlewares';
import { inputBookingBody } from '@/protocols';

async function getBooking(req: AuthenticatedRequest, res: Response) {
  try {
    const { userId } = req;
    const booking = bookingService.getBooking(userId);
    return res.status(httpStatus.OK).send(booking);
  } catch (error) {
    if (error.name === 'NotFoundError') return res.status(404);
    if (error.name === 'ForbiddenError') return res.status(403);
    return res.status(403).send('Cannot edit booking');
  }
}
async function createBooking(req: AuthenticatedRequest, res: Response) {
  try {
    const { roomId } = req.body as inputBookingBody;
    const { userId } = req;
    const booking = bookingService.createBooking(userId, roomId);
    return res.status(httpStatus.OK).send(booking);
  } catch (error) {
    if (error.name === 'NotFoundError') return res.status(404);
    if (error.name === 'ForbiddenError') return res.status(403).send('Cannot add booking');
    return res.status(403).send('Cannot add booking');
  }
}
async function editBooking(req: AuthenticatedRequest, res: Response) {
  try {
    const { userId } = req;
    const bookingId = Number(req.params.bookingId);
    const { roomId } = req.body as inputBookingBody;
    const booking = bookingService.updateBooking(roomId, userId, bookingId);
    return res.status(httpStatus.OK).send(booking);
  } catch (error) {
    if (error.name === 'NotFoundError') return res.status(404);
    if (error.name === 'ForbiddenError') return res.status(403).send('Cannot edit booking');
    return res.status(403).send('Cannot edit booking');
  }
}

const bookingController = {
  getBooking,
  createBooking,
  editBooking,
};

export { bookingController };
