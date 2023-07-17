import { Router } from 'express';
import hotelsController from '../controllers/hotels-controller';
import { authenticateToken } from '@/middlewares';

const hotelsRouter = Router();

hotelsRouter
  .all('/*', authenticateToken)
  .get('/', hotelsController.getAllHotels)
  .get('/:hotelId', hotelsController.getHotelRooms);

export { hotelsRouter };
