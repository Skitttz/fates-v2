import { LoadProducts } from '@/domain/usecases'

export type StoreLayoutProps = {
	data?: LoadProducts.Model[] | []
	loading?: boolean
	error?: string
}