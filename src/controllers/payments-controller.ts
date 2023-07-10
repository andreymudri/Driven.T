/* eslint-disable */
import { Request, Response } from "express";

export async function postPayment(req: Request, res: Response) {
  const paymentInfo: {
    ticketId: number,
    cardData: {
      issuer: string,
      number: number,
      name: string,
      expirationDate: Date,
      cvv: number
    }
  } = req.body;
  
}
export async function getPayment(req:Request, res: Response) {
  const ticketId: number = parseInt(req.query.ticketId as string);
  if (Number.isNaN(ticketId)) {
    throw Error('ticket ID is wrong ')
  }
}
