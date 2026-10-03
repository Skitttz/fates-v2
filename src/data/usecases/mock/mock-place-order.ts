import { AccessDeniedError, InvalidOrderError } from '@/domain/errors';
import { ProductModel } from '@/domain/models';
import { LoadCurrentAccount, PlaceOrder } from '@/domain/usecases';

const MAX_ORDER_ITEMS = 50;
const MAX_VARIANT_QUANTITY = 10;

/** Simulates checkout using the local catalog; no orders are persisted. */
export class MockPlaceOrder implements PlaceOrder {
  constructor(
    private readonly products: readonly ProductModel[],
    private readonly loadCurrentAccount: LoadCurrentAccount,
    private readonly accessToken: string,
    private readonly createOrder: (total: number) => PlaceOrder.Model,
  ) {}

  async place({ items }: PlaceOrder.Params): Promise<PlaceOrder.Model> {
    const account = await this.loadCurrentAccount.load();
    if (account?.accessToken !== this.accessToken) throw new AccessDeniedError();
    return this.createOrder(this.calculateTotal(items));
  }

  private calculateTotal(items: PlaceOrder.Params['items']): number {
    if (!Array.isArray(items) || items.length === 0 || items.length > MAX_ORDER_ITEMS) {
      throw new InvalidOrderError('Pedido inválido');
    }

    const quantities = new Map<string, number>();
    let total = 0;
    for (const item of items) {
      const product = this.products.find((product) => product.id === item.productId);
      if (
        !product ||
        !product.sizes.includes(item.size) ||
        !product.colors.includes(item.color) ||
        !Number.isInteger(item.quantity) ||
        item.quantity < 1 ||
        item.quantity > MAX_VARIANT_QUANTITY
      ) {
        throw new InvalidOrderError('Item inválido');
      }
      const key = JSON.stringify([product.id, item.size, item.color]);
      const quantity = (quantities.get(key) || 0) + item.quantity;
      if (quantity > MAX_VARIANT_QUANTITY) {
        throw new InvalidOrderError('Limite de 10 unidades por variante');
      }
      quantities.set(key, quantity);
      total += product.price * item.quantity;
    }
    return Math.round(total * 100) / 100;
  }
}
