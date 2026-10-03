import { ProductModel } from '@/domain/models';
import { LoadProducts } from '@/domain/usecases';

export class MockLoadProducts implements LoadProducts {
  constructor(private readonly products: readonly ProductModel[]) {}

  async load({ query, category }: LoadProducts.Params = {}): Promise<LoadProducts.Model[]> {
    const search = query?.trim().toLocaleLowerCase('pt-BR') || '';
    return structuredClone(
      this.products.filter(
        (product) =>
          (!category || product.category === category) &&
          `${product.name} ${product.description}`.toLocaleLowerCase('pt-BR').includes(search),
      ),
    );
  }
}
