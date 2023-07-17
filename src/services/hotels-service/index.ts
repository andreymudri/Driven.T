import { notFoundError, PaymentIsRequiredError } from '@/errors';
import hotelsRepository from '@/repositories/hotels-repository';
import ticketsRepository from '@/repositories/tickets-repository';

/* 🔐 A listagem só deve funcionar (para ambos endpoints) se para o respectivo usuário existir uma inscrição com ticket pago, que inclui hospedagem.
- Não existe (inscrição, ticket ou hotel): `404 (not found)`
- Ticket não foi pago, é remoto ou não inclui hotel: `402 (payment required)`
- Outros erros: `400 (bad request)`
 */

async function userCheck(userId: number) {
  const ticket = await ticketsRepository.findTicketByUserId(userId);
  if (!ticket || !ticket.Enrollment) throw notFoundError();
  if (ticket.status !== 'PAID' || ticket.TicketType.isRemote || ticket.TicketType.includesHotel) {
    throw PaymentIsRequiredError();
  }
  return ticket;
}

async function getAllHotels(userId: number) {
  userCheck(userId);
  const hotels = await hotelsRepository.findAllHotels();
  if (!hotels || hotels.length === 0) throw notFoundError();
  return hotels;
}

async function getHotelRooms(userId: number, hotelID: number) {
  userCheck(userId);
  const hotelRooms = await hotelsRepository.getHotelRooms(hotelID);
  if (!hotelRooms || hotelRooms.length === 0) throw notFoundError();
  return hotelRooms;
}

const hotelService = {
  getAllHotels,
  getHotelRooms,
};

export default hotelService;
