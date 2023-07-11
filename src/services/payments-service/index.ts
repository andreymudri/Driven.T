import { PaymentParams, cardDataParams } from '../../protocols';
import { notFoundError, unauthorizedError } from '../../errors';
import * as ticketRepository from '@/repositories/ticket-repository';
import * as paymentRepository from '@/repositories/payment-repository';

export async function VerifyTicketIntegrity(ticketId: number, userId: number) {
  const ticket = await ticketRepository.findTicketByID(ticketId);
  if (!ticket) throw notFoundError();
  const checkPayment = await ticketRepository.getUserTicket(ticket.enrollmentId);
  if (!checkPayment) throw notFoundError();
  if (checkPayment.id !== userId) throw unauthorizedError();
}
export async function postPaymentService(ticketId: number, userId: number, cardData: cardDataParams) {
  await VerifyTicketIntegrity(userId, ticketId);
  const ticket = await ticketRepository.findTicketByID(ticketId);
  if (!ticket) throw notFoundError();
  const paymentData: PaymentParams = {
    cardIssuer: cardData.issuer,
    cardLastDigits: cardData.number.toString().slice(-4),
    value: ticket.TicketType.price,
    ticketId,
  };
  const postPayment = await paymentRepository.postPaymentService(ticketId, paymentData);
  return postPayment;
}
export async function getPayment(userId: number, ticketId: number) {
  await VerifyTicketIntegrity(userId, ticketId);
  const payment = paymentRepository.getPayment(ticketId);
  if (!payment) throw notFoundError();
  return payment;
}
