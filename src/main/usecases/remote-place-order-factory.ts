import { RemotePlaceOrder } from '@/data/usecases';
import { PlaceOrder } from '@/domain/usecases';
import { API_ROUTES } from '../config';
import { makeAuthorizeHttpClientDecorator } from '../decorators';
import { makeApiUrl } from '../http';

export const makeRemotePlaceOrder = (): PlaceOrder =>
  new RemotePlaceOrder(
    makeApiUrl(API_ROUTES.ORDERS),
    makeAuthorizeHttpClientDecorator<RemotePlaceOrder.Model>(),
  );
