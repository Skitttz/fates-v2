'use client';

import { useProduct } from '@@hooks/useProduct';
import StoreLayout from './layout';

export function Store() {
  const { data, error, loading } = useProduct();

  return <StoreLayout data={data} error={error} loading={loading} />;
}
