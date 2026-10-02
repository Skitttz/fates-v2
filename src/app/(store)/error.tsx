'use client';

import { ErrorPage } from '@/presentation/pages/error';
import { ErrorPageProps } from '@/presentation/pages/error/types';

export default function StoreError(props: ErrorPageProps) {
  return <ErrorPage {...props} />;
}
