import * as ticketRepository from '@/repositories/ticket-repository';

export async function getAllTicketTypes() {
  return await ticketRepository.getAllTicketTypes();
}
export async function getUserTicket(enrollmentId: number) {
  return await ticketRepository.getUserTicket(enrollmentId);
}

export async function createTicket(enrollmentId: number, ticketTypeId: number) {
  return await ticketRepository.createTicket(enrollmentId, ticketTypeId);
}
