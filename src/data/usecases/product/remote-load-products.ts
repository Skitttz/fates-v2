import { UnexpectedError } from '@/domain/errors';
import { LoadProducts } from '@/domain/usecases';
import { adaptRemoteProduct } from '../../helpers';
import { RemoteProductModel, RemoteResponse } from '../../models';
import { HttpClient, HttpStatusCode } from '../../protocols/http';

export class RemoteLoadProducts implements LoadProducts {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient<RemoteLoadProducts.Model>,
  ) {}

  async load(params: LoadProducts.Params = {}): Promise<LoadProducts.Model[]> {
    const httpResponse = await this.httpClient.request({
      url: this.buildUrl(params),
      method: 'get',
    });

    switch (httpResponse.statusCode) {
      case HttpStatusCode.ok:
        return (httpResponse.body?.data ?? []).map((product) =>
          adaptRemoteProduct(product, this.url),
        );
      case HttpStatusCode.noContent:
        return [];
      default:
        throw new UnexpectedError();
    }
  }

  private buildUrl({ query, category }: LoadProducts.Params): string {
    const searchParams = new URLSearchParams();
    if (query?.trim()) searchParams.set('q', query.trim());
    if (category) searchParams.set('category', category);

    const queryString = searchParams.toString();
    return queryString ? `${this.url}?${queryString}` : this.url;
  }
}

export namespace RemoteLoadProducts {
  export type Model = RemoteResponse<RemoteProductModel[]>;
}
