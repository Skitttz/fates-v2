import { ProductModel } from '../models';

export interface LoadProductBySlug {
  load: (slug: string) => Promise<LoadProductBySlug.Model>;
}

export namespace LoadProductBySlug {
  export type Model = ProductModel;
}
