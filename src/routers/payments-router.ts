/* eslint-disable */
import { Router } from 'express';
import { authenticateToken } from '@/middlewares';

const paymentsRouter = Router();

paymentsRouter.all('/*', authenticateToken).get('/payments').post('/payments/process');

export { paymentsRouter };
