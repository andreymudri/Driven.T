import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import hotelService from '@/services/hotels-service';

/* 🔐 A listagem só deve funcionar (para ambos endpoints) se para o respectivo usuário existir uma inscrição com ticket pago, que inclui hospedagem.
- Não existe (inscrição, ticket ou hotel): `404 (not found)`
- Ticket não foi pago, é remoto ou não inclui hotel: `402 (payment required)`
- Outros erros: `400 (bad request)`
 */

export async function getAllHotels(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  try {
    const allHotels = hotelService.getAllHotels(userId);
    return res.status(httpStatus.OK).send(allHotels);
  } catch (error) {
    if (error.name === 'PaymentIsRequiredError') {
      return res.send(httpStatus.PAYMENT_REQUIRED).send('Payment is REQUIRED!');
    }
    if (error.name === 'NotFoundError') {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    res.status(httpStatus.BAD_REQUEST).send(error.message);
  }
}
export async function getHotelRooms(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const id = req.params.hotelId as unknown as number;
  try {
    const hotelRoom = hotelService.getHotelRooms(userId, id);
    res.status(httpStatus.OK).send(hotelRoom);
  } catch (error) {
    if (error.name === 'PaymentIsRequiredError') {
      return res.send(httpStatus.PAYMENT_REQUIRED).send('Payment is REQUIRED!');
    }
    if (error.name === 'NotFoundError') {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    return res.status(httpStatus.BAD_REQUEST).send(error.message);
  }
}
const hotelsController = {
  getAllHotels,
  getHotelRooms,
};
export default hotelsController;
