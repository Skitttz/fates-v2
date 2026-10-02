import '@/presentation/test/mock-next-navigation';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { UnexpectedError } from '@/domain/errors';
import { mockProductModels } from '@/domain/test';
import { LoadProducts } from '@/domain/usecases';
import { CatalogResults } from '.';

const makeLoadProducts = (result: Promise<LoadProducts.Model[]>): LoadProducts => ({
  load: vi.fn(() => result),
});

describe('CatalogResults', () => {
  it('loads with the filters and shows the count for the query', async () => {
    const loadProducts = makeLoadProducts(Promise.resolve(mockProductModels(2)));

    render(await CatalogResults({ loadProducts, query: 'gorro', category: 'acessorios' }));

    expect(loadProducts.load).toHaveBeenCalledWith({ query: 'gorro', category: 'acessorios' });
    expect(screen.getAllByTestId('product-card')).toHaveLength(2);
    expect(screen.getByText(/2 peças encontradas/)).toHaveTextContent('“gorro”');
  });

  it('uses the singular when a single product is found', async () => {
    const loadProducts = makeLoadProducts(Promise.resolve(mockProductModels(1)));

    render(await CatalogResults({ loadProducts }));

    expect(screen.getByText(/1 peça encontrada/)).toBeInTheDocument();
  });

  it('shows the empty state with a link to clear filters', async () => {
    const loadProducts = makeLoadProducts(Promise.resolve([]));

    render(await CatalogResults({ loadProducts, query: 'nada' }));

    expect(screen.getByText('Nada por aqui')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Limpar filtros' })).toHaveAttribute(
      'href',
      '/products',
    );
  });

  it('shows an error state when loading fails', async () => {
    const loadProducts = makeLoadProducts(Promise.reject(new UnexpectedError()));

    render(await CatalogResults({ loadProducts }));

    expect(screen.getByRole('alert')).toHaveTextContent(new UnexpectedError().message);
  });
});
