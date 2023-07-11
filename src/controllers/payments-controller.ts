import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '../middlewares';
import * as paymentService from '@/services/payments-service';

export async function postPayment(req: AuthenticatedRequest, res: Response) {
  try {
    const { ticketId, cardData } = req.body;
    const { userId } = req;
    if (!cardData) return res.send(httpStatus.BAD_REQUEST);
    const payment = await paymentService.postPaymentService(ticketId, userId, cardData);
    if (!payment) return res.send(httpStatus.NOT_FOUND);
    res.status(httpStatus.CREATED).send(payment);
  } catch (error) {
    if (error.name === 'UnauthorizedError') return res.send(httpStatus.UNAUTHORIZED);

    return res.send(httpStatus.NOT_FOUND);
  }
}
export async function getPayment(req: AuthenticatedRequest, res: Response) {
  try {
    const ticketId = parseInt(req.query.ticketId as string);
    const { userId } = req;

    if (!ticketId) return res.send(httpStatus.BAD_REQUEST);
    const payment = await paymentService.getPayment(userId, ticketId);
    if (!payment) return res.send(httpStatus.NOT_FOUND);
    res.send(payment);
  } catch (error) {
    if (error.name === 'UnauthorizedError') return res.send(httpStatus.UNAUTHORIZED);

    return res.send(httpStatus.NOT_FOUND);
  }
}
