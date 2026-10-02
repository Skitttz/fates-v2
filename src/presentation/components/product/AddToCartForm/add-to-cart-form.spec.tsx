import '@/presentation/test/mock-next-navigation';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { mockProductModel } from '@/domain/test';
import { renderWithProviders } from '@/presentation/test';
import { AddToCartForm } from '.';

describe('AddToCartForm', () => {
  it('requires a size before adding to the cart', async () => {
    const { cart } = renderWithProviders(<AddToCartForm product={mockProductModel()} />);

    await userEvent.click(screen.getByRole('button', { name: 'Adicionar ao carrinho' }));

    expect(screen.getByRole('alert')).toHaveTextContent('Escolha um tamanho');
    expect(cart.items).toHaveLength(0);
  });

  it('adds the selected variant with quantity to the cart', async () => {
    const product = mockProductModel({ sizes: ['P', 'M'], colors: ['Preto'] });
    const { cart } = renderWithProviders(<AddToCartForm product={product} />);

    await userEvent.click(screen.getByRole('radio', { name: 'M' }));
    await userEvent.click(screen.getByRole('button', { name: 'Aumentar quantidade' }));
    await userEvent.click(screen.getByRole('button', { name: 'Adicionar ao carrinho' }));

    expect(await screen.findByRole('button', { name: /Adicionado/ })).toBeInTheDocument();
    expect(cart.items).toEqual([
      expect.objectContaining({
        productId: product.id,
        size: 'M',
        color: 'Preto',
        quantity: 2,
        price: product.price,
      }),
    ]);
  });

  it('preselects the size when the product has a single size', async () => {
    const { cart } = renderWithProviders(
      <AddToCartForm product={mockProductModel({ sizes: ['Único'] })} />,
    );

    await userEvent.click(screen.getByRole('button', { name: 'Adicionar ao carrinho' }));

    expect(await screen.findByRole('button', { name: /Adicionado/ })).toBeInTheDocument();
    expect(cart.items[0].size).toBe('Único');
  });
});
