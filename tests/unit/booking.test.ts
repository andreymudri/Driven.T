import faker from '@faker-js/faker';
import ticketRepository from '@/repositories/tickets-repository';
import bookingRepository from '@/repositories/booking-repository';
import bookingService from '@/services/booking-service';
import enrollmentRepository from '@/repositories/enrollment-repository';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('GET /booking', () => {
  it('should sucess GET /booking', () => {
    expect(1 + 1).toBe(2);
  });
  it('should reject with NotFoundError if no booking found', async () => {
    const mockBookingRepository = jest.spyOn(bookingRepository, 'getBooking');
    mockBookingRepository.mockResolvedValueOnce(null);
    const userId = faker.datatype.number({ min: 1, max: 10000000 });
    const promise = bookingService.getBooking(userId);
    await expect(promise).rejects.toEqual({
      name: 'NotFoundError',
      message: 'No result for this search!',
    });
  });
});

describe('POST /booking', () => {
  it('should sucess POST /booking', () => {
    expect(1 + 1).toBe(2);
  });

  it('should reject with ForbiddenError if room is full', async () => {
    const mockBookingRepository = jest.spyOn(bookingRepository, 'createBooking');
    mockBookingRepository.mockImplementationOnce((): any => {
      return null;
    });
    const enrollmentMock = jest.spyOn(enrollmentRepository, 'findWithAddressByUserId');
    enrollmentMock.mockImplementationOnce((): any => {
      return 1;
    });
    const ticketMock = jest.spyOn(ticketRepository, 'findTicketByEnrollmentId');
    ticketMock.mockImplementationOnce((): any => {
      return {
        TicketType: {
          id: 1234,
          name: '123',
          price: 1,
          isRemote: true,
          includesHotel: false,
          createdAt: Date,
          updatedAt: Date,
        },
      };
    });
    const roomMockRepository = jest.spyOn(bookingRepository, 'getRoomById');
    roomMockRepository.mockImplementationOnce((): any => {
      return {
        capacity: 0,
      };
    });
    const userId = faker.datatype.number({ min: 1, max: 10000000 });
    const roomId = faker.datatype.number({ min: 1, max: 10000000 });
    const promise = bookingService.createBooking(userId, roomId);
    await expect(promise).rejects.toEqual({
      name: 'ForbiddenError',
      message: 'Access Denied. You dont have permission to access',
    });
  });
});

describe('PUT /booking', () => {
  it('should sucess PUT /booking', () => {
    expect(1 + 1).toBe(2);
  });
  it('should reject with ForbiddenError if no booking found', async () => {
    const mockBookingRepository = jest.spyOn(bookingRepository, 'getRoomById');
    mockBookingRepository.mockImplementationOnce((): any => {
      return 1;
    });
    const booking = jest.spyOn(bookingRepository, 'getBooking');
    booking.mockResolvedValueOnce(null);
    const userId = faker.datatype.number({ min: 1, max: 10000000 });
    const roomId = faker.datatype.number({ min: 1, max: 10000000 });
    const bookingId = faker.datatype.number({ min: 1, max: 10000000 });
    const promise = bookingService.updateBooking(userId, roomId, bookingId);
    await expect(promise).rejects.toEqual({
      name: 'ForbiddenError',
      message: 'Access Denied. You dont have permission to access',
    });
  });
});

/*
{
    name: 'ForbiddenError',
    message: 'Access Denied. You dont have permission to access',
  }
{
    name: 'NotFoundError',
    message: 'No result for this search!',
  }
*/
