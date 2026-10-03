import { AccountModel, AuthenticationParams } from '@/domain/models';

export const mockCredentials: AuthenticationParams = {
  email: 'demo@fates.com',
  password: 'fates123',
};

export const mockAccount: AccountModel = {
  name: 'Demo',
  email: mockCredentials.email,
  accessToken: 'fates-local-demo-token',
};
