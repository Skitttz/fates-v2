import { GetStorage } from '@/data/protocols/cache';
import { HttpClient, HttpRequest, HttpResponse } from '@/data/protocols/http';
import { AccountModel } from '@/domain/models';

export class AuthorizeHttpClientDecorator<R = unknown> implements HttpClient<R> {
  constructor(
    private readonly accountKey: string,
    private readonly getStorage: GetStorage,
    private readonly httpClient: HttpClient<R>,
  ) {}

  async request(data: HttpRequest): Promise<HttpResponse<R>> {
    const account = this.getStorage.get<AccountModel>(this.accountKey);

    if (account?.accessToken) {
      data = {
        ...data,
        headers: { ...data.headers, 'x-access-token': account.accessToken },
      };
    }

    return this.httpClient.request(data);
  }
}
