import { LoadProducts } from '@/domain/usecases'

export type useProductsReturn = {
	data: LoadProducts.Model[] | []
	loading: boolean
	error: string
}