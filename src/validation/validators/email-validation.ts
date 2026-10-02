import { InvalidFieldError } from '../errors';
import { FieldValidation } from '../protocols';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export class EmailValidation implements FieldValidation {
  constructor(readonly field: string) {}

  validate(input: Record<string, unknown>): Error | null {
    const value = input[this.field];
    if (!value) return null;
    return EMAIL_REGEX.test(String(value)) ? null : new InvalidFieldError();
  }
}
