import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '../middlewares';
import { notFoundError } from '../errors';
import * as ticketService from '@/services/tickets-service';

export async function getTicketTypes(_req: AuthenticatedRequest, res: Response) {
  try {
    const types = await ticketService.getAllTicketTypes();
    return res.status(httpStatus.OK).send(types);
  } catch (error) {
    return res.send(httpStatus.NOT_FOUND);
  }
}
export async function getUserTicket(req: AuthenticatedRequest, res: Response) {
  try {
    const result = await ticketService.getUserTicket(req.userId);
    if (!result) throw notFoundError();
    return res.status(httpStatus.OK).send(result);
  } catch (error) {
    return res.send(httpStatus.NOT_FOUND);
  }
}
export async function postTicket(req: AuthenticatedRequest, res: Response) {
  const { ticketTypeId } = req.body;
  const { userId } = req;
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
    res.sendStatus(httpStatus.NOT_FOUND);
  }
}
