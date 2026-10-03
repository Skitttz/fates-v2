import { describe, expect, it, vi } from 'vitest';
import { formatCurrency } from './format-currency';
import { preventDefault } from './prevent-default';
import { getImageFit } from './product-image';
import { safeRedirect } from './safe-redirect';
import { buildProductsHref } from './build-products-href';

describe('formatCurrency', () => {
  it('formats values as BRL', () => {
    expect(formatCurrency(89.9).replace(/\s/g, ' ')).toBe('R$ 89,90');
    expect(formatCurrency(1299).replace(/\s/g, ' ')).toBe('R$ 1.299,00');
  });
});

describe('safeRedirect', () => {
  it.each([
    ['/cart', '/cart'],
    ['/products?q=touca', '/products?q=touca'],
    [undefined, '/'],
    ['', '/'],
    ['https://evil.com', '/'],
    ['//evil.com', '/'],
    ['/\n/evil.com', '/'],
    ['/\t/evil.com', '/'],
    ['/\r/evil.com', '/'],
    ['/products?q=calca%20preta', '/products?q=calca%20preta'],
    ['/\\evil.com', '/'],
  ])('safeRedirect(%p) -> %p', (input, expected) => {
    expect(safeRedirect(input)).toBe(expected);
  });
});

describe('getImageFit', () => {
  it('uses contain for png cutouts and cover for photos', () => {
    expect(getImageFit('/a.png')).toBe('contain');
    expect(getImageFit('/a.jpg')).toBe('cover');
  });
});

describe('buildProductsHref', () => {
  it('builds the catalog url keeping only filled filters', () => {
    expect(buildProductsHref({})).toBe('/products');
    expect(buildProductsHref({ query: 'touca' })).toBe('/products?q=touca');
    expect(buildProductsHref({ query: 'touca', category: 'acessorios' })).toBe(
      '/products?q=touca&category=acessorios',
    );
  });
});

describe('preventDefault', () => {
  it('cancels the default action of the event', () => {
    const event = { preventDefault: vi.fn() };

    preventDefault(event);

    expect(event.preventDefault).toHaveBeenCalledTimes(1);
  });
});
