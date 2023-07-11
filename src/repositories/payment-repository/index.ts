import { prisma } from '@/config';
import { PaymentParams } from '@/protocols';
import * as ticketRepository from '@/repositories/ticket-repository';

export async function postPaymentService(ticketId: number, cardData: PaymentParams) {
  await ticketRepository.updateTicketPayment(ticketId);
  const payment = await createPayment(ticketId, cardData);
  return payment;
}
export async function getPayment(ticketId: number) {
  return await prisma.payment.findFirst({
    where: {
      ticketId,
    },
  });
}

async function createPayment(ticketId: number, params: PaymentParams) {
  return await prisma.payment.create({
    data: {
      ticketId,
      ...params,
    },
  });
}
