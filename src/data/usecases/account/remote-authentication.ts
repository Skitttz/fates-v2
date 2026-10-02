import { InvalidCredentialsError, UnexpectedError } from '@/domain/errors';
import { Authentication } from '@/domain/usecases';
import { RemoteAccountModel, RemoteResponse } from '../../models';
import { HttpClient, HttpStatusCode } from '../../protocols/http';

export class RemoteAuthentication implements Authentication {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient<RemoteAuthentication.Model>,
  ) {}

  async auth(params: Authentication.Params): Promise<Authentication.Model> {
    const httpResponse = await this.httpClient.request({
      url: this.url,
      method: 'post',
      body: params,
    });

    switch (httpResponse.statusCode) {
      case HttpStatusCode.ok: {
        const account = httpResponse.body?.data;
        if (!account) throw new UnexpectedError();
        return { name: account.user.name, email: account.user.email, accessToken: account.token };
      }
      case HttpStatusCode.unauthorized:
        throw new InvalidCredentialsError();
      default:
        throw new UnexpectedError();
    }
  }
}

export namespace RemoteAuthentication {
  export type Model = RemoteResponse<RemoteAccountModel>;
}
