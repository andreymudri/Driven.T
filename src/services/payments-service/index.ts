/* eslint-disable */
import { prisma } from '@/config';


export async function postPaymentService(paymentInfo: {
  ticketId: number,
  cardData: {
    issuer: string,
    number: number,
    name: string,
    expirationDate: Date,
    cvv: number
  }
}) {
  try {
    const lastFourDigits = paymentInfo.cardData.number.toString().slice(-4);
    

  } catch (error) {
    throw new Error('Failed to process payment');
  }
}
