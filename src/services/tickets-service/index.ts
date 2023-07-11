import { TicketStatus } from '@prisma/client';
import { notFoundError } from '../../errors';
import { CreateTicketParams } from '../../protocols';
import * as ticketRepository from '@/repositories/ticket-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';

export async function getAllTicketTypes() {
  const types = await ticketRepository.getAllTicketTypes();
  if (!types) throw notFoundError();
  return types;
}
export async function getUserTicket(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw notFoundError();
  const ticket = await ticketRepository.getUserTicket(enrollment.id);
  if (!ticket) throw notFoundError();
  return ticket;
}

export async function createTicket(userId: number, ticketTypeId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw notFoundError();
  const ticketInfo: CreateTicketParams = {
    ticketTypeId,
    enrollmentId: enrollment.id,
    status: TicketStatus.RESERVED,
  };
  await ticketRepository.createTicket(ticketInfo);
  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);
  return ticket;
}
