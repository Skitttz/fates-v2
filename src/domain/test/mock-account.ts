import { AccountModel, AuthenticationParams } from '../models';

export const mockAuthenticationParams = (
  overrides: Partial<AuthenticationParams> = {},
): AuthenticationParams => ({
  email: 'any@mail.com',
  password: 'any_password',
  ...overrides,
});

export const mockAccountModel = (overrides: Partial<AccountModel> = {}): AccountModel => ({
  name: 'Any Name',
  email: 'any@mail.com',
  accessToken: 'any_token',
  ...overrides,
});
