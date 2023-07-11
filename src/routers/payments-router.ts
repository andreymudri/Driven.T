import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import * as paymentController from '@/controllers/payments-controller';

const paymentsRouter = Router();

paymentsRouter
  .all('/*', authenticateToken)
  .get('/', paymentController.getPayment)
  .post('/process', paymentController.postPayment);

export { paymentsRouter };
