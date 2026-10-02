import { NotFoundError, UnexpectedError } from '@/domain/errors';
import { LoadProductBySlug } from '@/domain/usecases';
import { adaptRemoteProduct } from '../../helpers';
import { RemoteProductModel, RemoteResponse } from '../../models';
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
      case HttpStatusCode.ok: {
        const product = httpResponse.body?.data;
        if (!product) throw new UnexpectedError();
        return adaptRemoteProduct(product, this.url);
      }
      case HttpStatusCode.notFound:
        throw new NotFoundError();
      default:
        throw new UnexpectedError();
    }
  }
}

export namespace RemoteLoadProductBySlug {
  export type Model = RemoteResponse<RemoteProductModel>;
}
