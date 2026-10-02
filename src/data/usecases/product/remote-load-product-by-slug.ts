import { NotFoundError, UnexpectedError } from '@/domain/errors';
import { LoadProductBySlug } from '@/domain/usecases';
import { adaptRemoteProduct } from '../../helpers';
import { RemoteProductModel } from '../../models';
import { HttpClient, HttpStatusCode } from '../../protocols/http';

export class RemoteLoadProductBySlug implements LoadProductBySlug {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient<RemoteLoadProductBySlug.Model>,
  ) {}

  async load(slug: string): Promise<LoadProductBySlug.Model> {
    const httpResponse = await this.httpClient.request({
      url: `${this.url}/${encodeURIComponent(slug)}`,
      method: 'get',
    });

    switch (httpResponse.statusCode) {
      case HttpStatusCode.ok:
        if (!httpResponse.body) throw new UnexpectedError();
        return adaptRemoteProduct(httpResponse.body);
      case HttpStatusCode.notFound:
        throw new NotFoundError();
      default:
        throw new UnexpectedError();
    }
  }
}

export namespace RemoteLoadProductBySlug {
  export type Model = RemoteProductModel;
}
