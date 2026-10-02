import { RequiredFieldError } from '../errors';
import { FieldValidation } from '../protocols';

export class RequiredFieldValidation implements FieldValidation {
  constructor(readonly field: string) {}

  validate(input: Record<string, unknown>): Error | null {
    const value = input[this.field];
    const isEmpty = value === undefined || value === null || String(value).trim() === '';
    return isEmpty ? new RequiredFieldError() : null;
  }
}
