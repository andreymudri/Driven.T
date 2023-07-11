import { Router } from 'express';
import { ticketSchema } from '../schemas/ticket-schema';
import { authenticateToken, validateBody } from '@/middlewares';
import * as ticketController from '@/controllers/tickets-controller';

const ticketsRouter = Router();

ticketsRouter
  .all('/*', authenticateToken)
  .get('/', ticketController.getUserTicket)
  .get('/types', ticketController.getTicketTypes)
  .post('/', validateBody(ticketSchema), ticketController.postTicket);

export { ticketsRouter };
