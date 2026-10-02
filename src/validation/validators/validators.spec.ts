import { describe, expect, it } from 'vitest';
import { InvalidFieldError, MinLengthError, RequiredFieldError } from '../errors';
import { EmailValidation } from './email-validation';
import { MinLengthValidation } from './min-length-validation';
import { RequiredFieldValidation } from './required-field-validation';

describe('RequiredFieldValidation', () => {
  it.each(['', '   ', undefined, null])('returns error for empty value %p', (value) => {
    const sut = new RequiredFieldValidation('email');
    expect(sut.validate({ email: value })).toEqual(new RequiredFieldError());
  });

  it('returns null when value is filled', () => {
    expect(new RequiredFieldValidation('email').validate({ email: 'a' })).toBeNull();
  });
});

describe('EmailValidation', () => {
  it.each(['invalid', 'a@b', 'a b@mail.com'])('returns error for %s', (email) => {
    expect(new EmailValidation('email').validate({ email })).toEqual(new InvalidFieldError());
  });

  it('returns null for a valid email', () => {
    expect(new EmailValidation('email').validate({ email: 'demo@fates.com' })).toBeNull();
  });

  it('returns null for empty value (required handles it)', () => {
    expect(new EmailValidation('email').validate({ email: '' })).toBeNull();
  });
});

describe('MinLengthValidation', () => {
  it('returns error when value is shorter than min', () => {
    expect(new MinLengthValidation('password', 6).validate({ password: '123' })).toEqual(
      new MinLengthError(6),
    );
  });

  it('returns null when value has min length', () => {
    expect(new MinLengthValidation('password', 6).validate({ password: '123456' })).toBeNull();
  });
});
