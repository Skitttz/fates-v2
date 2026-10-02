import {
  RateLimitError,
  AccessDeniedError,
  InvalidOrderError,
  UnexpectedError,
} from '@/domain/errors';
import { PlaceOrder } from '@/domain/usecases';
import { RemoteOrderModel, RemoteResponse } from '../../models';
import { HttpClient, HttpStatusCode } from '../../protocols/http';

export class RemotePlaceOrder implements PlaceOrder {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient<RemotePlaceOrder.Model>,
  ) {}

  async place({ items }: PlaceOrder.Params): Promise<PlaceOrder.Model> {
    const httpResponse = await this.httpClient.request({
      url: this.url,
      method: 'post',
      body: {
        items: items.map(({ productId, size, color, quantity }) => ({
          clothingId: productId,
          size,
          color,
          quantity,
        })),
      },
    });

    switch (httpResponse.statusCode) {
      case HttpStatusCode.ok:
      case HttpStatusCode.created: {
        const order = httpResponse.body?.data;
        if (!order) throw new UnexpectedError();
        return { code: order.code, total: order.total, createdAt: order.createdAt };
      }
      case HttpStatusCode.badRequest:
        throw new InvalidOrderError(httpResponse.body?.error);
      case HttpStatusCode.unauthorized:
      case HttpStatusCode.forbidden:
        throw new AccessDeniedError();
      case HttpStatusCode.tooManyRequests:
        throw new RateLimitError();
      default:
        throw new UnexpectedError();
    }
  }
}

export namespace RemotePlaceOrder {
  export type Model = RemoteResponse<RemoteOrderModel>;
}
