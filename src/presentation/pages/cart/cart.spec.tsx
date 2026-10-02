import { routerMock } from '@/presentation/test/mock-next-navigation';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { AccessDeniedError } from '@/domain/errors';
import { CartItemModel } from '@/domain/models';
import { mockAccountModel } from '@/domain/test';
import {
  InMemoryAccount,
  InMemoryCart,
  PlaceOrderSpy,
  renderWithProviders,
} from '@/presentation/test';
import { Cart } from '.';

const item: CartItemModel = {
  id: 'product-1:M:Preto',
  productId: 'product-1',
  slug: 'camiseta',
  name: 'Camiseta Basic Fates',
  image: '/images/products/camiseta.png',
  price: 89.9,
  size: 'M',
  color: 'Preto',
  quantity: 2,
};

const makeSut = ({ logged = true } = {}) => {
  const placeOrder = new PlaceOrderSpy();
  const account = new InMemoryAccount(logged ? mockAccountModel() : null);
  const cart = new InMemoryCart([item]);
  renderWithProviders(<Cart placeOrder={placeOrder} />, { account, cart });
  return { placeOrder, account, cart };
};

describe('Cart page', () => {
  beforeEach(() => {
    routerMock.push.mockClear();
  });

  it('shows an empty state when there are no items', async () => {
    renderWithProviders(<Cart placeOrder={new PlaceOrderSpy()} />);

    expect(await screen.findByText('Seu carrinho tá vazio')).toBeInTheDocument();
  });

  it('lists items and the total', async () => {
    makeSut();

    expect(await screen.findByTestId('cart-item')).toHaveTextContent('Camiseta Basic Fates');
    expect(screen.getByTestId('cart-total').textContent?.replace(/\s/g, ' ')).toBe('R$ 179,80');
  });

  it('redirects to login when checking out without an account', async () => {
    const { placeOrder } = makeSut({ logged: false });

    await userEvent.click(await screen.findByRole('button', { name: 'Entrar para finalizar' }));

    expect(routerMock.push).toHaveBeenCalledWith('/login?redirect=%2Fcart');
    expect(placeOrder.place).not.toHaveBeenCalled();
  });

  it('places the order, clears the cart and shows the confirmation', async () => {
    const { placeOrder, cart } = makeSut();

    await userEvent.click(await screen.findByRole('button', { name: 'Finalizar compra' }));

    expect(await screen.findByTestId('order-code')).toHaveTextContent('FTS-TEST');
    expect(placeOrder.params).toEqual({
      items: [{ productId: 'product-1', size: 'M', color: 'Preto', quantity: 2 }],
    });
    expect(cart.items).toEqual([]);
  });

  it('signs out and redirects to login on AccessDeniedError', async () => {
    const { placeOrder, account } = makeSut();
    placeOrder.error = new AccessDeniedError();

    await userEvent.click(await screen.findByRole('button', { name: 'Finalizar compra' }));

    await waitFor(() => expect(routerMock.push).toHaveBeenCalledWith('/login?redirect=%2Fcart'));
    expect(account.account).toBeNull();
  });
});
