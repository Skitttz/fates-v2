import { Validation } from '@/presentation/protocols';
import { ValidationBuilder, ValidationComposite } from '@/validation/validators';

export const makeLoginValidation = (): Validation =>
  ValidationComposite.build([
    ...ValidationBuilder.field('email').required().email().build(),
    ...ValidationBuilder.field('password').required().min(6).build(),
  ]);
