import { ProductPreviewModel } from '../models'

export interface ProductPreview {
	load: () => Promise<ProductPreview.Model[] | []>
}

export namespace ProductPreview {
	export type Model = ProductPreviewModel
}