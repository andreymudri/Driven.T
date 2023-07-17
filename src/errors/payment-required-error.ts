import { ApplicationError } from '../protocols';

export function PaymentIsRequiredError(): ApplicationError {
  return {
    name: 'PaymentIsRequiredError',
    message: 'Payment is required.',
  };
}
