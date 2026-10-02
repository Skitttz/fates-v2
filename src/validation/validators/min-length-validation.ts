import { MinLengthError } from '../errors';
import { FieldValidation } from '../protocols';

export class MinLengthValidation implements FieldValidation {
  constructor(
    readonly field: string,
    private readonly minLength: number,
  ) {}

  validate(input: Record<string, unknown>): Error | null {
    const value = input[this.field];
    if (!value) return null;
    return String(value).length >= this.minLength ? null : new MinLengthError(this.minLength);
  }
}
