import { describe, expect, it } from 'vitest';
import { ValidationBuilder } from './validation-builder';
import { ValidationComposite } from './validation-composite';
import { EmailValidation } from './email-validation';
import { MinLengthValidation } from './min-length-validation';
import { RequiredFieldValidation } from './required-field-validation';

describe('ValidationBuilder', () => {
  it('builds the chained validations for the field', () => {
    const validations = ValidationBuilder.field('email').required().email().min(5).build();

    expect(validations).toEqual([
      new RequiredFieldValidation('email'),
      new EmailValidation('email'),
      new MinLengthValidation('email', 5),
    ]);
  });
});

describe('ValidationComposite', () => {
  const sut = ValidationComposite.build([
    ...ValidationBuilder.field('email').required().email().build(),
    ...ValidationBuilder.field('password').required().min(6).build(),
  ]);

  it('returns the first error message of the field', () => {
    expect(sut.validate('email', { email: '' })).toBe('Campo obrigatório');
    expect(sut.validate('email', { email: 'invalid' })).toBe('Valor inválido');
    expect(sut.validate('password', { password: '123' })).toBe('Mínimo de 6 caracteres');
  });

  it('only runs validators of the requested field', () => {
    expect(sut.validate('email', { email: 'demo@fates.com', password: '' })).toBeNull();
  });
});
