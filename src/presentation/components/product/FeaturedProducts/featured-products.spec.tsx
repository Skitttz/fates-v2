import '@/presentation/test/mock-next-navigation';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { UnexpectedError } from '@/domain/errors';
import { mockProductModels } from '@/domain/test';
import { LoadProducts } from '@/domain/usecases';
import { FeaturedProducts } from '.';

const makeLoadProducts = (result: Promise<LoadProducts.Model[]>): LoadProducts => ({
  load: vi.fn(() => result),
});

describe('FeaturedProducts', () => {
  it('renders only the first products up to the limit', async () => {
    const loadProducts = makeLoadProducts(Promise.resolve(mockProductModels(5)));

    render(await FeaturedProducts({ loadProducts, limit: 3 }));

    expect(screen.getAllByTestId('product-card')).toHaveLength(3);
    expect(loadProducts.load).toHaveBeenCalledOnce();
  });

  it('renders an error state instead of breaking the page', async () => {
    const loadProducts = makeLoadProducts(Promise.reject(new UnexpectedError()));

    render(await FeaturedProducts({ loadProducts, limit: 3 }));

    expect(screen.getByRole('alert')).toHaveTextContent(new UnexpectedError().message);
  });
});
