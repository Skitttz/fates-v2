import { InvalidCredentialsError } from '@/domain/errors';
import { Authentication } from '@/domain/usecases';

export class MockAuthentication implements Authentication {
  constructor(
    private readonly credentials: Authentication.Params,
    private readonly account: Authentication.Model,
  ) {}

  async auth({ email, password }: Authentication.Params): Promise<Authentication.Model> {
    if (
      email.trim().toLowerCase() !== this.credentials.email ||
      password !== this.credentials.password
    ) {
      throw new InvalidCredentialsError();
    }
    return { ...this.account };
  }
}
