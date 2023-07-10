import { TicketType } from '@prisma/client';
import { prisma } from '@/config';

export async function getAllTicketTypes(): Promise<TicketType[]> {
  return await prisma.ticketType.findMany();
}

export async function getUserTicket(enrollmentId: number) {
  return await prisma.ticket.findFirst({
    include: {
      TicketType: true,
    },
    where: {
      enrollmentId,
    },
  });
}
export async function createTicket(enrollmentId: number, ticketTypeId: number) {
  return await prisma.ticket.create({
    data: {
      enrollmentId: enrollmentId,
      ticketTypeId: ticketTypeId,
      status: 'RESERVED',
    },
    include: {
      TicketType: true,
    },
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
