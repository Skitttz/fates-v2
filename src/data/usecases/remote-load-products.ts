import {  UnexpectedError } from '@/domain/errors'
import { LoadProducts } from '@/domain/usecases'
import { RemoteProduct } from '../models'
import { HttpClient, HttpStatusCode } from '../protocols/http'

export class RemoteLoadProducts implements LoadProducts {
	constructor(
		private readonly url: string,
		private readonly httpClient: HttpClient<RemoteLoadMovies.Model>,
	) {}

	async load(): Promise<LoadProducts.Model[]> {
		const httpResponse = await this.httpClient.request({
			url: this.url,
			method: 'get',
		})

		const remoteProductsResult = httpResponse.body?.results || []

		const results = remoteProductsResult.map((result) => {
			return {
				...result,
				image: process.env.NEXT_PUBLIC_PRODUCT_IMAGE_URL,
				price: result.price,
				name: result.name,
			}
		})

		switch (httpResponse.statusCode) {
			case HttpStatusCode.ok:
				return results

			// case HttpStatusCode.unauthorized:
			// 	throw new UnauthorizedError()

			default:
				throw new UnexpectedError()
		}
	}
}

export namespace RemoteLoadMovies {
	export type Model = {
		results: RemoteProduct[]
	}
}