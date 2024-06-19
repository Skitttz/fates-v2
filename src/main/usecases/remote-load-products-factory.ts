import { RemoteLoadProducts } from '@/data/usecases'
import { LoadProducts } from '@/domain/usecases'
import { makeApiUrl } from '@/main/http'
import { makeFetchHttpClient } from '../http'
import { GET_ROUTES_ENUM } from '@/presentation/constants/route'

export const makeRemoteLoadProducts = (): LoadProducts =>
	new RemoteLoadProducts(
		makeApiUrl(GET_ROUTES_ENUM.PRODUCTS),
		makeFetchHttpClient({ cache: 'no-store' }),
	)