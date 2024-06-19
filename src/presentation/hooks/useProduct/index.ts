import { makeRemoteLoadProducts } from '@/main/usecases'
import { getErrorMessage } from '@/presentation/utils/getErrorMessage'
import { useEffect, useState } from 'react'
import { useProductsReturn } from './types'

export async function getProducts() {
	return await makeRemoteLoadProducts().load()
}

export function useProduct() {
	const [state, setState] = useState<useProductsReturn>({
		data: [],
		loading: true,
		error: '',
	})

	async function loadProducts() {
		try {
			const loadedProducts = await getProducts()

			setState((oldState) => {
				return {
					...oldState,
					loading: false,
					data: loadedProducts,
				}
			})
		} catch (error) {
			setState((oldState) => {
				return {
					...oldState,
					loading: false,
					error: getErrorMessage(error),
				}
			})
		}
	}

	useEffect(() => {
		loadProducts()
	}, [])

	return state
}