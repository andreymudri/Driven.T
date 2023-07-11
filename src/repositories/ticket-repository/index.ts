import { TicketStatus, TicketType } from '@prisma/client';
import { CreateTicketParams } from '../../protocols';
import { prisma } from '@/config';

export async function getAllTicketTypes(): Promise<TicketType[]> {
  return await prisma.ticketType.findMany();
}

export async function getUserTicket(enrollmentId: number) {
  return await prisma.ticket.findFirst({
    where: {
      enrollmentId,
    },
    include: {
      TicketType: true,
    },
  });
}
export async function createTicket(ticket: CreateTicketParams) {
  return prisma.ticket.create({
    data: ticket,
  });
}

export async function checkTicket(userId: number) {
  return await prisma.ticket.findFirst({
    where: {
      id: userId,
    },
    include: {
      Enrollment: true,
      TicketType: true,
    },
  });
}
export async function findTicketByEnrollmentId(enrollmentId: number) {
  return await prisma.ticket.findFirst({
    where: {
      enrollmentId,
    },
    include: {
      TicketType: true,
    },
  });
}
export async function updateTicketPayment(ticketId: number) {
  return prisma.ticket.update({
    where: {
      id: ticketId,
    },
    data: {
      status: TicketStatus.PAID,
    },
  });
}

export async function findTicketByID(ticketId: number) {
  return await prisma.ticket.findFirst({
    where: {
      id: ticketId,
    },
    include: {
      TicketType: true,
    },
  });
}
