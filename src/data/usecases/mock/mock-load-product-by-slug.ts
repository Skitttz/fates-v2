import { NotFoundError } from '@/domain/errors';
import { ProductModel } from '@/domain/models';
import { LoadProductBySlug } from '@/domain/usecases';

export class MockLoadProductBySlug implements LoadProductBySlug {
  constructor(private readonly products: readonly ProductModel[]) {}

  async load(slug: string): Promise<LoadProductBySlug.Model> {
    const product = this.products.find((product) => product.slug === slug);
    if (!product) throw new NotFoundError();
    return structuredClone(product);
  }
}
