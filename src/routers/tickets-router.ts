/* eslint-disable */
import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import * as ticketController from '@/controllers/tickets-controller'
const ticketsRouter = Router();

ticketsRouter.all('/*', authenticateToken).get('/',ticketController.getUserTicket).get('/types',ticketController.getTicketTypes).post('/',ticketController.postTicket);

export { ticketsRouter };
