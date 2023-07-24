import { TicketType } from '@prisma/client';
import httpStatus from 'http-status';
import faker from '@faker-js/faker';
import supertest from 'supertest';
import * as jwt from 'jsonwebtoken';
import { TicketStatus } from '.prisma/client';
import { cleanDb, generateValidToken } from '../helpers';
import {
  createBooking,
  createEnrollmentWithAddress,
  createHotel,
  createPayment,
  createRoomWithHotelId,
  createTicket,
  createTicketTypeWithHotel,
  createUser,
} from '../factories';
import app, { init } from '@/app';

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe('GET /booking', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.get('/booking');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });
  it('should respond with status 200 and booking id on success', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketTypeWithHotel();
    await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
    const hotel = await createHotel();
    const room = await createRoomWithHotelId(hotel.id);
    await createBooking(user.id, room.id);
    const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(httpStatus.OK);
  });
  it('should respond with status 404 when the user has no booking', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(httpStatus.NOT_FOUND);
  });
});

describe('when token is valid', () => {
  it('should respond with status 200 and booking id on success', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketTypeWithHotel();
    await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
    const hotel = await createHotel();
    const room = await createRoomWithHotelId(hotel.id);

    const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({
      roomId: room.id,
    });
    expect(response.status).toBe(httpStatus.OK);
    expect(response.body).toEqual({
      bookingId: expect.any(Number),
    });
  });

  it('should respond with status 404 when the room does not exist', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketTypeWithHotel();
    await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
    const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({
      roomId: 999999999,
    });
    expect(response.status).toBe(httpStatus.NOT_FOUND);
  });
});
describe('when changing a booking', () => {
  it('should respond with status 200 when editing a booking', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketTypeWithHotel();
    await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
    const hotel = await createHotel();
    const room = await createRoomWithHotelId(hotel.id);
    const secondRoom = await createRoomWithHotelId(hotel.id);
    const booking = await createBooking(user.id, room.id);
    const response = await server.put(`/booking/${booking.id}`).set('Authorization', `Bearer ${token}`).send({
      bookingId: secondRoom.id,
    });
    expect(response.status).toBe(httpStatus.OK);
  });
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.put('/booking/1');
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();
    const response = await server.put('/booking/1').set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 403 if user does not have a booking', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketTypeWithHotel();
    await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
    const hotel = await createHotel();
    const room = await createRoomWithHotelId(hotel.id);

    const response = await server
      .put('/booking/99999')
      .set('Authorization', `Bearer ${token}`)
      .send({ roomId: room.id });
    expect(response.status).toBe(httpStatus.FORBIDDEN);
  });

  it('should respond with status 403 if room is full', async () => {
    const user = await createUser();
    const user1 = await createUser();
    const user2 = await createUser();
    const user3 = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketTypeWithHotel();
    await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
    const hotel = await createHotel();
    const room = await createRoomWithHotelId(hotel.id);
    await createBooking(user1.id, room.id);
    await createBooking(user2.id, room.id);
    await createBooking(user3.id, room.id);
    const response = await server
      .put(`/booking/${room.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ roomId: room.id });
    expect(response.status).toBe(httpStatus.FORBIDDEN);
  });
});

describe('when creating a booking', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.post('/booking');
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });
  it('should respond with status 403 if room does not exist', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketTypeWithHotel();
    await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
    const hotel = await createHotel();
    const room = await createRoomWithHotelId(hotel.id);

    const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({
      roomId: Infinity,
    });
    expect(response.status).toBe(httpStatus.FORBIDDEN);
  });
});
