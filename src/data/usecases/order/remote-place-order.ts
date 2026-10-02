import { AccessDeniedError, UnexpectedError } from '@/domain/errors';
import { PlaceOrder } from '@/domain/usecases';
import { RemoteOrderModel } from '../../models';
import { HttpClient, HttpStatusCode } from '../../protocols/http';

export class RemotePlaceOrder implements PlaceOrder {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient<RemotePlaceOrder.Model>,
  ) {}

  async place(params: PlaceOrder.Params): Promise<PlaceOrder.Model> {
    const httpResponse = await this.httpClient.request({
      url: this.url,
      method: 'post',
      body: params,
    });

    switch (httpResponse.statusCode) {
      case HttpStatusCode.ok: {
        const order = httpResponse.body;
        if (!order) throw new UnexpectedError();
        return {
          code: order.code,
          total: order.total_in_cents / 100,
          createdAt: order.created_at,
        };
      }
      case HttpStatusCode.unauthorized:
      case HttpStatusCode.forbidden:
        throw new AccessDeniedError();
      default:
        throw new UnexpectedError();
    }
  }
}

export namespace RemotePlaceOrder {
  export type Model = RemoteOrderModel;
}
