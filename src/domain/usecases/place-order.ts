import { CartItemModel, OrderModel } from '../models';

export interface PlaceOrder {
  place: (params: PlaceOrder.Params) => Promise<PlaceOrder.Model>;
}

export namespace PlaceOrder {
  export type Params = {
    items: Pick<CartItemModel, 'productId' | 'size' | 'color' | 'quantity'>[];
  };

  export type Model = OrderModel;
}
