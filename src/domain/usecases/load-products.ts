import { ProductModel } from '../models'

export interface LoadProducts {
	load: () => Promise<LoadProducts.Model[] | []>
}

export namespace LoadProducts {
	export type Model = ProductModel
}