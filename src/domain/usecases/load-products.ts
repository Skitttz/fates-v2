import { ProductModel } from '../models';

export interface LoadProducts {
  load: (params?: LoadProducts.Params) => Promise<LoadProducts.Model[]>;
}

export namespace LoadProducts {
  export type Params = {
    query?: string;
    category?: string;
  };

  export type Model = ProductModel;
}
