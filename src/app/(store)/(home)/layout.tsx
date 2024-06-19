import { RootStoreLayout } from '@/presentation/layouts/root';
import { IChildren } from '@/core/types';

export default function StoreLayout({ children }: IChildren) {
  return <RootStoreLayout>{children}</RootStoreLayout>;
}
