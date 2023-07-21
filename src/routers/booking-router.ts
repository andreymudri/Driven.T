import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { bookingController } from '@/controllers/booking-controller';

const bookingRouter = Router();

bookingRouter
  .all('/*', authenticateToken)
  .get('/', bookingController.getBooking)
  .post('/', bookingController.createBooking)
  .put('/:bookingId', bookingController.editBooking);

export { bookingRouter };
