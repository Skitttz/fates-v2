import { render } from '@testing-library/react';
import { ReactElement } from 'react';
import { AccountProvider } from '../contexts/account';
import { CartProvider } from '../contexts/cart';
import { InMemoryAccount, InMemoryCart } from './mock-usecases';

export const renderWithProviders = (
  ui: ReactElement,
  { account = new InMemoryAccount(), cart = new InMemoryCart() } = {},
) => {
  const result = render(
    <AccountProvider loadCurrentAccount={account} saveCurrentAccount={account}>
      <CartProvider
        loadCart={cart}
        addToCart={cart}
        removeFromCart={cart}
        updateCartItemQuantity={cart}
        clearCart={cart}
      >
        {ui}
      </CartProvider>
    </AccountProvider>,
  );

  return { ...result, account, cart };
};
