import { Validation } from '@/presentation/protocols';
import { FieldValidation } from '../protocols';

export class ValidationComposite implements Validation {
  private constructor(private readonly validators: FieldValidation[]) {}

  static build(validators: FieldValidation[]): ValidationComposite {
    return new ValidationComposite(validators);
  }

  validate(fieldName: string, input: Record<string, unknown>): string | null {
    for (const validator of this.validators.filter((v) => v.field === fieldName)) {
      const error = validator.validate(input);
      if (error) return error.message;
    }
    return null;
  }
}
