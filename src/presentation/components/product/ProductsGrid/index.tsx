import { Reveal } from '@/presentation/components/ui';
import { ProductCard } from '../ProductCard';
import { ProductsGridProps } from './types';

export function ProductsGrid({ products }: ProductsGridProps) {
  return (
    <ul className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product, index) => (
        <Reveal as="li" key={product.id} delay={(index % 3) * 120}>
          <ProductCard product={product} priority={index < 3} />
        </Reveal>
      ))}
    </ul>
  );
}
