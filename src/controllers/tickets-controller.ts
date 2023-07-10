import { Request, Response } from 'express';
import httpStatus from 'http-status';
import * as ticketService from '@/services/tickets-service';

export async function getTicketTypes(_req: Request, res: Response) {
  const types = await ticketService.getAllTicketTypes();
  return res.status(httpStatus.OK).send(types);
}
export async function getUserTicket(req: Request, res: Response) {
  const result = await ticketService.getUserTicket(req.body.enrollmentId);
  return res.status(httpStatus.OK).send(result);
}
export async function postTicket(req: Request, res: Response) {
  const { userId, ticketTypeId }: { userId: number; ticketTypeId: number } = req.body;
  try {
    if (!ticketTypeId) {
      res.status(httpStatus.BAD_REQUEST).send({ message: 'no ticket was found.' });
    }
    if (!userId) {
      res.status(httpStatus.NOT_FOUND).send({ message: 'user not FOUND.' });
    }
    const ticket = await ticketService.createTicket(userId, ticketTypeId);
    return res.status(httpStatus.CREATED).send(ticket);
  } catch (error) {
    console.log(error.message);
    res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}
